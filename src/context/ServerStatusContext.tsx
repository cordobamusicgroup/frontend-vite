'use client';

import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
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
  const [hasInitialized, setHasInitialized] = useState(false);
  const previousStatusRef = useRef<boolean | null>(null);

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

        // Only show success toast if switching from down to up, not on every success
        if (previousStatusRef.current === true) {
          toast.success('Server is operational', { autoClose: 2000 });
        }

        previousStatusRef.current = false;
        return false; // Server is operational
      } catch (error: any) {
        const isDown = error.response?.status === 502 || !error.response;

        // Only show error toast if it's different from previous state
        if (previousStatusRef.current !== true) {
          const errorMessage = isDown ? 'Server is down' : 'Error checking server status';
          toast.error(errorMessage, { autoClose: 2000 });
        }

        previousStatusRef.current = true;
        return isDown;
      } finally {
        // Mark as initialized after first check
        if (!hasInitialized) {
          setHasInitialized(true);
        }
      }
    },
    refetchInterval: 30000,
    refetchOnWindowFocus: false,
    staleTime: 25000, // Prevent unnecessary refetches
  });

  // Handle the loading toast with useEffect to ensure proper cleanup
  useEffect(() => {
    if (isLoading && !toastIdRef.current && !hasInitialized) {
      toastIdRef.current = toast.loading('Checking server status...');
    } else if ((!isLoading || hasInitialized) && toastIdRef.current) {
      toast.dismiss(toastIdRef.current);
      toastIdRef.current = null;
    }

    // Cleanup on unmount
    return () => {
      if (toastIdRef.current) {
        toast.dismiss(toastIdRef.current);
      }
    };
  }, [isLoading, hasInitialized]);

  if (isLoading && !hasInitialized) return null;

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
