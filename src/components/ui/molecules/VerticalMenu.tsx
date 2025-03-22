import { Drawer, Divider, List, IconButton } from "@mui/material";
import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import { usePageDataStore } from "@/stores";
import { isMobile } from "@/theme";
import VerticalMenuHeader from "./VerticalMenuHeader";
import VerticalMenuList from "./VerticalMenuList";

const StyledDrawer = styled(Drawer, {
  shouldForwardProp: (prop) => prop !== "isMenuOpen",
})<{ isMenuOpen: boolean }>(({ theme, isMenuOpen }) => ({
  "& .MuiDrawer-paper": {
    width: isMenuOpen ? 240 : 60,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: "hidden",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
      display: isMenuOpen ? "block" : "none",
    },
  },
}));

const VerticalMenu: React.FC = () => {
  const { openMenu: isMenuOpen, toggleMenu } = usePageDataStore();

  const handleClose = () => {
    toggleMenu();
  };

  const handleItemClick = () => {
    if (isMobile()) {
      toggleMenu();
    }
  };

  return (
    <StyledDrawer variant="permanent" isMenuOpen={isMenuOpen}>
      {isMobile() && isMenuOpen && (
        <IconButton onClick={handleClose} sx={{ position: "absolute", top: 10, right: 2 }}>
          <CloseIcon />
        </IconButton>
      )}
      <VerticalMenuHeader />
      <Divider />
      <List>
        <VerticalMenuList onItemClick={handleItemClick} />
      </List>
    </StyledDrawer>
  );
};

export default VerticalMenu;
