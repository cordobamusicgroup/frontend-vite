import { useMutation } from '@tanstack/react-query';
import { useApiRequest } from '@/hooks/useApiRequest';
import { apiRoutes } from '@/routes/api.routes';
import { formatError } from '@/lib/formatApiError.util';
import { PaymentUpdateFormData } from '../schemas/PaymentUpdateValidationSchema';

interface PaymentUpdateResponse {
  success: boolean;
  message: string;
}

/**
 * Hook to submit payment information update requests
 */
export const usePaymentUpdateRequest = () => {
  const { apiRequest } = useApiRequest();

  const submitPaymentUpdateRequest = async (data: PaymentUpdateFormData): Promise<PaymentUpdateResponse> => {
    try {
      const response = await apiRequest({
        url: apiRoutes.workflow.uppi.request,
        method: 'post',
        data,
        requireAuth: true,
      });

      return response;
    } catch (error) {
      throw formatError(error);
    }
  };

  const mutation = useMutation({
    mutationFn: submitPaymentUpdateRequest,
  });

  return {
    submitPaymentUpdate: mutation.mutate,
    submitPaymentUpdateAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
    reset: mutation.reset,
  };
};