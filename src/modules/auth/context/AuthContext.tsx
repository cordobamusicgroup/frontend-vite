import React, { type ReactNode } from 'react';
import { useApiRequest } from '@/hooks/useApiRequest';
import { apiRoutes } from '@/routes/api.routes';
import { useAuthStore, useUserStore } from '@/stores';
import { useQuery } from '@tanstack/react-query';
import CenteredLoader from '@/components/ui/molecules/CenteredLoader';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { apiRequest } = useApiRequest();
  const { setUserData } = useUserStore();
  const { setAuthenticated, setToken } = useAuthStore();

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

  if (isLoading) {
    return <CenteredLoader open={true} text="Loading user, please wait..." />;
  }

  return <>{children}</>;
};
