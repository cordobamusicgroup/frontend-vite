import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRoutes } from '@/lib/api.routes';
import { useApiRequest } from '@/hooks/useApiRequest';
import { formatError } from '@/lib/formatApiError.util';

/**
 * Hook to manage fetching and mutating clients.
 * If a `clientId` is provided, fetches a single client;
 * otherwise, fetches all clients.
 *
 * @param {string} [clientId] - ID of the client to fetch (optional).
 * @returns {object} Object with data, loading/error states, and mutation functions.
 */
export const useUnlinkedReportsAdmin = () => {
  const { apiRequest } = useApiRequest();
  const queryClient = useQueryClient();

  // Determine the query key based on whether a single client or all clients are needed
  const queryKey = ['unlinked-reports'];

  /**
   * Function to fetch clients.
   * If `clientId` is provided, fetches the client by ID; otherwise, fetches all clients.
   */
  const fetchUnlinkedReports = async () => {
    try {
      const url = apiRoutes.financial.reports.admin.unlinked.get;

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
    queryFn: fetchUnlinkedReports,
    retry: false,
  });

  const linkReport = useMutation({
    mutationFn: async ({ unlinkedReportId, labelId }: { unlinkedReportId: number; labelId: number }) => {
      try {
        return await apiRequest({
          url: apiRoutes.financial.reports.admin.unlinked.linkMissing,
          method: 'post',
          data: { unlinkedReportId, labelId },
          requireAuth: true,
        });
      } catch (error) {
        throw formatError(error);
      }
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['unlinked-reports'],
      });
    },
  });

  return {
    // Data
    unlinkedReportsData: query.data,

    // Loading states
    loading: {
      unlinkedReportsFetch: query.isLoading,
      linkReport: linkReport.isPending,
    },

    // Error states
    errors: {
      unlinkedReportsFetch: query.error,
      linkReport: linkReport.error,
    },

    // Mutations
    mutations: {
      linkReport,
    },
  };
};
