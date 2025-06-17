import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRoutes } from '@/lib/api.routes';
import { useApiRequest } from '@/hooks/useApiRequest';
import { formatApiError, formatError, FormattedApiError } from '@/lib/formatApiError.util';

/**
 * Hook to manage fetching and mutating clients (admin).
 * If a clientId is provided, fetches a single client; otherwise, fetches all clients.
 *
 * @param clientId Optional client ID to fetch a specific client
 * @returns Object with data, loading/error states, and mutation functions
 */
export const useClientsAdmin = (clientId?: string) => {
  const { apiRequest } = useApiRequest();
  const queryClient = useQueryClient();

  // Determine the query key based on whether a single client or all clients are needed
  const queryKey = clientId ? ['client', clientId] : ['clients'];

  /**
   * Function to fetch clients.
   * If `clientId` is provided, fetches the client by ID; otherwise, fetches all clients.
   */
  const fetchClients = async () => {
    try {
      const url = clientId ? `${apiRoutes.clients.root}/${clientId}` : apiRoutes.clients.root;

      return await apiRequest({
        url,
        method: 'get',
        requireAuth: true,
      });
    } catch (error) {
      throw formatApiError(error);
    }
  };

  const query = useQuery({
    queryKey,
    queryFn: fetchClients,
    retry: false,
  });

  const createClient = useMutation({
    mutationFn: async (data: any) => {
      try {
        return await apiRequest({
          url: apiRoutes.clients.root,
          method: 'post',
          data,
          requireAuth: true,
        });
      } catch (error) {
        throw formatApiError(error);
      }
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['clients'],
      });
    },
    onError: (error: FormattedApiError) => {
      console.log('Error creating client:', error);
    },
  });

  const updateClient = useMutation({
    mutationFn: async (data: any) => {
      try {
        return await apiRequest({
          url: `${apiRoutes.clients.root}/${clientId}`,
          method: 'put',
          data,
          requireAuth: true,
        });
      } catch (error) {
        throw formatError(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['clients', 'client', clientId],
      });
    },
    onError: (error: FormattedApiError) => {
      console.log('Error updating client:', error);
    },
  });

  const deleteClients = useMutation({
    mutationFn: async (clientsIds: number[]) => {
      try {
        return await apiRequest({
          url: apiRoutes.clients.root,
          method: 'delete',
          requireAuth: true,
          data: { ids: clientsIds },
        });
      } catch (error) {
        throw formatApiError(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['clients'],
      });
    },
    onError: (error: FormattedApiError) => {
      console.log('Error deleting client:', error);
    },
  });

  return {
    // Data
    clientsData: query.data,

    // Loading states
    loading: {
      clientFetch: query.isLoading,
      createClient: createClient.isPending,
      updateClient: updateClient.isPending,
      deleteClients: deleteClients.isPending,
    },

    // Error states
    errors: {
      clientFetch: query.error,
      createClient: createClient.error,
      updateClient: updateClient.error,
      deleteClients: deleteClients.error,
    },

    // Mutations
    mutations: {
      createClient,
      updateClient,
      deleteClients,
    },
  };
};
