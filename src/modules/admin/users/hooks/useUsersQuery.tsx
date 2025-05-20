import { useQuery } from '@tanstack/react-query';
import { apiRoutes } from '@/lib/api.routes';
import { useApiRequest } from '@/hooks/useApiRequest';

/**
 * Hook to fetch one or all users.
 * @param userId optional user ID
 */
export const useUsersQuery = (userId?: string, enabled = true) => {
  const { apiRequest } = useApiRequest();

  const fetchUsers = async () => {
    const url = userId ? `${apiRoutes.users.admin.getById(Number(userId))}` : apiRoutes.users.admin.root;

    return await apiRequest({
      url,
      method: 'get',
      requireAuth: true,
    });
  };

  return useQuery({
    queryKey: userId ? ['user', userId] : ['users'],
    queryFn: fetchUsers,
    enabled,
    retry: false,
  });
};
