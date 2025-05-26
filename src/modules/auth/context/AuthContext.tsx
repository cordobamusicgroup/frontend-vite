import React, { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { jwtDecode } from 'jwt-decode';
import { useApiRequest } from '@/hooks/useApiRequest';
import { apiRoutes } from '@/lib/api.routes';
import { useAuthStore, useUserStore } from '@/stores';
import webRoutes from '@/lib/web.routes';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Box, Typography } from '@mui/material';
import CenteredLoader from '@/components/ui/molecules/CenteredLoader';
import useAuthQueries from '../hooks/useAuthQueries';
import { logColor } from '@/lib/log.util';

interface JWTPayload {
  sub: string;
  email: string;
  iat: number;
  exp: number;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext(null);

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

  const { refreshTokenMutation } = useAuthQueries();
  const [tokenChecked, setTokenChecked] = useState(false);

  // Previene dobles ejecuciones en StrictMode
  const hasCheckedTokenRef = useRef(false);

  const isPublicRoute = (currentPath: string) => {
    return webRoutes.protected.find((route: any) => route.path === currentPath && route.public === true) !== undefined;
  };

  const checkToken = async () => {
    if (hasCheckedTokenRef.current) {
      logColor('warn', 'AuthProvider', 'Token check SKIPPED (already running)');
      return;
    }
    hasCheckedTokenRef.current = true;
    const currentPath = location.pathname;
    if (isPublicRoute(currentPath)) {
      setTokenChecked(true);
      hasCheckedTokenRef.current = false;
      logColor('info', 'AuthProvider', 'Public route, token check OK');
      return;
    }

    let currentToken = useAuthStore.getState().token;
    const currentTime = Date.now() / 1000;

    if (!currentToken) {
      try {
        logColor('info', 'AuthProvider', 'No token, refreshing...');
        await refreshTokenMutation.mutateAsync();
        setTokenChecked(true);
        logColor('success', 'AuthProvider', 'Token refreshed, auth ready');
      } catch (err) {
        logColor('error', 'AuthProvider', 'Refresh failed, clearing auth');
        clearAuthentication();
        queryClient.clear();
        if (location.pathname !== webRoutes.login) {
          navigate(webRoutes.login, { replace: true });
        }
        setTokenChecked(true);
      } finally {
        hasCheckedTokenRef.current = false;
      }
      return;
    }

    // Token presente
    try {
      const decoded = jwtDecode<JWTPayload>(currentToken!);
      if (decoded.exp < currentTime) {
        try {
          logColor('info', 'AuthProvider', 'Token expired, refreshing...');
          await refreshTokenMutation.mutateAsync();
          setTokenChecked(true);
          logColor('success', 'AuthProvider', 'Token refreshed after expire, auth ready');
        } catch (err) {
          logColor('error', 'AuthProvider', 'Refresh after expire failed, clearing auth');
          clearAuthentication();
          queryClient.clear();
          if (location.pathname !== webRoutes.login) {
            navigate(webRoutes.login, { replace: true });
          }
          setTokenChecked(true);
        } finally {
          hasCheckedTokenRef.current = false;
        }
        return;
      }
      setTokenChecked(true);
      logColor('success', 'AuthProvider', 'Token valid, auth ready');
      hasCheckedTokenRef.current = false;
    } catch (err) {
      logColor('error', 'AuthProvider', 'Token decode failed, clearing auth');
      clearAuthentication();
      queryClient.clear();
      if (location.pathname !== webRoutes.login) {
        navigate(webRoutes.login, { replace: true });
      }
      setTokenChecked(true);
      hasCheckedTokenRef.current = false;
    }
  };

  useEffect(() => {
    setTokenChecked(false);
    hasCheckedTokenRef.current = false;
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
    enabled: tokenChecked && !!useAuthStore.getState().token,
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });

  if (!tokenChecked || refreshTokenMutation.isPending) {
    logColor('info', 'AuthProvider', 'Loading...', { tokenChecked, isPending: refreshTokenMutation.isPending });
    return <CenteredLoader open={true} />;
  }

  if (tokenChecked && isAuthenticated && isLoadingUser) {
    logColor('info', 'AuthProvider', 'Loading user data...');
    return <CenteredLoader open={true} />;
  }

  if (isAuthenticated && userError) {
    const is429Error = (userError as any)?.statusCode === 429;
    logColor('error', 'AuthProvider', 'Error loading user:', userError);
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
          {is429Error ? 'Too many requests. Please wait 60 seconds before trying again.' : (userError as any)?.messages || 'Failed to load user data.'}
        </Typography>
      </Box>
    );
  }

  // Si todo OK, render hijos
  return <AuthContext.Provider value={null}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext debe usarse dentro de un AuthProvider');
  }
  return context;
};
