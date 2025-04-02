'use client';

import React, { createContext, useContext, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useApiRequest } from '@/hooks/useApiRequest';
import Maintenance from '@/modules/portal/pages/Maintenance';
import { toast, Id } from 'react-toastify';

interface ServerStatusContextProps {
  isServerDown: boolean;
  retryCheck: () => void;
}

const ServerStatusContext = createContext<ServerStatusContextProps | undefined>(undefined);

export const ServerStatusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { apiRequest } = useApiRequest();
  const toastIdRef = useRef<Id | null>(null);
  const loadingRef = useRef(true);

  const {
    data: isServerDown,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['serverStatus'],
    queryFn: async () => {
      try {
        await apiRequest({
          url: '/health',
          method: 'get',
          requireAuth: false,
        });

        // Only show success toast if not the initial load
        if (!loadingRef.current) {
          toast.success('Server is operational', { autoClose: 2000 });
        }
        loadingRef.current = false;
        return false; // Server is operational
      } catch (error: any) {
        const isDown = error.response?.status === 502 || !error.response;
        const errorMessage = isDown ? 'Server is down' : 'Error checking server status';
        toast.error(errorMessage, { autoClose: 2000 });
        loadingRef.current = false;
        return isDown;
      }
    },
    refetchInterval: 30000,
  });

  // Handle the loading toast with useEffect to ensure proper cleanup
  useEffect(() => {
    if (isLoading && !toastIdRef.current) {
      toastIdRef.current = toast.loading('Checking server status...');
    } else if (!isLoading && toastIdRef.current) {
      toast.dismiss(toastIdRef.current);
      toastIdRef.current = null;
    }

    // Cleanup on unmount
    return () => {
      if (toastIdRef.current) {
        toast.dismiss(toastIdRef.current);
      }
    };
  }, [isLoading]);

  if (isLoading) return null; // Optionally replace with a spinner component

  if (isServerDown) return <Maintenance onRetry={() => refetch()} />;

  return <ServerStatusContext.Provider value={{ isServerDown: !!isServerDown, retryCheck: () => refetch() }}>{children}</ServerStatusContext.Provider>;
};

export const useServerStatus = () => {
  const context = useContext(ServerStatusContext);
  if (!context) {
    throw new Error('useServerStatus must be used within ServerStatusProvider');
  }
  return context;
};
