import { useMutation } from '@tanstack/react-query';
import { useApiRequest } from '@/hooks/useApiRequest';
import { apiRoutes } from '@/routes/api.routes';
import { formatError } from '@/lib/formatApiError.util';

/**
 * Hook to download financial reports.
 *
 * @returns Mutation object for downloading reports
 */
export const useDownloadReport = () => {
  const { apiRequest } = useApiRequest();

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
    downloadReport,
    downloadReportLoading: downloadReport.isPending,
    downloadReportError: downloadReport.error,
  };
};