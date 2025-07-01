import React from 'react';
import { useApiRequest } from '@/hooks/useApiRequest';
import { apiRoutes } from '@/routes/api.routes';
import { useUserStore } from '@/stores';
import { useQuery } from '@tanstack/react-query';
import CenteredLoader from '@/components/ui/molecules/CenteredLoader';
import { getAccessTokenFromCookie } from '@/lib/cookies.util';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { apiRequest } = useApiRequest();
  const { setUserData } = useUserStore();
  const isAuthenticated = !!getAccessTokenFromCookie();

  const { isLoading } = useQuery({
    queryKey: ['auth', 'user'],
    queryFn: async () => {
      const response = await apiRequest<any>({
        url: apiRoutes.auth.me,
        method: 'get',
      });
      setUserData(response);
      return response;
    },
    enabled: isAuthenticated,
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) {
    return <CenteredLoader open={true} text="Loading user, please wait..." />;
  }

  return <>{children}</>;
};
