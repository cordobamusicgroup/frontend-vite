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
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

export interface MenuItemType {
  text: string;
  icon: React.ReactNode;
  roles: Roles[];
  path?: string;
  onClick?: () => void;
}

/**
 * Hook that generates the user menu items based on the user's role and provides actions such as logout and navigation.
 * @returns MenuItemType[] with available user menu options
 */
export const useUserNavigation = (): MenuItemType[] => {
  const userData = useUserStore((state) => state.userData);
  const userRole = (userData?.role as Roles) || Roles.User;
  const { logoutMutation } = useAuthQueries();
  const navigate = useNavigate();

  const allMenuItems: MenuItemType[] = [
    {
      text: 'Profile',
      icon: <AccountCircleIcon fontSize="small" />,
      roles: [Roles.All],
      path: webRoutes.backoffice.userSettings.profile,
      onClick: () => navigate(webRoutes.backoffice.userSettings.profile),
    },
    {
      text: 'View as Client',
      icon: <VisibilityIcon fontSize="small" />,
      roles: [Roles.Admin],
      onClick: () => {
        eventBus.emit('openViewAsClientDialog');
      },
    },
    {
      text: 'Payment Information',
      icon: <AccountBalanceIcon fontSize="small" />,
      roles: [Roles.All],
      path: webRoutes.backoffice.userSettings.paymentInformation,
    },
    {
      text: 'Logout',
      icon: <ExitToAppIcon fontSize="small" />,
      roles: [Roles.All],
      onClick: () => logoutMutation.mutateAsync(),
    },
  ];

  return filterItemsByRole(allMenuItems, userRole);
};
