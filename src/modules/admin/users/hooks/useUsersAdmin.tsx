import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRoutes } from '@/lib/api.routes';
import { useApiRequest } from '@/hooks/useApiRequest';
import { formatApiError, formatError } from '@/lib/formatApiError.util';

export const useUsersAdmin = () => {
  const { apiRequest } = useApiRequest();
  const queryClient = useQueryClient();

  const registerUser = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest({
        url: apiRoutes.users.admin.register,
        method: 'post',
        data,
        requireAuth: true,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (err) => {
      throw formatApiError(err);
    },
  });

  const updateUser = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest({
        url: `${apiRoutes.users.admin.root}/${data.id}`,
        method: 'put',
        data,
        requireAuth: true,
      });
    },
    onSuccess: (_, data) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user', data.id] });
    },
    onError: (err) => {
      throw formatApiError(err);
    },
  });

  const deleteUsers = useMutation({
    mutationFn: async (userIds: number[]) => {
      return await apiRequest({
        url: apiRoutes.users.admin.root,
        method: 'delete',
        requireAuth: true,
        data: { ids: userIds },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (err) => {
      throw formatApiError(err);
    },
  });

  const viewAsClient = useMutation({
    mutationFn: async (clientId: number) => {
      return await apiRequest({
        url: apiRoutes.users.admin.viewAs,
        method: 'patch',
        requireAuth: true,
        data: { clientId },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
      queryClient.invalidateQueries({ queryKey: ['balances'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
    onError: (err) => {
      throw formatError(err);
    },
  });

  const resendWelcomeEmail = useMutation({
    mutationFn: async (email: string) => {
      return await apiRequest({
        url: apiRoutes.users.admin.resendAccountInfo,
        method: 'post',
        requireAuth: true,
        data: { email },
      });
    },
    onError: (err) => {
      throw formatApiError(err);
    },
  });

  return {
    mutations: {
      registerUser,
      updateUser,
      deleteUsers,
      viewAsClient,
      resendWelcomeEmail,
    },
  };
};
