import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useApiRequest } from '@/hooks/useApiRequest';
import { apiRoutes } from '@/routes/api.routes';
export const useUpdateUser = (userId: string) => {
  const { apiRequest } = useApiRequest();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) =>
      apiRequest({
        url: `${apiRoutes.users.admin.root}/${userId}`,
        method: 'put',
        data,
        requireAuth: true,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      if (userId) queryClient.invalidateQueries({ queryKey: ['user', userId] });
    },
  });
};
