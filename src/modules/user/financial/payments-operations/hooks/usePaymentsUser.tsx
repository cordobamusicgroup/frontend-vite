import { useQuery } from '@tanstack/react-query';
import { useApiRequest } from '@/hooks/useApiRequest';
import { apiRoutes } from '@/lib/api.routes';
import { formatApiError } from '@/lib/formatApiError.util';

export const usePaymentsUser = () => {
  const { apiRequest } = useApiRequest();

  const withdrawalQueryKey = ['payments', 'withdrawal-authorized'];

  const fetchWithdrawalAuthorized = async () => {
    try {
      const url = apiRoutes.financial.payments.withdrawalAuthorized;
      return await apiRequest({
        url,
        method: 'get',
        requireAuth: true,
      });
    } catch (error) {
      throw formatApiError(error);
    }
  };

  const withdrawalAuthorizationQuery = useQuery({
    queryKey: withdrawalQueryKey,
    queryFn: fetchWithdrawalAuthorized,
    retry: false,
  });

  return {
    withdrawalData: withdrawalAuthorizationQuery.data,
    withdrawalLoading: withdrawalAuthorizationQuery.isLoading,
    withdrawalError: withdrawalAuthorizationQuery.error,
  };
};
