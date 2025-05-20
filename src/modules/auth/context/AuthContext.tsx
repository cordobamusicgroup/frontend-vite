import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
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
import useAuthQueries from '../hooks/useAuthQueries';

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
  const { apiRequest } = useApiRequest();
  const { setUserData } = useUserStore();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { refetchServerStatus } = useServerStatus();
  const { setAuthenticated, isAuthenticated, clearAuthentication } = useAuthStore();

  const { refreshTokenMutation } = useAuthQueries();
  const [tokenChecked, setTokenChecked] = useState(false);

  // Helper para rutas públicas
  const isPublicRoute = (currentPath: string) => {
    return webRoutes.protected.find((route: any) => route.path === currentPath && route.public === true) !== undefined;
  };

  // Validación y refresh de token
  const checkToken = async () => {
    const currentPath = location.pathname;
    if (isPublicRoute(currentPath)) {
      setTokenChecked(true);
      return;
    }

    let currentToken = useAuthStore.getState().token;
    const currentTime = Date.now() / 1000;

    if (!currentToken) {
      // Intentar refresh con la mutación
      try {
        await refreshTokenMutation.mutateAsync();
        setTokenChecked(true);
      } catch {
        clearAuthentication();
        queryClient.clear();
        navigate(webRoutes.login);
        setTokenChecked(true);
      }
      return;
    }

    // Token presente, validarlo
    try {
      const decoded = jwtDecode<JWTPayload>(currentToken!);
      if (decoded.exp < currentTime) {
        // Intentar refresh
        try {
          await refreshTokenMutation.mutateAsync();
          setTokenChecked(true);
        } catch {
          clearAuthentication();
          queryClient.clear();
          navigate(webRoutes.login);
          setTokenChecked(true);
        }
        return;
      }
      // Token válido
      setTokenChecked(true);
    } catch (err) {
      clearAuthentication();
      queryClient.clear();
      navigate(webRoutes.login);
      setTokenChecked(true);
    }
  };

  useEffect(() => {
    setTokenChecked(false);
    checkToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  // Fetch de usuario solo si está autenticado y token validado
  const { isLoading: isLoadingUser, error: userError } = useQuery({
    queryKey: ['auth', 'user'],
    queryFn: async () => {
      const response = await apiRequest<any>({
        url: apiRoutes.auth.me,
        method: 'get',
      });
      setUserData(response);
      setAuthenticated(true); // Solo acá se marca como autenticado
      return response;
    },
    enabled: tokenChecked && !!useAuthStore.getState().token,
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });

  // Manejo del error vía useEffect
  useEffect(() => {
    if (userError) {
      refetchServerStatus();
    }
  }, [userError, refetchServerStatus]);

  // 👇 Aquí la clave: SOLO renderizar children si está listo el auth/check de token.
  if (!tokenChecked || refreshTokenMutation.isPending || (tokenChecked && isAuthenticated && isLoadingUser)) {
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

  // Solo cuando esté listo, renderiza los children. Nada debajo del provider se monta antes.
  return <AuthContext.Provider value={null}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext debe usarse dentro de un AuthProvider');
  }
  return context;
};
