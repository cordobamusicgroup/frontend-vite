import { IconButton as MUIIconButton } from '@mui/material';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import MenuIcon from '@mui/icons-material/Menu';

interface IconButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

const MenuButtonToggle: React.FC<IconButtonProps> = ({ isOpen, onClick }) => (
  <MUIIconButton color="inherit" aria-label="toggle menu" onClick={onClick} edge="start">
    {isOpen ? <MenuOpenIcon /> : <MenuIcon />}
  </MUIIconButton>
);

export default MenuButtonToggle;
