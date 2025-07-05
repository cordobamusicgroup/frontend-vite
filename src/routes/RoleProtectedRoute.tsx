import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { Roles } from '@/constants/roles';
import { useAuthStore } from '@/stores/auth.store';
import { useUserStore } from '@/stores/user.store';

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

  useEffect(() => {
    if (!isAuthenticated && !userData) {
      navigate('/auth/login', { replace: true, state: { from: location } });
      return;
    }
    if (!allowAll && userRole && !allowedRoles!.includes(userRole as Roles)) {
      navigate('/backoffice/', { replace: true });
    }
  }, [isAuthenticated, userData, userRole, allowAll, allowedRoles, location, navigate]);

  return <>{children}</>;
};

export default RoleProtectedRoute;
