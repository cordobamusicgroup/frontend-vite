import { useQuery } from '@tanstack/react-query';
import { useApiRequest } from '@/hooks/useApiRequest';
import { apiRoutes } from '@/lib/api.routes';
import { formatApiError } from '@/lib/formatApiError.util';

/**
 * Hook to fetch the user's financial transactions for a given currency.
 *
 * @param currency The currency to fetch transactions for
 * @returns Object with transactions data, loading, and error states
 */
export const useTransactionsUser = (currency: string) => {
  const { apiRequest } = useApiRequest();

  const queryKey = ['transactions', currency];

  const fetchTransactions = async () => {
    try {
      const url = apiRoutes.financial.balances.transactions;
      return await apiRequest({
        url,
        method: 'get',
        requireAuth: true,
        params: { currency },
      });
    } catch (error) {
      throw formatApiError(error);
    }
  };

  const query = useQuery({
    queryKey,
    queryFn: fetchTransactions,
    retry: false,
  });

  return {
    transactionsData: query.data,
    transactionsFetchLoading: query.isLoading,
    transactionsFetchError: query.error,
  };
};
