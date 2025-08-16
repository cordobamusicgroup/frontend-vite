import { useQuery } from '@tanstack/react-query';
import { useApiRequest } from '@/hooks/useApiRequest';
import { apiRoutes } from '@/routes/api.routes';
import { formatError } from '@/lib/formatApiError.util';

interface WithdrawalAuthData {
  isBlocked: boolean;
  isPaymentInProgress: boolean;
  isPaymentDataInValidation: boolean;
}

/**
 * Hook to check if the user is authorized for withdrawals.
 * Validates that isPaymentDataInValidation is false before allowing withdrawal operations.
 *
 * @returns Object with withdrawal data, loading, and error states
 */
export const useFetchWithdrawalAuth = () => {
  const { apiRequest } = useApiRequest();

  const withdrawalQueryKey = ['payments', 'withdrawal-authorized'];

  const fetchWithdrawalAuthorized = async (): Promise<WithdrawalAuthData> => {
    try {
      const url = apiRoutes.financial.payments.withdrawalAuthorized;
      const data = await apiRequest({
        url,
        method: 'get',
        requireAuth: true,
      });

      // Validate required properties
      const validatedData: WithdrawalAuthData = {
        isBlocked: Boolean(data?.isBlocked),
        isPaymentInProgress: Boolean(data?.isPaymentInProgress),
        isPaymentDataInValidation: Boolean(data?.isPaymentDataInValidation),
      };

      return validatedData;
    } catch (error) {
      throw formatError(error);
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
    canMakeWithdrawal: withdrawalAuthorizationQuery.data?.isPaymentDataInValidation === false,
  };
};
