import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRoutes } from '@/lib/api.routes';
import { useApiRequest } from '@/hooks/useApiRequest';
import { formatApiError } from '@/lib/formatApiError.util';

/**
 * Hook to manage fetching and mutating users (admin).
 * If a userId is provided, fetches a single user; otherwise, fetches all users.
 *
 * @param userId Optional user ID to fetch a specific user
 * @returns Object with data, loading/error states, and mutation functions
 */
export const useUsersAdmin = (userId?: string) => {
  const { apiRequest } = useApiRequest();
  const queryClient = useQueryClient();

  // Determine the query key based on whether a single client or all clients are needed
  const queryKey = userId ? ['user', userId] : ['users'];

  /**
   * Function to fetch clients.
   * If `clientId` is provided, fetches the client by ID; otherwise, fetches all clients.
   */
  const fetchUsers = async () => {
    try {
      const url = userId ? `${apiRoutes.users.admin.getById(Number(userId))}` : apiRoutes.users.admin.root;

      return await apiRequest({
        url,
        method: 'get',
        requireAuth: true,
      });
    } catch (error) {
      throw formatApiError(error);
    }
  };

  const query = useQuery({
    queryKey,
    queryFn: fetchUsers,
    retry: false,
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
        throw formatApiError(error);
      }
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['users'],
      });
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
        throw formatApiError(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['users', 'user', userId],
      });
    },
  });

  const deleteUsers = useMutation({
    mutationFn: async (usersIds: number[]) => {
      try {
        return await apiRequest({
          url: apiRoutes.users.admin.root,
          method: 'delete',
          requireAuth: true,
          data: { ids: usersIds },
        });
      } catch (error) {
        throw formatApiError(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['users'],
      });
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
        throw formatApiError(error);
      }
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
        throw formatApiError(error);
      }
    },
  });

  return {
    // Data
    usersData: query.data,

    // Loading states
    loading: {
      userFetch: query.isLoading,
      registerUser: registerUser.isPending,
      updateUser: updateUser.isPending,
      deleteUsers: deleteUsers.isPending,
      viewAsClient: viewAsClient.isPending,
      resendWelcomeEmail: resendWelcomeEmail.isPending,
    },

    // Error states
    errors: {
      userFetch: query.error,
      viewAsClient: viewAsClient.error,
      resendWelcomeEmail: resendWelcomeEmail.error,
    },

    // Mutations
    mutations: {
      registerUser,
      updateUser,
      deleteUsers,
      viewAsClient,
      resendWelcomeEmail,
    },
  };
};
