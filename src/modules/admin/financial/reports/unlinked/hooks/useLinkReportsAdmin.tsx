import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRoutes } from '@/lib/api.routes';
import { useApiRequest } from '@/hooks/useApiRequest';
import { formatError } from '@/lib/formatApiError.util';

/**
 * Hook para obtener y vincular reportes no enlazados.
 * Si se pasa un ID, trae solo ese reporte; si no, trae todos.
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
