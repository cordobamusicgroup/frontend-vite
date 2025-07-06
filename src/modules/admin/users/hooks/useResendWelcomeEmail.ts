import { useMutation } from '@tanstack/react-query';
import { useApiRequest } from '@/hooks/useApiRequest';
import { apiRoutes } from '@/routes/api.routes';
export const useResendWelcomeEmail = () => {
  const { apiRequest } = useApiRequest();

  return useMutation({
    mutationFn: async (email: string) =>
      apiRequest({
        url: apiRoutes.users.admin.resendAccountInfo,
        method: 'post',
        requireAuth: true,
        data: { email },
      }),
  });
};
