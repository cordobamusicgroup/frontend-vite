import { useQuery } from '@tanstack/react-query';
import { useApiRequest } from '@/hooks/useApiRequest';
import { apiRoutes } from '@/lib/api.routes';
import { formatApiError } from '@/lib/formatApiError.util';

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
      throw formatApiError(error);
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
