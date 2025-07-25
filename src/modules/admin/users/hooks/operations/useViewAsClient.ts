import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useApiRequest } from '@/hooks/useApiRequest';
import { useAuthContext } from '@/modules/auth/hooks/useAuthContext';
import { apiRoutes } from '@/routes/api.routes';

export const useViewAsClient = () => {
  const { apiRequest } = useApiRequest();
  const queryClient = useQueryClient();
  const { refetchUser } = useAuthContext();

  return useMutation({
    mutationFn: async (clientId: number) =>
      apiRequest({
        url: apiRoutes.users.admin.viewAs,
        method: 'patch',
        requireAuth: true,
        data: { clientId },
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['user'] });
      await queryClient.invalidateQueries({ queryKey: ['balances'] });
      await queryClient.invalidateQueries({ queryKey: ['transactions'] });
      refetchUser();
    },
  });
};
