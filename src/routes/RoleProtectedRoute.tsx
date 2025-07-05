import React from 'react';
import { useNavigate, useLocation } from 'react-router';
import { Roles } from '@/constants/roles';
import { useAuthStore } from '@/stores/auth.store';
import { useUserStore } from '@/stores/user.store';
import Error403 from '@/modules/portal/pages/error-403';

interface RoleProtectedRouteProps {
  allowedRoles?: Roles[];
  children: React.ReactNode;
}

const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({ allowedRoles, children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Determina si el usuario está autenticado usando el store
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // Obtiene el usuario directamente desde el store global
  const userData = useUserStore((state) => state.userData);

  // Permite acceso a cualquier usuario autenticado si no se pasan roles o se pasa Roles.All
  const allowAll = !allowedRoles || allowedRoles.length === 0 || allowedRoles.includes(Roles.All);
  const userRole = userData && typeof userData === 'object' && 'role' in userData ? userData.role : undefined;

  // Validación inicial
  if (!isAuthenticated || !userData) {
    navigate('/auth/login', { replace: true, state: { from: location } });
    return null;
  }

  if (!allowAll && userRole && !allowedRoles!.includes(userRole as Roles)) {
    return <Error403 />; // Renderizar directamente la página de error 403
  }

  return <>{children}</>;
};

export default RoleProtectedRoute;
