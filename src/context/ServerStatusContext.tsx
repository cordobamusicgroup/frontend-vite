'use client';

import React, { createContext, useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useApiRequest } from '@/hooks/useApiRequest';
import Maintenance from '@/modules/portal/pages/Maintenance';
import CenteredLoader from '@/components/ui/molecules/CenteredLoader';

interface ServerStatusContextProps {
  isServerDown: boolean;
}

const ServerStatusContext = createContext<ServerStatusContextProps | undefined>(undefined);

export const ServerStatusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { apiRequest } = useApiRequest();

  const { data: serverStatus, isLoading } = useQuery({
    queryKey: ['serverStatus'],
    queryFn: async () => {
      try {
        await apiRequest({
          url: '/health',
          method: 'get',
          requireAuth: false,
        });
        return { isDown: false };
      } catch (error: any) {
        const isDown = error.response?.status === 502 || !error.response;
        return { isDown };
      }
    },
    // Disable automatic refetching, we'll handle reload manually
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchInterval: false,
    retry: 1,
  });

  const isServerDown = serverStatus?.isDown ?? false;

  if (isLoading) return <CenteredLoader open={true} />;

  if (isServerDown) return <Maintenance />;

  return <ServerStatusContext.Provider value={{ isServerDown }}>{children}</ServerStatusContext.Provider>;
};

export const useServerStatus = () => {
  const context = useContext(ServerStatusContext);
  if (!context) {
    throw new Error('useServerStatus must be used within ServerStatusProvider');
  }
  return context;
};
