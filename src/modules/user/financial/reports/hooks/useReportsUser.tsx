import { useMutation, useQuery } from '@tanstack/react-query';
import { useApiRequest } from '@/hooks/useApiRequest';
import { apiRoutes } from '@/lib/api.routes';
import { formatApiError } from '@/lib/formatApiError.util';

/**
 * Hook to manage fetching and downloading reports for a user.
 *
 * @param {string} distributor - Distributor identifier.
 * @returns {object} Object with data, loading/error states, and mutation functions.
 */
export const useReportsUser = (distributor: string) => {
  const { apiRequest } = useApiRequest();

  // Query key for fetching reports
  const queryKey = ['reports', distributor];

  /**
   * Function to fetch current reports for a distributor.
   */
  const fetchReports = async () => {
    try {
      const url = `${apiRoutes.financial.reports.user.currentReports}?distributor=${distributor}`;
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
    queryFn: fetchReports,
    retry: false,
  });

  /**
   * Mutation to download a report by its ID.
   */
  const downloadReport = useMutation({
    mutationFn: async (reportId: string) => {
      try {
        const url = `${apiRoutes.financial.reports.user.downloadReport}/${reportId}`;
        const response = await apiRequest({
          url,
          method: 'get',
          requireAuth: true,
        });
        if (response.url === 'Pending') {
          throw new Error('CSV file has not been generated yet.');
        }
        return response.url;
      } catch (error) {
        throw formatApiError(error);
      }
    },
  });

  return {
    reportData: query.data,
    reportFetchLoading: query.isLoading,
    reportFetchError: query.error,
    downloadReport,
    downloadReportLoading: downloadReport.isPending,
    downloadReportError: downloadReport.error,
  };
};
