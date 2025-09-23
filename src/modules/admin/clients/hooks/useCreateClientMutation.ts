import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { apiRoutes } from '@/routes/api.routes';
import { useApiRequest } from '@/hooks/useApiRequest';
import { formatError } from '@/lib/formatApiError.util';
import { CLIENTS_LIST_QUERY_KEY } from './useListClientsQuery';

export function useCreateClientMutation<TData = any, TError = any, TVariables = any>(options?: UseMutationOptions<TData, TError, TVariables>) {
  const { apiRequest } = useApiRequest();
  const queryClient = useQueryClient();

  return useMutation<TData, TError, TVariables>({
    mutationFn: async (data: any) => {
      try {
        return await apiRequest({ url: apiRoutes.clients.root, method: 'post', data, requireAuth: true });
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
