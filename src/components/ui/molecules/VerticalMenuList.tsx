import { Roles } from '@/constants/roles';
import { usePortalMenus } from '@/hooks/usePortalMenus';
import { usePageDataStore } from '@/stores';
import { List, Divider, styled } from '@mui/material';
import { useNavigate } from 'react-router';
import VerticalMenuItem from './VerticalMenuItem';

interface VerticalDrawerListProps {
  onItemClick: () => void;
}

const StyledDivider = styled(Divider)(({ theme }) => ({
  margin: theme.spacing(1, 0),
  fontWeight: 'bold',
  fontSize: '13px',
  color: theme.palette.text.secondary,
  textTransform: 'uppercase',
}));

const VerticalMenuList: React.FC<VerticalDrawerListProps> = ({ onItemClick }) => {
  const navigate = useNavigate();
  const { openMenu: isOpen, openSubMenu, toggleSubMenu } = usePageDataStore();

  // Obtenemos los ítems del menú directamente desde el hook
  const menuItems = usePortalMenus();

  const handleSubMenuClick = (text: string) => {
    toggleSubMenu(text);
  };

  const handleNavigation = (path?: string) => {
    if (path) {
      navigate(path);
      onItemClick();
    }
  };

  // Separar los ítems de admin de los ítems generales
  const adminItems = menuItems.filter((item) => item.roles.includes(Roles.Admin));
  const generalItems = menuItems.filter((item) => !item.roles.includes(Roles.Admin));

  return (
    <List>
      {/* Renderizamos los ítems generales del menú */}
      {generalItems.map((item) => (
        <VerticalMenuItem
          key={item.text}
          item={item}
          open={isOpen}
          isSubMenuOpen={openSubMenu === item.text}
          onClick={() => {
            if (item.subMenuItems && item.subMenuItems.length > 0) {
              handleSubMenuClick(item.text);
            } else {
              handleNavigation(item.path);
            }
          }}
          onSubMenuClick={() => handleSubMenuClick(item.text)}
          onSubItemClick={onItemClick}
        />
      ))}

      {/* Si hay ítems de administrador, mostramos el divisor "Admin Menu" y los ítems */}
      {adminItems.length > 0 && (
        <>
          {isOpen && <StyledDivider>Admin Menu</StyledDivider>}
          {adminItems.map((item) => (
            <VerticalMenuItem
              key={item.text}
              item={item}
              open={isOpen}
              isSubMenuOpen={openSubMenu === item.text}
              onClick={() => {
                if (item.subMenuItems && item.subMenuItems.length > 0) {
                  handleSubMenuClick(item.text);
                } else {
                  handleNavigation(item.path);
                }
              }}
              onSubMenuClick={() => handleSubMenuClick(item.text)}
              onSubItemClick={onItemClick}
            />
          ))}
        </>
      )}
    </List>
  );
};

export default VerticalMenuList;
