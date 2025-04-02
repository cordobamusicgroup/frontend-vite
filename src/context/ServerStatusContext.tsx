import React, { createContext, useContext, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useApiRequest } from '@/hooks/useApiRequest';
import ServerDown from '@/modules/portal/pages/ServerDown';
import CenteredLoader from '@/components/ui/molecules/CenteredLoader';

// Define la forma de los datos de estado del servidor
interface ServerStatusData {
  isDown: boolean;
}

// Define las propiedades que expondrá el contexto
interface ServerStatusContextProps {
  isServerDown: boolean;
  refetchServerStatus: () => void;
}

const ServerStatusContext = createContext<ServerStatusContextProps | undefined>(undefined);

export const ServerStatusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { apiRequest } = useApiRequest();
  // Ref para asegurarnos de mostrar el loader solo en el primer chequeo
  const initialCheckDone = useRef(false);

  const {
    data: serverStatus,
    isLoading,
    refetch,
  } = useQuery<ServerStatusData>({
    queryKey: ['serverStatus'],
    queryFn: async (): Promise<ServerStatusData> => {
      try {
        await apiRequest({
          url: '/health',
          method: 'get',
          requireAuth: false,
        });
        return { isDown: false };
      } catch (error: any) {
        // Si el error tiene código 502 o no hay respuesta, se considera que el servidor está caído
        const isDown = error.response?.status === 502 || !error.response;
        return { isDown };
      } finally {
        // Marca que se completó el chequeo inicial
        initialCheckDone.current = true;
      }
    },
    // Configuramos para que la consulta se ejecute solo al montar y no se re-fetchee automáticamente
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: false,
    refetchInterval: false,
    retry: 1,
    staleTime: Infinity, // Evita que se re-fetchee automáticamente
    gcTime: Infinity, // En v5, gcTime reemplaza a cacheTime
  });

  // En caso de que aún no tengamos datos, se asume que el servidor no está caído
  const isServerDown = serverStatus?.isDown ?? false;

  // Mientras se realiza el primer chequeo, mostramos un loader
  if (isLoading && !initialCheckDone.current) return <CenteredLoader open={true} />;

  // Si el servidor está caído, se reemplaza toda la UI por la pantalla de ServerDown
  if (isServerDown) return <ServerDown />;

  return <ServerStatusContext.Provider value={{ isServerDown, refetchServerStatus: refetch }}>{children}</ServerStatusContext.Provider>;
};

export const useServerStatus = (): ServerStatusContextProps => {
  const context = useContext(ServerStatusContext);
  if (!context) {
    throw new Error('useServerStatus must be used within a ServerStatusProvider');
  }
  return context;
};
