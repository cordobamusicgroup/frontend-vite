import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { apiRoutes } from '@/routes/api.routes';
import { useApiRequest } from '@/hooks/useApiRequest';
import { formatError } from '@/lib/formatApiError.util';
import { CLIENTS_LIST_QUERY_KEY } from './useListClientsQuery';
import { clientQueryKey } from './useClientQuery';

interface UpdateClientVariables {
  clientId: string | number;
  data: any;
}

export function useUpdateClientMutation<TData = any, TError = any>(options?: UseMutationOptions<TData, TError, UpdateClientVariables>) {
  const { apiRequest } = useApiRequest();
  const queryClient = useQueryClient();

  return useMutation<TData, TError, UpdateClientVariables>({
    mutationFn: async ({ clientId, data }: UpdateClientVariables) => {
      try {
        return await apiRequest({ url: `${apiRoutes.clients.root}/${clientId}`, method: 'put', data, requireAuth: true });
      } catch (error) {
        throw formatError(error);
      }
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: CLIENTS_LIST_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: clientQueryKey(variables.clientId) });
      options?.onSuccess?.(data, variables, context as any);
    },
    onError: (error, variables, context) => {
      options?.onError?.(error, variables, context as any);
    },
    ...(options as any),
  });
}
