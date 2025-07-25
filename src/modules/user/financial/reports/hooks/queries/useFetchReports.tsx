import { useQuery } from '@tanstack/react-query';
import { useApiRequest } from '@/hooks/useApiRequest';
import { apiRoutes } from '@/routes/api.routes';
import { formatError } from '@/lib/formatApiError.util';

/**
 * Hook to fetch financial reports for the user.
 *
 * @param distributor Distributor identifier
 * @returns Object with report data, loading and error states
 */
export const useFetchReports = (distributor: string) => {
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

  return {
    reportData: query.data,
    reportFetchLoading: query.isLoading,
    reportFetchError: query.error,
  };
};