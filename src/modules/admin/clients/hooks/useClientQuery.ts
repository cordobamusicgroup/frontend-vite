import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { apiRoutes } from '@/routes/api.routes';
import { useApiRequest } from '@/hooks/useApiRequest';
import { formatError } from '@/lib/formatApiError.util';

export interface ClientDetail extends Record<string, any> {
  id: number;
  clientName: string;
}

export const clientQueryKey = (clientId?: string | number) => ['client', clientId];

export function useClientQuery(clientId?: string | number, options?: Partial<UseQueryOptions<ClientDetail, any>>) {
  const { apiRequest } = useApiRequest();

  const fetchClient = async (): Promise<ClientDetail> => {
    if (clientId === undefined || clientId === null) throw new Error('clientId is required');
    try {
      return await apiRequest({ url: `${apiRoutes.clients.root}/${clientId}`, method: 'get', requireAuth: true });
    } catch (error) {
      throw formatError(error);
    }
  };

  return useQuery<ClientDetail, any>({
    queryKey: clientQueryKey(clientId),
    queryFn: fetchClient,
    enabled: clientId !== undefined && clientId !== null,
    retry: false,
    ...(options as any),
  });
}
