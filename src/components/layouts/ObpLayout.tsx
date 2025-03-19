import { ReactNode } from "react";
import { Outlet } from "react-router";

//TODO: Implement this layout
// * Add HeaderLayout
// * Add VerticalMenu
// * Add MainContent

const PortalLayout: React.FC = () => {
  //   const isOpen = usePageDataStore().openMenu;

  //   const isMobile = useMediaQuery((theme: any) => theme.breakpoints.down("sm"));

  return (
    <div>
      Layout
      <Outlet />
    </div>
  );
};

export default PortalLayout;
