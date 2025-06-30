import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRoutes } from '@/routes/api.routes';
import { useApiRequest } from '@/hooks/useApiRequest';
import { formatError } from '@/lib/formatApiError.util';

/**
 * Hook to fetch and link unlinked financial reports (admin).
 * If an unlinkedId is provided, fetches a single report; otherwise, fetches all unlinked reports.
 *
 * @param unlinkedId Optional report ID to fetch a specific unlinked report
 * @returns Object with data, loading/error states, mutation functions, and refetch
 */
export const useUnlinkedReportsAdmin = (unlinkedId?: number) => {
  const { apiRequest } = useApiRequest();
  const queryClient = useQueryClient();

  const queryKey = unlinkedId ? ['unlinked-report', unlinkedId] : ['unlinked-reports'];

  // Fetcher único, decide endpoint según si hay ID
  const fetchUnlinkedReports = async () => {
    const url = unlinkedId ? apiRoutes.financial.reports.admin.unlinked.getById(unlinkedId) : apiRoutes.financial.reports.admin.unlinked.getAll;
    try {
      return await apiRequest({ url, method: 'get', requireAuth: true });
    } catch (error) {
      throw formatError(error);
    }
  };

  const query = useQuery({
    queryKey,
    queryFn: fetchUnlinkedReports,
    retry: false,
  });

  // Mutación para vincular reporte
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
      queryClient.invalidateQueries({ queryKey: ['unlinked-reports'] });
      if (unlinkedId) queryClient.invalidateQueries({ queryKey: ['unlinked-report', unlinkedId] });
    },
  });

  return {
    unlinkedReportsData: query.data,
    loading: {
      unlinkedReportsFetch: query.isFetching,
      linkReport: linkReport.isPending,
    },
    errors: {
      unlinkedReportsFetch: query.error,
      linkReport: linkReport.error,
    },
    mutations: {
      linkReport,
    },
    refetch: query.refetch,
  };
};
