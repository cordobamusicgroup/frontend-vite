import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { apiRoutes } from '@/routes/api.routes';
import { useApiRequest } from '@/hooks/useApiRequest';
import { formatError } from '@/lib/formatApiError.util';

export interface ClientListItem {
  id: number;
  clientName: string;
  firstName?: string;
  lastName?: string;
  type?: string;
  status?: string;
  dmb?: any; // TODO: type properly
  balances?: any[]; // TODO: type properly
  [key: string]: any;
}

export const CLIENTS_LIST_QUERY_KEY = ['clients'];

export function useListClientsQuery(options?: Partial<UseQueryOptions<ClientListItem[], any>>) {
  const { apiRequest } = useApiRequest();

  const fetchClients = async (): Promise<ClientListItem[]> => {
    try {
      return await apiRequest({ url: apiRoutes.clients.root, method: 'get', requireAuth: true });
    } catch (error) {
      throw formatError(error);
    }
  };

  return useQuery<ClientListItem[], any>({
    queryKey: CLIENTS_LIST_QUERY_KEY,
    queryFn: fetchClients,
    retry: false,
    ...(options as any),
  });
}
