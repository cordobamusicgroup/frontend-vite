// menuItems.tsx

import webRoutes from '@/lib/web.routes';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useNavigate } from 'react-router';
import { Roles } from '@/constants/roles';
import useAuthQueries from '@/modules/auth/hooks/useAuthQueries';

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
export const useUserMenuItems = (userRole: Roles): MenuItemType[] => {
  const { logoutMutation } = useAuthQueries();
  const navigate = useNavigate();

  const allMenuItems: MenuItemType[] = [
    createMenuItem('Profile', <AccountCircleIcon fontSize="small" />, [Roles.All], () => navigate(webRoutes.backoffice.user.profile), webRoutes.backoffice.user.profile),
    createMenuItem('Logout', <ExitToAppIcon fontSize="small" />, [Roles.All], () => logoutMutation.mutateAsync()),
  ];

  const filterItemsByRole = <T extends { roles: Roles[] }>(items: T[], role: Roles): T[] => {
    return items.filter((item) => item.roles.includes(Roles.All) || item.roles.includes(role));
  };

  return filterItemsByRole(allMenuItems, userRole);
};
