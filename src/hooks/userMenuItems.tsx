// menuItems.tsx

import webRoutes from '@/lib/web.routes';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useNavigate } from 'react-router';
import { Roles } from '@/constants/roles';

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

export const useUserMenuItems = (userRole: Roles): MenuItemType[] => {
  const auth = useAuth();
  const navigate = useNavigate();

  const allMenuItems: MenuItemType[] = [
    createMenuItem('Profile', <AccountCircleIcon fontSize="small" />, [Roles.All], () => navigate(webRoutes.backoffice.user.profile), webRoutes.backoffice.user.profile),
    createMenuItem('Logout', <ExitToAppIcon fontSize="small" />, [Roles.All], () => auth.logout()),
  ];

  const filterItemsByRole = <T extends { roles: Roles[] }>(items: T[], role: Roles): T[] => {
    return items.filter((item) => item.roles.includes(Roles.All) || item.roles.includes(role));
  };

  return filterItemsByRole(allMenuItems, userRole);
};
