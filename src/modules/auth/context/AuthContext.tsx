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
  // LOG MOUNT/UNMOUNT
  useEffect(() => {
    console.log('[AuthProvider] mounted');
    return () => console.log('[AuthProvider] unmounted');
  }, []);

  const { apiRequest } = useApiRequest();
  const { setUserData } = useUserStore();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { setAuthenticated, isAuthenticated, clearAuthentication } = useAuthStore();

  const { refreshTokenMutation } = useAuthQueries();
  const [tokenChecked, setTokenChecked] = useState(false);

  // Bloquea ejecuciones dobles en StrictMode
  const hasCheckedTokenRef = useRef(false);

  // Rutas públicas
  const isPublicRoute = (currentPath: string) => {
    return webRoutes.protected.find((route: any) => route.path === currentPath && route.public === true) !== undefined;
  };

  // Validación y refresh de token
  const checkToken = async () => {
    if (hasCheckedTokenRef.current) {
      // Solo para debug, puedes quitarlo luego
      console.log('[AuthProvider] Token check SKIPPED (already running)');
      return;
    }
    hasCheckedTokenRef.current = true;
    const currentPath = location.pathname;
    if (isPublicRoute(currentPath)) {
      setTokenChecked(true);
      hasCheckedTokenRef.current = false;
      return;
    }

    let currentToken = useAuthStore.getState().token;
    const currentTime = Date.now() / 1000;

    if (!currentToken) {
      // Intentar refresh
      try {
        console.log('[AuthProvider] No token, refreshing...');
        await refreshTokenMutation.mutateAsync();
        setTokenChecked(true);
        console.log('[AuthProvider] Token refreshed, auth ready');
      } catch (err) {
        console.log('[AuthProvider] Refresh failed, clearing auth');
        clearAuthentication();
        queryClient.clear();
        // Solo navega si no estás ya en login, para evitar bucle infinito
        if (location.pathname !== webRoutes.login) {
          navigate(webRoutes.login, { replace: true });
        }
        setTokenChecked(true);
      } finally {
        hasCheckedTokenRef.current = false;
      }
      return;
    }

    // Token presente, validarlo
    try {
      const decoded = jwtDecode<JWTPayload>(currentToken!);
      if (decoded.exp < currentTime) {
        // Expirado: intentar refresh
        try {
          console.log('[AuthProvider] Token expired, refreshing...');
          await refreshTokenMutation.mutateAsync();
          setTokenChecked(true);
          console.log('[AuthProvider] Token refreshed after expire, auth ready');
        } catch (err) {
          console.log('[AuthProvider] Refresh after expire failed, clearing auth');
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
      // Token válido
      setTokenChecked(true);
      console.log('[AuthProvider] Token valid, auth ready');
      hasCheckedTokenRef.current = false;
    } catch (err) {
      console.log('[AuthProvider] Token decode failed, clearing auth');
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

  // Loader si aún no está listo el token o refrescando
  if (!tokenChecked || refreshTokenMutation.isPending) {
    console.log('[AuthProvider] Loading...', { tokenChecked, isPending: refreshTokenMutation.isPending });
    return <CenteredLoader open={true} />;
  }

  // Loader mientras carga el usuario (pero solo después del token)
  if (tokenChecked && isAuthenticated && isLoadingUser) {
    return <CenteredLoader open={true} />;
  }

  // Error cargando user (demasiadas requests, etc)
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

  // Si está todo bien, renderiza los hijos
  return <AuthContext.Provider value={null}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext debe usarse dentro de un AuthProvider');
  }
  return context;
};
