import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRoutes } from '@/routes/api.routes';
import { useApiRequest } from '@/hooks/useApiRequest';
import { formatError } from '@/lib/formatApiError.util';

/**
 * Hook to manage fetching and mutating labels (admin).
 * If a labelId is provided, fetches a single label; otherwise, fetches all labels.
 *
 * @param labelId Optional label ID to fetch a specific label
 * @returns Object with data, loading/error states, and mutation functions
 */
export const useLabelsAdmin = (labelId?: string) => {
  const { apiRequest } = useApiRequest();
  const queryClient = useQueryClient();

  // Determine the query key based on whether a single client or all clients are needed
  const queryKey = labelId ? ['label', labelId] : ['labels'];

  /**
   * Function to fetch clients.
   * If `clientId` is provided, fetches the client by ID; otherwise, fetches all clients.
   */
  const fetchLabels = async () => {
    try {
      const url = labelId ? `${apiRoutes.labels.root}/${labelId}` : apiRoutes.labels.root;

      return await apiRequest({
        url,
        method: 'get',
        requireAuth: true,
      });
    } catch (error) {
      throw formatError(error);
    }
  };

  const query = useQuery({
    queryKey,
    queryFn: fetchLabels,
    retry: false,
  });

  const createLabel = useMutation({
    mutationFn: async (data: any) => {
      try {
        return await apiRequest({
          url: apiRoutes.labels.root,
          method: 'post',
          data,
          requireAuth: true,
        });
      } catch (error) {
        throw formatError(error);
      }
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['labels'],
      });
    },
  });

  const updateLabel = useMutation({
    mutationFn: async (data: any) => {
      try {
        return await apiRequest({
          url: `${apiRoutes.labels.root}/${labelId}`,
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
        queryKey: ['labels', 'label', labelId],
      });
    },
  });

  const deleteLabels = useMutation({
    mutationFn: async (labelsIds: number[]) => {
      try {
        return await apiRequest({
          url: apiRoutes.labels.root,
          method: 'delete',
          requireAuth: true,
          data: { ids: labelsIds },
        });
      } catch (error) {
        throw formatError(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['labels'],
      });
    },
  });

  return {
    labelsData: query.data,
    labelFetchLoading: query.isLoading,
    labelFetchError: query.error,
    createLabel,
    createLabelLoading: createLabel.isPending,
    createLabelError: createLabel.error,
    updateLabel,
    updateLabelLoading: updateLabel.isPending,
    updateLabelError: updateLabel.error,
    deleteLabels,
    deleteLabelsLoading: deleteLabels.isPending,
    deleteLabelsError: deleteLabels.error,
  };
};
