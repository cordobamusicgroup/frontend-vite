import React, { useEffect, useState, useCallback, type ReactNode } from 'react';
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
import SessionTimeoutDialog from '@/components/ui/molecules/SessionTimeoutDialog';
import useAuthQueries from '../hooks/useAuthQueries';
import { logColor } from '@/lib/log.util';
import { formatError } from '@/lib/formatApiError.util';
import { SESSION_TIMEOUT_WARNING_SECONDS, useSessionTimeout } from '@/hooks/useSessionTimeout';

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

  const { refreshTokenMutation, logoutMutation } = useAuthQueries();
  const [tokenChecked, setTokenChecked] = useState(false);
  const token = useAuthStore((s) => s.token);

  const isPublicRoute = (currentPath: string) => {
    return webRoutes.protected.find((route: any) => route.path === currentPath && route.public === true) !== undefined;
  };

  const checkToken = async () => {
    const currentPath = location.pathname;
    if (isPublicRoute(currentPath)) {
      setTokenChecked(true);
      logColor('info', 'AuthProvider', 'Public route, token check OK');
      return;
    }

    const currentToken = useAuthStore.getState().token;
    const currentTime = Date.now() / 1000;

    if (!currentToken) {
      try {
        logColor('info', 'AuthProvider', 'No token, refreshing...');
        await refreshTokenMutation.mutateAsync();
        setTokenChecked(true);
        logColor('success', 'AuthProvider', 'Token refreshed, auth ready');
      } catch {
        logColor('error', 'AuthProvider', 'Refresh failed, clearing auth');
        clearAuthentication();
        queryClient.clear();
        if (location.pathname !== webRoutes.login) {
          navigate(webRoutes.login, { replace: true });
        }
        setTokenChecked(true);
      }
      return;
    }

    // Token presente
    try {
      const decoded = jwtDecode<JWTPayload>(currentToken!);
      // Refrescar si el token expira en menos de 60 segundos
      if (decoded.exp < currentTime + 60) {
        try {
          logColor('info', 'AuthProvider', 'Token expira pronto o expirado, refrescando...');
          await refreshTokenMutation.mutateAsync();
          setTokenChecked(true);
          logColor('success', 'AuthProvider', 'Token refrescado antes de expirar, auth ready');
        } catch {
          logColor('error', 'AuthProvider', 'Refresh antes de expirar falló, limpiando auth');
          clearAuthentication();
          queryClient.clear();
          if (location.pathname !== webRoutes.login) {
            navigate(webRoutes.login, { replace: true });
          }
          setTokenChecked(true);
        }
        return;
      }
      setTokenChecked(true);
      logColor('success', 'AuthProvider', 'Token válido, auth ready');
    } catch {
      logColor('error', 'AuthProvider', 'Token decode failed, clearing auth');
      clearAuthentication();
      queryClient.clear();
      if (location.pathname !== webRoutes.login) {
        navigate(webRoutes.login, { replace: true });
      }
      setTokenChecked(true);
    }
  };

  const handleLogout = useCallback(async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch (e) {
      logColor('error', 'AuthProvider', 'Auto logout failed', e);
    }
  }, [logoutMutation]);

  const handleStayLogged = async () => {
    try {
      await refreshTokenMutation.mutateAsync();
    } catch (e) {
      logColor('error', 'AuthProvider', 'Refresh during countdown failed', e);
      await logoutMutation.mutateAsync();
    }
  };

  useEffect(() => {
    setTokenChecked(false);
    checkToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  // Extraer exp del token
  let exp: number | null = null;
  if (token) {
    try {
      exp = jwtDecode<JWTPayload>(token).exp;
    } catch {
      exp = null;
    }
  }

  // Hook de timeout de sesión
  const sessionCountdown = useSessionTimeout(
    exp,
    () => {
      logColor('info', 'AuthProvider', 'Mostrando SessionTimeoutDialog');
    },
    SESSION_TIMEOUT_WARNING_SECONDS,
  );

  // Ya no es necesario showSessionDialog, el hook controla el rango

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
    enabled: tokenChecked && !!useAuthStore.getState().token,
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });

  if (!tokenChecked || refreshTokenMutation.isPending || isLoadingUser) {
    logColor('info', 'AuthProvider', 'Loading...', { tokenChecked, isPending: refreshTokenMutation.isPending, isLoadingUser });
    return <CenteredLoader open={true} />;
  }

  if (isAuthenticated && userError) {
    const is429Error = (userError as AxiosError<ApiErrorResponse>).response?.data.statusCode === 429;
    logColor('error', 'AuthProvider', 'Error loading user:', userError);
    let errorMessage = 'Failed to load user data.';
    if (is429Error) {
      errorMessage = 'Too many requests. Please wait 60 seconds before trying again.';
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
      <SessionTimeoutDialog open={typeof sessionCountdown === 'number'} countdown={sessionCountdown ?? 0} onStayLoggedIn={handleStayLogged} onLogout={handleLogout} />
    </>
  );
};
