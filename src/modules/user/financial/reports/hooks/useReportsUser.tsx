import { useMutation, useQuery } from '@tanstack/react-query';
import { useApiRequest } from '@/hooks/useApiRequest';
import { apiRoutes } from '@/routes/api.routes';
import { formatError } from '@/lib/formatApiError.util';

/**
 * Hook to fetch and download financial reports for the user.
 *
 * @param distributor Distributor identifier
 * @returns Object with report data, loading/error states, and mutation for downloading reports
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
      throw formatError(error);
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
        throw formatError(error);
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
