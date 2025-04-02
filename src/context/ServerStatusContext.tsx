'use client';

import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useApiRequest } from '@/hooks/useApiRequest';
import Maintenance from '@/modules/portal/pages/Maintenance';
import { toast, Id } from 'react-toastify';

interface ServerStatusContextProps {
  isServerDown: boolean;
  retryCheck: () => void;
  isCheckingStatus: boolean;
}

const ServerStatusContext = createContext<ServerStatusContextProps | undefined>(undefined);

export const ServerStatusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { apiRequest } = useApiRequest();
  const toastIdRef = useRef<Id | null>(null);
  const [hasInitialized, setHasInitialized] = useState(false);
  const previousStatusRef = useRef<boolean | null>(null);
  const isManualCheck = useRef(false);

  const {
    data: serverStatus,
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ['serverStatus'],
    queryFn: async () => {
      try {
        await apiRequest({
          url: '/health',
          method: 'get',
          requireAuth: false,
        });

        // Only show success toast if switching from down to up or on manual check
        if (previousStatusRef.current === true || isManualCheck.current) {
          toast.success('Server is operational', { autoClose: 2000 });
          isManualCheck.current = false;
        }

        previousStatusRef.current = false;
        return { isDown: false };
      } catch (error: any) {
        const isDown = error.response?.status === 502 || !error.response;

        // Only show error toast if it's different from previous state or on manual check
        if (previousStatusRef.current !== true || isManualCheck.current) {
          const errorMessage = isDown ? 'Server is down' : 'Error checking server status';
          toast.error(errorMessage, { autoClose: 2000 });
          isManualCheck.current = false;
        }

        previousStatusRef.current = true;
        return { isDown };
      } finally {
        // Mark as initialized after first check
        if (!hasInitialized) {
          setHasInitialized(true);
        }
      }
    },
    refetchInterval: 30000,
    refetchOnWindowFocus: false,
    staleTime: 25000,
    retry: 1, // Limit retries on failure
    gcTime: 60000, // Keep data in cache for 1 minute
  });

  const isServerDown = serverStatus?.isDown ?? false;

  // Handle manual retry logic
  const handleRetry = () => {
    isManualCheck.current = true;
    refetch();
  };

  // Handle the loading toast with useEffect to ensure proper cleanup
  useEffect(() => {
    const shouldShowLoadingToast = !hasInitialized && (isLoading || isRefetching);

    if (shouldShowLoadingToast && !toastIdRef.current) {
      toastIdRef.current = toast.loading('Checking server status...');
    } else if ((!isLoading && !isRefetching) || hasInitialized) {
      if (toastIdRef.current) {
        toast.dismiss(toastIdRef.current);
        toastIdRef.current = null;
      }
    }

    // Cleanup on unmount
    return () => {
      if (toastIdRef.current) {
        toast.dismiss(toastIdRef.current);
      }
    };
  }, [isLoading, isRefetching, hasInitialized]);

  // Show loading state only on initial load, not on refetches
  if (isLoading && !hasInitialized) return null;

  if (isServerDown) return <Maintenance onRetry={handleRetry} />;

  return (
    <ServerStatusContext.Provider
      value={{
        isServerDown,
        retryCheck: handleRetry,
        isCheckingStatus: isLoading || isRefetching,
      }}
    >
      {children}
    </ServerStatusContext.Provider>
  );
};

export const useServerStatus = () => {
  const context = useContext(ServerStatusContext);
  if (!context) {
    throw new Error('useServerStatus must be used within ServerStatusProvider');
  }
  return context;
};
