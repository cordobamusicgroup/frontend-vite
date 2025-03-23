import { Roles } from "@/constants/roles";
import webRoutes from "@/lib/web.routes";
import { Home as HomeIcon, AttachMoney as AttachMoneyIcon, LibraryMusic, SupervisedUserCircle, ContactEmergency, Assessment, Inbox } from "@mui/icons-material";

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
      text: "Overview",
      icon: <HomeIcon />,
      roles: [Roles.All],
      path: webRoutes.web.backoffice.overview,
    },
    {
      text: "Financial",
      icon: <AttachMoneyIcon />,
      roles: [Roles.All],
      subMenuItems: [
        {
          text: "Payments & Operations",
          path: webRoutes.web.backoffice.financial.payments,
          roles: [Roles.All],
        },
        {
          text: "Financial Reports",
          path: webRoutes.web.backoffice.financial.reports,
          roles: [Roles.All],
        },
      ],
    },
    {
      text: "Workflow",
      icon: <Inbox />,
      roles: [Roles.Admin],
      path: webRoutes.web.admin.workflow.root,
    },
    {
      text: "Clients",
      icon: <ContactEmergency />,
      roles: [Roles.Admin],
      path: webRoutes.web.admin.clients.root,
    },
    {
      text: "Labels",
      icon: <LibraryMusic />,
      roles: [Roles.Admin],
      path: webRoutes.web.admin.labels.root,
    },
    {
      text: "Users",
      icon: <SupervisedUserCircle />,
      roles: [Roles.Admin],
      path: webRoutes.web.admin.users.root,
    },
    {
      text: "Reports",
      icon: <Assessment />,
      roles: [Roles.Admin],
      subMenuItems: [
        {
          text: "Link Missing Reports",
          path: webRoutes.web.admin.reports.unlinked.root,
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
