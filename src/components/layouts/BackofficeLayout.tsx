import { usePageDataStore } from "@/stores";
import { isMobile } from "@/theme";
import { styled } from "@mui/material";
import { Outlet } from "react-router";
import HeaderLayout from "./HeaderLayout";
import VerticalMenu from "../ui/molecules/VerticalMenu";

//TODO: Implement this layout
// * Add HeaderLayout
// * Add VerticalMenu
// * Add MainContent

/**
 * Represents the main content component.
 * @component
 */
const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{ open?: boolean }>(({ theme, open }) => {
  const mobile = isMobile();
  return {
    flexGrow: 1,
    backgroundColor: "#fcfcfc",
    padding: theme.spacing(3),
    minHeight: "calc(100vh - 64px)",
    marginTop: 64,
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: mobile ? 0 : `60px`,
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: mobile ? 0 : `240px`,
    }),
    [theme.breakpoints.down("sm")]: {
      padding: theme.spacing(1),
    },
  };
});

const BackofficeLayout: React.FC = () => {
  const isOpen = usePageDataStore().openMenu;

  return (
    <div>
      <HeaderLayout />
      {!isMobile() && <VerticalMenu />}
      {isMobile() && isOpen && <VerticalMenu />}
      <Main open={isOpen}>
        <Outlet />
      </Main>
    </div>
  );
};

export default BackofficeLayout;
