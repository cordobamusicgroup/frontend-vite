import { Roles } from '@/constants/roles';
import webRoutes from '@/lib/web.routes';
import HomeIcon from '@mui/icons-material/Home';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import ContactEmergencyIcon from '@mui/icons-material/ContactEmergency';
import AssessmentIcon from '@mui/icons-material/Assessment';
import InboxIcon from '@mui/icons-material/Inbox';

export interface SubMenuType {
  text: string;
  roles: Roles[];
  path: string;
}

export interface MenuItemType {
  text: string;
  icon: React.ReactNode;
  roles: Roles[];
  subMenuItems?: SubMenuType[];
  path?: string;
  // Remove the onClick property as it should use path instead
}

export const usePortalMenus = (userRole: Roles): MenuItemType[] => {
  const allMenuItems: MenuItemType[] = [
    {
      text: 'Overview',
      icon: <HomeIcon />,
      roles: [Roles.All],
      path: webRoutes.backoffice.overview,
    },
    {
      text: 'Financial',
      icon: <AttachMoneyIcon />,
      roles: [Roles.All],
      subMenuItems: [
        {
          text: 'Payments & Operations',
          path: webRoutes.backoffice.financial.payments,
          roles: [Roles.All],
        },
        {
          text: 'Financial Reports',
          path: webRoutes.backoffice.financial.reports,
          roles: [Roles.All],
        },
      ],
    },
    {
      text: 'Clients',
      icon: <ContactEmergencyIcon />,
      roles: [Roles.Admin],
      path: webRoutes.admin.clients.root,
    },
    {
      text: 'Labels',
      icon: <LibraryMusicIcon />,
      roles: [Roles.Admin],
      path: webRoutes.admin.labels.root,
    },
    {
      text: 'Users',
      icon: <SupervisedUserCircleIcon />,
      roles: [Roles.Admin],
      path: webRoutes.admin.users.root,
    },
    {
      text: 'Reports',
      icon: <AssessmentIcon />,
      roles: [Roles.Admin],
      subMenuItems: [
        {
          text: 'Link Missing Reports',
          path: webRoutes.admin.reports.unlinked.root,
          roles: [Roles.Admin],
        },
      ],
    },
  ];

  const filterItemsByRole = <T extends { roles: Roles[] }>(items: T[], role: Roles): T[] => {
    return items.filter((item) => item.roles.includes(Roles.All) || item.roles.includes(role));
  };

  return filterItemsByRole(allMenuItems, userRole);
};
