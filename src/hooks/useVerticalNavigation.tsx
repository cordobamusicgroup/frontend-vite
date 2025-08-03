import { Roles } from '@/constants/roles';
import webRoutes from '@/routes/web.routes';
import HomeIcon from '@mui/icons-material/Home';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import ContactEmergencyIcon from '@mui/icons-material/ContactEmergency';
import AssessmentIcon from '@mui/icons-material/Assessment';
import AlbumIcon from '@mui/icons-material/Album';
import { useUserStore } from '@/stores';
import { filterItemsByRole } from '@/lib/filterItemsByRole.util';

export interface SubMenuType {
  text: string;
  roles: Roles[];
  path?: string;
  onClick?: () => void;
}

export interface MenuItemType {
  text: string;
  icon: React.ReactNode;
  roles: Roles[];
  subMenuItems?: SubMenuType[];
  path?: string;
  onClick?: () => void;
}

/**
 * Hook that generates the navigation menu based on the user's role.
 * @returns MenuItemType[] with the available menu options for the user
 */
export const useVerticalNavigation = (): MenuItemType[] => {
  const allMenuItems: MenuItemType[] = [
    {
      text: 'Overview',
      icon: <HomeIcon />,
      roles: [Roles.All],
      path: webRoutes.backoffice.overview,
    },
    {
      text: 'Distribution',
      icon: <AlbumIcon />,
      roles: [Roles.All],
      subMenuItems: [
        {
          text: 'DMB Submission QC',
          path: webRoutes.backoffice.distribution.dmbSubmissionQC,
          roles: [Roles.All],
        },
      ],
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

  // Obtiene el rol del usuario directamente desde el store
  const userRole = useUserStore((state) => state.userData?.role) || Roles.User; // userData.role ya es del tipo Roles

  return filterItemsByRole(allMenuItems, userRole as Roles);
};
