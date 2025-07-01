import React from 'react';
import { useApiRequest } from '@/hooks/useApiRequest';
import { apiRoutes } from '@/routes/api.routes';
import { useUserStore } from '@/stores';
import { useQuery } from '@tanstack/react-query';
import CenteredLoader from '@/components/ui/molecules/CenteredLoader';
import { getAccessTokenFromCookie, setAccessTokenCookie, removeAccessTokenCookie } from '@/lib/cookies.util';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { apiRequest } = useApiRequest();
  const { setUserData } = useUserStore();
  const [loading, setLoading] = React.useState(true);

  // Refresca el token si es necesario al montar
  const checkAndRefresh = React.useCallback(async () => {
    if (!getAccessTokenFromCookie()) {
      try {
        const resp = await apiRequest({
          url: apiRoutes.auth.refresh,
          method: 'post',
          requireAuth: false,
        });
        if (resp && resp.access_token) {
          setAccessTokenCookie(resp.access_token);
        } else {
          removeAccessTokenCookie();
        }
      } catch {
        removeAccessTokenCookie();
      }
    }
    setLoading(false);
  }, [apiRequest]);

  React.useEffect(() => {
    checkAndRefresh();
  }, [checkAndRefresh]);

  // Solo se considera autenticado si hay access_token
  const isAuthenticated = !!getAccessTokenFromCookie();

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

  if (loading || isLoading) {
    return <CenteredLoader open={true} text="Loading user, please wait..." />;
  }

  return <>{children}</>;
};
