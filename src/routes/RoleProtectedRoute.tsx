import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { Roles } from '@/constants/roles';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { getAccessTokenFromCookie } from '@/lib/cookies.util';

interface RoleProtectedRouteProps {
  allowedRoles?: Roles[];
  children: React.ReactNode;
}

/**
 * Wrapper de protección de rutas por roles.
 *
 * - Si no se pasa `allowedRoles`, o es vacío, o contiene `Roles.All`,
 *   permite el acceso a cualquier usuario autenticado (sin importar su rol).
 * - Si se pasan roles específicos, solo permite acceso a usuarios autenticados
 *   cuyo rol esté incluido en `allowedRoles`.
 * - Si el usuario no está autenticado, redirige a /auth/login.
 * - Si el usuario no tiene el rol requerido, redirige a /backoffice/.
 * - Usa la query de usuario de React Query para obtener el estado de carga y datos.
 *
 * Ejemplo de uso:
 *   <RoleProtectedRoute allowedRoles={[Roles.Admin]}>
 *     <AdminPage />
 *   </RoleProtectedRoute>
 *
 *   <RoleProtectedRoute>
 *     <AnyAuthenticatedUserPage />
 *   </RoleProtectedRoute>
 */
const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({ allowedRoles, children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  // Usa la query de usuario para obtener loading y datos
  const isAuthenticated = !!getAccessTokenFromCookie();
  const { data: userData, isLoading: isUserLoading } = useQuery({
    queryKey: ['auth', 'user'],
    enabled: isAuthenticated,
    // El fetch real lo hace el AuthProvider, aquí solo leemos el cache
    queryFn: async () => queryClient.getQueryData(['auth', 'user']) as any,
  });
  const isLoading = isUserLoading;

  // Si no se pasan roles o se pasa Roles.All, se permite acceso a cualquier usuario autenticado
  const allowAll = !allowedRoles || allowedRoles.length === 0 || allowedRoles.includes(Roles.All);

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      navigate('/auth/login', { replace: true, state: { from: location } });
      return;
    }
    if (!allowAll && userData && !allowedRoles!.includes(userData.role as Roles)) {
      navigate('/backoffice/', { replace: true });
    }
  }, [isAuthenticated, allowedRoles, userData, location, navigate, isLoading, allowAll]);

  if (isLoading) return null;
  if (!isAuthenticated) return null;
  if (!allowAll && userData && !allowedRoles!.includes(userData.role as Roles)) {
    return null;
  }

  return <>{children}</>;
};

export default RoleProtectedRoute;
