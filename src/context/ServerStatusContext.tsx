import React, { createContext, useContext, useEffect, useState } from 'react';
import { useApiRequest } from '@/hooks/useApiRequest';
import Maintenance from '@/modules/portal/pages/Maintenance';

interface ServerStatusContextProps {
  isServerDown: boolean;
}

const ServerStatusContext = createContext<ServerStatusContextProps | undefined>(undefined);

export const ServerStatusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isServerDown, setIsServerDown] = useState(false);
  const { apiRequest } = useApiRequest();

  useEffect(() => {
    const checkServerStatus = async () => {
      try {
        await apiRequest({
          url: '/health', // Endpoint to check server status
          method: 'get',
          requireAuth: false,
        });
        setIsServerDown(false); // Server is operational
      } catch (error: any) {
        if (error.response?.status === 502) {
          setIsServerDown(true); // Explicitly handle 502 errors
        }
      }
    };

    checkServerStatus();
    const interval = setInterval(checkServerStatus, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, [apiRequest]);

  if (isServerDown) {
    return <Maintenance />; // Replace any page with Maintenance component
  }

  return <ServerStatusContext.Provider value={{ isServerDown }}>{children}</ServerStatusContext.Provider>;
};

export const useServerStatus = () => {
  const context = useContext(ServerStatusContext);
  if (!context) {
    throw new Error('useServerStatus must be used within ServerStatusProvider');
  }
  return context;
};
