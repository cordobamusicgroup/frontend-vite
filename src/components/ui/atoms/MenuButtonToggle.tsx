import { IconButton as MUIIconButton } from "@mui/material";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";

interface IconButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

const MenuButtonToggle: React.FC<IconButtonProps> = ({ isOpen, onClick }) => (
  <MUIIconButton color="inherit" aria-label="toggle menu" onClick={onClick} edge="start">
    {isOpen ? <MenuOpenIcon /> : <MenuOpenIcon />}
  </MUIIconButton>
);

export default MenuButtonToggle;
