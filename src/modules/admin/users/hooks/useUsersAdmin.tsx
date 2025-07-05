import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { apiRoutes } from '@/routes/api.routes';
import { useApiRequest } from '@/hooks/useApiRequest';
import { formatError } from '@/lib/formatApiError.util';
import { useAuthContext } from '@/modules/auth/hooks/useAuthContext';

// Unifica queries y mutations en un solo hook
export const useUsersAdmin = (userId?: string) => {
  const { apiRequest } = useApiRequest();
  const queryClient = useQueryClient();
  const { refetchUser } = useAuthContext();

  const queryKey = userId ? ['user', userId] : ['users'];

  const fetchUsers = async () => {
    try {
      const url = userId ? `${apiRoutes.users.admin.getById(Number(userId))}` : apiRoutes.users.admin.root;
      return await apiRequest({
        url,
        method: 'get',
        requireAuth: true,
      });
    } catch (error) {
      throw formatError(error);
    }
  };

  // By default, do not run the query unless explicitly requested
  const query = useQuery({
    queryKey,
    queryFn: fetchUsers,
    retry: false,
    enabled: false, // Never run automatically
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
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['user'] });
      await queryClient.invalidateQueries({ queryKey: ['balances'] });
      await queryClient.invalidateQueries({ queryKey: ['transactions'] });
      refetchUser(); // Usar el refetch del contexto
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
    query, // Use query.refetch() to trigger manually
    loading: {
      userFetch: query?.isLoading,
      registerUser: registerUser.isPending,
      updateUser: updateUser.isPending,
      deleteUsers: deleteUsers.isPending,
      viewAsClient: viewAsClient.isPending,
      resendWelcomeEmail: resendWelcomeEmail.isPending,
    },
    errors: {
      userFetch: query?.error,
      registerUser: registerUser.error,
      updateUser: updateUser.error,
      deleteUsers: deleteUsers.error,
      viewAsClient: viewAsClient.error,
      resendWelcomeEmail: resendWelcomeEmail.error,
    },
    mutations: {
      registerUser,
      updateUser,
      deleteUsers,
      viewAsClient,
      resendWelcomeEmail,
    },
  };
};
