import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { Roles } from '@/constants/roles';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/auth.store';

interface RoleProtectedRouteProps {
  allowedRoles?: Roles[];
  children: React.ReactNode;
}

const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({ allowedRoles, children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  // Determina si el usuario está autenticado usando el store
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // Obtiene el usuario desde el cache (AuthProvider lo mantiene actualizado)
  const { data: userData, isLoading } = useQuery({
    queryKey: ['auth', 'user'],
    enabled: isAuthenticated,
    queryFn: async () => queryClient.getQueryData(['auth', 'user']) ?? null,
  });

  // Permite acceso a cualquier usuario autenticado si no se pasan roles o se pasa Roles.All
  const allowAll = !allowedRoles || allowedRoles.length === 0 || allowedRoles.includes(Roles.All);
  const userRole = userData && typeof userData === 'object' && 'role' in userData ? (userData as any).role : undefined;

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated && !userData) {
      navigate('/auth/login', { replace: true, state: { from: location } });
      return;
    }
    if (!allowAll && userRole && !allowedRoles!.includes(userRole as Roles)) {
      navigate('/backoffice/', { replace: true });
    }
  }, [isAuthenticated, userData, userRole, allowAll, allowedRoles, location, navigate, isLoading]);

  return <>{children}</>;
};

export default RoleProtectedRoute;
