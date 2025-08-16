import { useMutation } from '@tanstack/react-query';
import { useApiRequest } from '@/hooks/useApiRequest';
import { apiRoutes } from '@/routes/api.routes';
import { formatError } from '@/lib/formatApiError.util';

/**
 * Hook to fetch download options for financial reports (full catalog + grouped exports).
 * Returns a mutation that resolves to the download options DTO.
 */
export const useDownloadReport = () => {
  const { apiRequest } = useApiRequest();

  const downloadReport = useMutation({
    mutationFn: async (reportId: string) => {
      try {
        const url = `${apiRoutes.financial.reports.user.downloadOptions}/${reportId}`;
        const response = await apiRequest({
          url,
          method: 'get',
          requireAuth: true,
        });
        // response should be the DTO with groupedByLabels, groupedByArtists, groupedByReleases, groupedByPlatform, groupedByCountries, fullCatalog
        return response;
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
