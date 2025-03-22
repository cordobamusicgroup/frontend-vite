import { usePageDataStore } from "@/stores";
import { isMobile } from "@/theme";
import { Skeleton, Stack, styled } from "@mui/material";
import { Outlet, useNavigation } from "react-router";
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

/**
 * Content skeleton to display during navigation
 */
const ContentSkeleton = () => (
  <Stack spacing={2}>
    <Skeleton variant="rectangular" height={60} />
    <Skeleton variant="rectangular" height={40} />
    <Stack direction="row" spacing={2}>
      <Skeleton variant="rectangular" height={200} width="30%" />
      <Skeleton variant="rectangular" height={200} width="70%" />
    </Stack>
    <Stack spacing={1}>
      <Skeleton variant="rectangular" height={40} />
      <Skeleton variant="rectangular" height={40} />
      <Skeleton variant="rectangular" height={40} />
    </Stack>
  </Stack>
);

const BackofficeLayout: React.FC = () => {
  const isOpen = usePageDataStore().openMenu;
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";

  return (
    <div>
      <HeaderLayout />
      {!isMobile() && <VerticalMenu />}
      {isMobile() && isOpen && <VerticalMenu />}
      <Main open={isOpen}>
        {isLoading && <ContentSkeleton />}
        <Outlet />
      </Main>
    </div>
  );
};

export default BackofficeLayout;
