import { useQuery } from '@tanstack/react-query';
import { useApiRequest } from '@/hooks/useApiRequest';
import { apiRoutes } from '@/lib/api.routes';
import { formatError } from '@/lib/formatApiError.util';

/**
 * Hook to fetch the user's financial balances.
 *
 * @returns Object with balances data, loading, and error states
 */
export const useBalancesUser = () => {
  const { apiRequest } = useApiRequest();

  const queryKey = ['balances'];

  const fetchBalances = async () => {
    try {
      const url = apiRoutes.financial.balances.root;
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
    queryFn: fetchBalances,
    retry: false,
  });

  return {
    balancesData: query.data,
    balancesFetchLoading: query.isLoading,
    balancesFetchError: query.error,
  };
};
