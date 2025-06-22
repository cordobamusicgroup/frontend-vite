import React, { useEffect, type ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { jwtDecode } from 'jwt-decode';
import { useApiRequest } from '@/hooks/useApiRequest';
import { apiRoutes } from '@/lib/api.routes';
import { useAuthStore, useUserStore } from '@/stores';
import webRoutes from '@/lib/web.routes';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Box, Typography } from '@mui/material';
import { AxiosError } from 'axios';
import { ApiErrorResponse } from '@/types/api';
import CenteredLoader from '@/components/ui/molecules/CenteredLoader';
import { SessionTimeoutDialogContainer } from '../session/SessionTimeoutDialogContainer';
import { logColor } from '@/lib/log.util';
import { formatError } from '@/lib/formatApiError.util';

interface JWTPayload {
  sub: string;
  email: string;
  iat: number;
  exp: number;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  useEffect(() => {
    logColor('info', 'AuthProvider', 'mounted');
    return () => logColor('info', 'AuthProvider', 'unmounted');
  }, []);

  const { apiRequest } = useApiRequest();
  const { setUserData } = useUserStore();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { setAuthenticated, isAuthenticated, clearAuthentication } = useAuthStore();

  const isPublicRoute = (currentPath: string) => {
    return webRoutes.protected.find((route: any) => route.path === currentPath && route.public === true) !== undefined;
  };

  const checkToken = async () => {
    const currentPath = location.pathname;
    if (isPublicRoute(currentPath)) {
      logColor('info', 'AuthProvider', 'Public route, token check OK');
      return;
    }
    const currentToken = useAuthStore.getState().token;
    if (!currentToken) {
      // Si no hay token, intenta refrescar SOLO si es la primera carga (no por expiración)
      // Detecta recarga de página de forma segura
      const navEntry = performance && (performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined);
      if (navEntry && navEntry.type === 'reload') {
        try {
          logColor('info', 'AuthProvider', 'No token, intentando refresh tras recarga...');
          // El refreshTokenMutation ahora debe hacerse aquí manualmente
          // Puedes importar y usar useAuthQueries temporalmente aquí si lo necesitas
        } catch {
          logColor('error', 'AuthProvider', 'Refresh failed after reload, clearing auth');
        }
      }
      clearAuthentication();
      queryClient.clear();
      if (location.pathname !== webRoutes.login) {
        navigate(webRoutes.login, { replace: true });
      }
      return;
    }
    // Token presente
    try {
      jwtDecode<JWTPayload>(currentToken!);
      logColor('success', 'AuthProvider', 'Token válido, auth ready');
    } catch {
      logColor('error', 'AuthProvider', 'Token decode failed, clearing auth');
      clearAuthentication();
      queryClient.clear();
      if (location.pathname !== webRoutes.login) {
        navigate(webRoutes.login, { replace: true });
      }
    }
  };

  useEffect(() => {
    checkToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const { isLoading: isLoadingUser, error: userError } = useQuery({
    queryKey: ['auth', 'user'],
    queryFn: async () => {
      logColor('info', 'AuthProvider', 'Loading user from API...');
      const response = await apiRequest<any>({
        url: apiRoutes.auth.me,
        method: 'get',
      });
      setUserData(response);
      setAuthenticated(true);
      logColor('success', 'AuthProvider', 'User loaded and authenticated');
      return response;
    },
    enabled: !!useAuthStore.getState().token,
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });

  // Loader persistente y con mensaje personalizado
  const [showLoader, setShowLoader] = React.useState(false);

  useEffect(() => {
    if (isLoadingUser) {
      setShowLoader(true);
    } else {
      setShowLoader(false);
    }
  }, [isLoadingUser]);

  if (showLoader) {
    logColor('info', 'AuthProvider', 'Loading...');
    return <CenteredLoader open={true} text="Loading user, please wait..." />;
  }

  if (isAuthenticated && userError) {
    const is429Error = (userError as AxiosError<ApiErrorResponse>).response?.data.statusCode === 429;
    logColor('error', 'AuthProvider', 'Error loading user:', userError);
    let errorMessage = 'Failed to load user data.';
    if (is429Error) {
      errorMessage = 'Too many requests. Please wait 60 seconds before trying again.';
      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            textAlign: 'center',
            padding: 2,
            gap: 2,
          }}
        >
          <Typography color="error" variant="h4" fontWeight={700} mb={1}>
            429: Too Many Requests
          </Typography>
          <Typography color="text.secondary" variant="h6" mb={2}>
            {errorMessage}
          </Typography>
          <Typography color="text.secondary" variant="body2">
            If you just logged in or refreshed, please wait a moment before trying again.
            <br />
            This is a temporary protection against excessive requests.
          </Typography>
        </Box>
      );
    } else {
      const formatted = formatError(userError);
      if (formatted.message && formatted.message.length > 0) {
        errorMessage = formatted.message.join(', ');
      } else if (userError instanceof Error && userError.message) {
        errorMessage = userError.message;
      }
    }
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          textAlign: 'center',
          padding: 2,
        }}
      >
        <Typography color="error" variant="h6">
          {errorMessage}
        </Typography>
      </Box>
    );
  }

  // Si todo OK, render hijos
  return (
    <>
      {children}
      <SessionTimeoutDialogContainer />
    </>
  );
};
