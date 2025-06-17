import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { apiRoutes } from '@/lib/api.routes';
import { useApiRequest } from '@/hooks/useApiRequest';
import { formatError } from '@/lib/formatApiError.util';

// Unifica queries y mutations en un solo hook
export const useUsersAdmin = (userId?: string) => {
  const { apiRequest } = useApiRequest();
  const queryClient = useQueryClient();

  // Query para uno o todos los usuarios
  const fetchUsers = async () => {
    const url = userId ? `${apiRoutes.users.admin.getById(Number(userId))}` : apiRoutes.users.admin.root;
    return await apiRequest({
      url,
      method: 'get',
      requireAuth: true,
    });
  };

  const usersQuery = useQuery({
    queryKey: userId ? ['user', userId] : ['users'],
    queryFn: fetchUsers,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: 5 * 60 * 1000,
  });

  const registerUser = useMutation({
    mutationFn: async (data: any) => {
      try {
        return await apiRequest({
          url: apiRoutes.users.admin.register,
          method: 'post',
          data,
          requireAuth: true,
        });
      } catch (error) {
        throw formatError(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (err) => {
      throw formatError(err);
    },
  });

  const updateUser = useMutation({
    mutationFn: async (data: any) => {
      try {
        return await apiRequest({
          url: `${apiRoutes.users.admin.root}/${userId}`,
          method: 'put',
          data,
          requireAuth: true,
        });
      } catch (error) {
        throw formatError(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      if (userId) queryClient.invalidateQueries({ queryKey: ['user', userId] });
    },
  });

  const deleteUsers = useMutation({
    mutationFn: async (userIds: number[]) => {
      try {
        return await apiRequest({
          url: apiRoutes.users.admin.root,
          method: 'delete',
          requireAuth: true,
          data: { ids: userIds },
        });
      } catch (error) {
        throw formatError(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (err) => {
      throw formatError(err);
    },
  });

  const viewAsClient = useMutation({
    mutationFn: async (clientId: number) => {
      try {
        return await apiRequest({
          url: apiRoutes.users.admin.viewAs,
          method: 'patch',
          requireAuth: true,
          data: { clientId },
        });
      } catch (error) {
        throw formatError(error);
      }
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
      try {
        return await apiRequest({
          url: apiRoutes.users.admin.resendAccountInfo,
          method: 'post',
          requireAuth: true,
          data: { email },
        });
      } catch (error) {
        throw formatError(error);
      }
    },
    onError: (err) => {
      throw formatError(err);
    },
  });

  return {
    query: usersQuery,
    mutations: {
      registerUser,
      updateUser,
      deleteUsers,
      viewAsClient,
      resendWelcomeEmail,
    },
  };
};
