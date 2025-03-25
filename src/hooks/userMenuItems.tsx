// menuItems.tsx

import webRoutes from "@/lib/web.routes";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import { AccountBalance, AccountCircle, ExitToApp } from "@mui/icons-material";
import { useNavigate } from "react-router";

interface MenuItemType {
  text: string;
  icon: React.ReactNode;
  onClick: () => void;
}

// TODO: [CMGDEV-8]  Refactorizar este hook para que sea más legible y mantenible a largo plazo

const createMenuItem = (text: string, icon: React.ReactNode, onClick: () => void): MenuItemType => ({
  text,
  icon,
  onClick,
});

export const useUserMenuItems = (): MenuItemType[] => {
  const auth = useAuth();
  const navigate = useNavigate();

  return [
    createMenuItem("Profile", <AccountCircle fontSize="small" />, () => {
      navigate(webRoutes.backoffice.user.profile);
    }),
    createMenuItem("Logout", <ExitToApp fontSize="small" />, () => {
      auth.logout();
    }),
  ];
};
