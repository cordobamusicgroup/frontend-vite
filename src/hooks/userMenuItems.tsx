// menuItems.tsx

import webRoutes from '@/routes/web.routes';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router';
import { Roles } from '@/constants/roles';
import useAuthQueries from '@/modules/auth/hooks/useAuthQueries';
import { eventBus } from '@/eventBus';
import { useUserStore } from '@/stores/user.store';
import { filterItemsByRole } from '@/lib/filterItemsByRole.util';

interface MenuItemType {
  text: string;
  icon: React.ReactNode;
  roles: Roles[];
  path?: string;
  onClick?: () => void;
}

const createMenuItem = (text: string, icon: React.ReactNode, roles: Roles[], onClick?: () => void, path?: string): MenuItemType => ({
  text,
  icon,
  roles,
  onClick,
  path,
});

/**
 * Hook that generates the user menu items based on the user's role and provides actions such as logout and navigation.
 * @param userRole The user's role
 * @returns MenuItemType[] with available user menu options
 */
export const useUserMenuItems = (): MenuItemType[] => {
  const userData = useUserStore((state) => state.userData);
  const userRole = (userData?.role as Roles) || Roles.User; // userData.role ya es del tipo Roles, pero forzamos el tipo para TS
  const { logoutMutation } = useAuthQueries();
  const navigate = useNavigate();

  const allMenuItems: MenuItemType[] = [
    createMenuItem('Profile', <AccountCircleIcon fontSize="small" />, [Roles.All], () => navigate(webRoutes.backoffice.user.profile), webRoutes.backoffice.user.profile),
    // Solo para admin
    createMenuItem('View as Client', <VisibilityIcon fontSize="small" />, [Roles.Admin], () => {
      eventBus.emit('openViewAsClientDialog');
    }),
    createMenuItem('Logout', <ExitToAppIcon fontSize="small" />, [Roles.All], () => logoutMutation.mutateAsync()),
  ];

  return filterItemsByRole(allMenuItems, userRole);
};
