import React, { type ReactNode, useEffect } from 'react';
import { useApiRequest } from '@/hooks/useApiRequest';
import { apiRoutes } from '@/routes/api.routes';
import { useAuthStore, useUserStore } from '@/stores';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import api from '@/lib/api';
import { refreshAccessToken } from '../lib/refreshAccessToken.util';
import webRoutes from '@/routes/web.routes';
import Cookies from 'js-cookie';
import CenteredLoader from '@/components/ui/molecules/CenteredLoader';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { apiRequest } = useApiRequest();
  const { setUserData } = useUserStore();
  const { setAuthenticated, setToken, clearAuthentication } = useAuthStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { isLoading } = useQuery({
    queryKey: ['auth', 'user'],
    queryFn: async () => {
      const response = await apiRequest<any>({
        url: apiRoutes.auth.me,
        method: 'get',
      });
      setUserData(response);
      setAuthenticated(true);
      setToken(useAuthStore.getState().token);
      return response;
    },
    enabled: !!useAuthStore.getState().token,
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const status = error.response?.status;
        const originalRequest = error.config;
        if ((status === 401 || status === 403) && originalRequest && !(originalRequest as any)._retry) {
          (originalRequest as any)._retry = true;
          try {
            await refreshAccessToken();
            const token = Cookies.get('access_token');
            if (token) {
              originalRequest.headers = {
                ...(originalRequest.headers || {}),
                Authorization: `Bearer ${token}`,
              };
            }
            return api(originalRequest);
          } catch (err) {
            queryClient.clear();
            clearAuthentication();
            navigate(webRoutes.login);
            return Promise.reject(err);
          }
        }
        return Promise.reject(error);
      },
    );
    return () => {
      api.interceptors.response.eject(interceptor);
    };
  }, [navigate, queryClient, clearAuthentication]);

  if (isLoading) {
    return <CenteredLoader open={true} text="Loading user, please wait..." />;
  }

  return <>{children}</>;
};
