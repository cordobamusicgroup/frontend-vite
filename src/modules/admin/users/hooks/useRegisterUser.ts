import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useApiRequest } from '@/hooks/useApiRequest';
import { apiRoutes } from '@/routes/api.routes';

export const useRegisterUser = () => {
  const { apiRequest } = useApiRequest();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) =>
      apiRequest({
        url: apiRoutes.users.admin.register,
        method: 'post',
        data,
        requireAuth: true,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};
