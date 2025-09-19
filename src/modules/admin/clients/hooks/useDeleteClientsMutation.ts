import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { apiRoutes } from '@/routes/api.routes';
import { useApiRequest } from '@/hooks/useApiRequest';
import { formatError } from '@/lib/formatApiError.util';
import { CLIENTS_LIST_QUERY_KEY } from './useListClientsQuery';

interface DeleteClientsVariables {
  ids: number[];
}

export function useDeleteClientsMutation<TData = any, TError = any>(options?: UseMutationOptions<TData, TError, DeleteClientsVariables>) {
  const { apiRequest } = useApiRequest();
  const queryClient = useQueryClient();

  return useMutation<TData, TError, DeleteClientsVariables>({
    mutationFn: async ({ ids }: DeleteClientsVariables) => {
      try {
        return await apiRequest({ url: apiRoutes.clients.root, method: 'delete', data: { ids }, requireAuth: true });
      } catch (error) {
        throw formatError(error);
      }
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: CLIENTS_LIST_QUERY_KEY });
      options?.onSuccess?.(data, variables, context as any);
    },
    onError: (error, variables, context) => {
      options?.onError?.(error, variables, context as any);
    },
    ...(options as any),
  });
}
