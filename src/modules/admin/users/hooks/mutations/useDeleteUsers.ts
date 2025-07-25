import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useApiRequest } from '@/hooks/useApiRequest';
import { apiRoutes } from '@/routes/api.routes';
export const useDeleteUsers = () => {
  const { apiRequest } = useApiRequest();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userIds: number[]) =>
      apiRequest({
        url: apiRoutes.users.admin.root,
        method: 'delete',
        requireAuth: true,
        data: { ids: userIds },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};
