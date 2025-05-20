import React, { createContext, useContext, useEffect, type ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { jwtDecode } from 'jwt-decode';
import { useApiRequest } from '@/hooks/useApiRequest';
import { apiRoutes } from '@/lib/api.routes';
import { useAuthStore, useUserStore } from '@/stores';
import webRoutes from '@/lib/web.routes';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useServerStatus } from '@/context/ServerStatusContext';
import { Box, Typography } from '@mui/material';
import CenteredLoader from '@/components/ui/molecules/CenteredLoader';
import { formatApiError } from '@/lib/formatApiError.util';

/**
 * JWT payload structure
 */
interface JWTPayload {
  sub: string;
  email: string;
  iat: number;
  exp: number;
}

/**
 * Auth provider props
 */
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext(null);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { apiRequest } = useApiRequest();
  const { setUserData } = useUserStore();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { refetchServerStatus } = useServerStatus();

  const { setAuthenticated, isAuthenticated, token, setToken, clearAuthentication } = useAuthStore();

  const handleInvalidToken = () => {
    clearAuthentication();
    queryClient.clear();
    navigate(webRoutes.login);
  };

  const isPublicRoute = (currentPath: string) => {
    return webRoutes.protected.find((route: any) => route.path === currentPath && route.public === true) !== undefined;
  };

  const validateToken = async (): Promise<boolean> => {
    const currentPath = location.pathname;
    if (isPublicRoute(currentPath)) return true;

    let currentToken = useAuthStore.getState().token;
    const currentTime = Date.now() / 1000;

    // No token → intentar refresh
    if (!currentToken) {
      try {
        const refreshRes = await apiRequest<{ access_token: string }>({
          url: apiRoutes.auth.refresh,
          method: 'post',
          requireAuth: false,
        });

        if (refreshRes?.access_token) {
          setToken(refreshRes.access_token);
          setAuthenticated(true);
          return true;
        }
      } catch (error) {
        handleInvalidToken();
        return false;
      }
    }

    // Validar token actual
    try {
      const decoded = jwtDecode<JWTPayload>(currentToken!);
      if (decoded.exp < currentTime) {
        return await validateToken(); // intentar refresh si está vencido
      }

      setAuthenticated(true);
      return true;
    } catch (err) {
      console.error('Error decoding token:', err);
      handleInvalidToken();
      return false;
    }
  };

  const { isLoading: isLoadingUser, error: userError } = useQuery({
    queryKey: ['auth', 'user'],
    queryFn: async () => {
      try {
        const response = await apiRequest<any>({
          url: apiRoutes.auth.me,
          method: 'get',
        });
        setUserData(response);
        return response;
      } catch (error: any) {
        console.error('Error fetching user data:', error);
        refetchServerStatus();
        throw formatApiError(error);
      }
    },
    enabled: isAuthenticated,
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    validateToken();

    const tokenCheckInterval = setInterval(() => {
      validateToken();
    }, 60000); // cada 60 segundos

    return () => clearInterval(tokenCheckInterval);
  }, []);

  if (isAuthenticated && isLoadingUser) {
    return <CenteredLoader open={true} />;
  }

  if (isAuthenticated && userError) {
    const is429Error = (userError as any)?.statusCode === 429;

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

  return <AuthContext.Provider value={null}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext debe usarse dentro de un AuthProvider');
  }
  return context;
};
