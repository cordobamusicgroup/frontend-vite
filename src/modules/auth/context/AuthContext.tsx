import React from 'react';
import { useApiRequest } from '@/hooks/useApiRequest';
import { apiRoutes } from '@/routes/api.routes';
import { useUserStore } from '@/stores';
import { useQuery } from '@tanstack/react-query';
import CenteredLoader from '@/components/ui/molecules/CenteredLoader';
import { getAccessTokenFromCookie, setAccessTokenCookie, removeAccessTokenCookie } from '@/lib/cookies.util';
import { refreshAccessToken } from '@/modules/auth/lib/refreshAccessToken.util';
import { useAuthStore } from '@/stores/auth.store';

// AuthProvider: Contexto global para autenticación y refresco de sesión.
// - Al montar, intenta refrescar el access token si no existe.
// - Actualiza el estado global de autenticación (useAuthStore).
// - Muestra un loader mientras se resuelve el estado inicial.
// - Usa un mutex en refreshAccessToken para evitar refresh simultáneos.
// - Usa React Query para obtener los datos del usuario autenticado.

/**
 * AuthProvider
 *
 * Proveedor global de autenticación. Al montar:
 * - Si no hay access token, intenta refrescarlo usando refreshAccessToken (con mutex).
 * - Actualiza el estado global de autenticación (useAuthStore) según el resultado.
 * - Muestra un loader mientras se resuelve el estado inicial.
 * - Usa React Query para obtener los datos del usuario autenticado si hay token.
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Hook para peticiones API centralizadas
  const { apiRequest } = useApiRequest();
  // Setter global de datos de usuario
  const { setUserData } = useUserStore();
  // Estado de carga inicial
  const [loading, setLoading] = React.useState(true);

  /**
   * checkAndRefresh
   *
   * Si no hay access token, intenta refrescarlo usando refreshAccessToken (con mutex).
   * Actualiza el estado global de autenticación y la cookie según el resultado.
   * Siempre marca loading como false al finalizar.
   */
  const checkAndRefresh = React.useCallback(async () => {
    if (!getAccessTokenFromCookie()) {
      try {
        // Intenta refrescar el token (usa mutex interno)
        const accessToken = await refreshAccessToken();
        if (accessToken) {
          setAccessTokenCookie(accessToken);
          useAuthStore.getState().setAuthenticated(true);
        } else {
          removeAccessTokenCookie();
          useAuthStore.getState().setAuthenticated(false);
        }
      } catch {
        removeAccessTokenCookie();
        useAuthStore.getState().setAuthenticated(false);
      }
    }
    setLoading(false);
  }, []);

  // Ejecuta el chequeo/refresh solo al montar
  React.useEffect(() => {
    checkAndRefresh();
  }, [checkAndRefresh]);

  // Determina si hay access token para habilitar la query de usuario
  const isAuthenticated = !!getAccessTokenFromCookie();

  /**
   * React Query: Obtiene los datos del usuario autenticado
   * - Solo se ejecuta si hay access token
   * - Actualiza el store global de usuario
   */
  const { isLoading } = useQuery({
    queryKey: ['auth', 'user'],
    queryFn: async () => {
      const response = await apiRequest<any>({
        url: apiRoutes.auth.me,
        method: 'get',
      });
      setUserData(response);
      return response ?? null;
    },
    enabled: isAuthenticated,
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });

  // Muestra loader mientras se resuelve el estado inicial o la query de usuario
  if (loading || isLoading) {
    return <CenteredLoader open={true} text="Loading user, please wait..." />;
  }

  // Renderiza los hijos si ya está autenticado o no es necesario
  return <>{children}</>;
};
