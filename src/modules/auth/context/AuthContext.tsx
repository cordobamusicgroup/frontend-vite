import React, { createContext, useContext, useEffect, type ReactNode } from 'react';
import Cookies from 'js-cookie';
import { useNavigate, useLocation } from 'react-router';
import { jwtDecode } from 'jwt-decode';
import { useApiRequest } from '../../../hooks/useApiRequest';
import { apiRoutes } from '../../../lib/api.routes';
import { useAuthStore, useUserStore } from '../../../stores';
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

/**
 * Authentication provider component
 * Handles user authentication, token management, and related API calls
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { apiRequest } = useApiRequest();
  const { setUserData } = useUserStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { refetchServerStatus } = useServerStatus(); // Assuming this is a function to refetch server status
  const { setAuthenticated, isAuthenticated } = useAuthStore();
  const location = useLocation(); // Get the current location

  /**
   * Handles invalid or expired tokens by clearing credentials and redirecting to login
   */
  const handleInvalidToken = () => {
    Cookies.remove('access_token');
    Cookies.remove('refresh_token');
    setAuthenticated(false);
    queryClient.clear(); // Clear all caches on logout
    navigate(webRoutes.login);
  };

  /**
   * Valida si la ruta actual es pública según la configuración de rutas protegidas
   */
  const isPublicRoute = (currentPath: string) => {
    return webRoutes.protected.find((route: any) => route.path === currentPath && route.public === true) !== undefined;
  };

  /**
   * Validates the current auth token
   * @returns {boolean} Whether the token is valid
   */
  const validateToken = () => {
    const currentPath = location.pathname;

    // Omitir validación de token si la ruta es pública
    if (isPublicRoute(currentPath)) {
      return true;
    }

    const token = Cookies.get('access_token');
    if (!token) {
      handleInvalidToken();
      return false;
    }

    try {
      const decoded = jwtDecode<JWTPayload>(token);
      const currentTime = Date.now() / 1000;

      // If token is expired
      if (decoded.exp < currentTime) {
        handleInvalidToken();
        return false;
      }

      setAuthenticated(true);
      return true;
    } catch (err) {
      console.error('Error decoding token:', err);
      handleInvalidToken();
      return false;
    }
  };

  // Current user query with Tanstack Query
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
        refetchServerStatus(); // Refetch server status on error
        throw formatApiError(error); // Format error for better user experience
      }
    },
    enabled: isAuthenticated,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Set up token validation check on component mount
  useEffect(() => {
    validateToken();

    // Set up periodic token validation
    const tokenCheckInterval = setInterval(() => {
      validateToken();
    }, 60000); // Check token every minute

    return () => clearInterval(tokenCheckInterval);
  }, []);

  // Render loading state or error message while authenticating
  if (isAuthenticated && isLoadingUser) {
    return <CenteredLoader open={true} />;
  }

  if (isAuthenticated && userError) {
    // Check for rate limit error (429 Too Many Requests)
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
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};
