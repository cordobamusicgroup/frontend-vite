import { useQuery } from '@tanstack/react-query';
import { apiRoutes } from '@/routes/api.routes';
import { useApiRequest } from '@/hooks/useApiRequest';

/**
 * useFetchUsers
 *
 * Si se pasa un userId, retorna la información de un usuario específico.
 * Si no se pasa userId, retorna la lista de usuarios.
 *
 * @param userId (opcional) id del usuario a consultar
 * @returns { query } objeto de React Query con los datos y helpers
 */
export const useFetchUsers = (userId?: string) => {
  const { apiRequest } = useApiRequest();
  const queryKey = userId ? ['user', userId] : ['users'];

  const fetchUsers = async () => {
    const url = userId ? `${apiRoutes.users.admin.getById(Number(userId))}` : apiRoutes.users.admin.root;
    return await apiRequest({
      url,
      method: 'get',
      requireAuth: true,
    });
  };

  // La query siempre se ejecuta: si hay userId trae uno, si no trae la lista
  const query = useQuery({
    queryKey,
    queryFn: fetchUsers,
    retry: false,
  });

  return {
    /**
     * query: objeto de React Query
     * - data: datos de la lista o del usuario
     * - isLoading, error, refetch, etc.
     */
    query,
  };
};
