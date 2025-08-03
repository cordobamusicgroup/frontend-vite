import React, { useCallback } from 'react';
import { ListItemIcon, ListItemText, Collapse, List, Link, ListItemButton } from '@mui/material';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined';
import { MenuItemType, SubMenuType } from '@/hooks/useVerticalNavigation';
import { useNavigate } from 'react-router';

interface VerticalMenuItemProps {
  item: MenuItemType;
  open: boolean;
  isSubMenuOpen: boolean;
  onClick: () => void;
  onSubMenuClick: () => void;
  onSubItemClick: () => void;
}

/**
 * Renders a submenu item with link capabilities
 */
const SubMenuItem: React.FC<{
  subItem: SubMenuType;
  onItemClick: (e: React.MouseEvent, path: string) => void;
}> = ({ subItem, onItemClick }) => (
  <ListItemButton key={subItem.text} component={Link} href={subItem.path} onClick={(e: React.MouseEvent) => onItemClick(e, subItem.path)} sx={{ pl: 3, py: 0.5 }}>
    <ListItemIcon sx={{ mr: 2, minWidth: 'auto' }}>
      <ArrowForwardOutlinedIcon sx={{ fontSize: '1rem' }} />
    </ListItemIcon>
    <ListItemText primary={subItem.text} primaryTypographyProps={{ fontSize: '14px' }} />
  </ListItemButton>
);

/**
 * Renders the main menu item content (icon, text, and expand arrow)
 */
const MenuItemContent: React.FC<{
  item: MenuItemType;
  isOpen: boolean;
  isSubMenuOpen: boolean;
}> = ({ item, isOpen, isSubMenuOpen }) => (
  <>
    <ListItemIcon sx={{ mr: 2, minWidth: 'auto' }}>
      {React.isValidElement(item.icon) ? React.cloneElement(item.icon as React.ReactElement<any>, { sx: { fontSize: '1.3rem' } }) : item.icon}
    </ListItemIcon>

    {isOpen && <ListItemText primary={item.text} primaryTypographyProps={{ fontSize: '14px' }} />}

    {/* Fixed undefined check */}
    {isOpen && item.subMenuItems && item.subMenuItems.length > 0 && (isSubMenuOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />)}
  </>
);

/**
 * Vertical menu item component that renders either a link or a clickable item
 * with optional submenu items in a collapsible section
 */
const VerticalMenuItem: React.FC<VerticalMenuItemProps> = ({ item, open, isSubMenuOpen, onClick, onSubItemClick }) => {
  const navigate = useNavigate();

  // Determine if the item should be rendered as a link
  const hasPath = Boolean(item.path);
  const hasNoSubmenus = !item.subMenuItems || item.subMenuItems.length === 0;
  const shouldRenderAsLink = hasPath && hasNoSubmenus;

  // Check if item has submenus
  const hasSubMenuItems = item.subMenuItems && item.subMenuItems.length > 0;

  const handleMainItemClick = useCallback(
    (e: React.MouseEvent) => {
      // Only handle left mouse button clicks
      if (e.button === 0) {
        e.preventDefault();

        // Navigate programmatically if it's a direct link
        if (item.path && hasNoSubmenus) {
          navigate(item.path);
        }

        onClick();
      }
    },
    [item.path, hasNoSubmenus, navigate, onClick],
  );

  const handleSubItemClick = useCallback(
    (e: React.MouseEvent, path: string) => {
      if (e.button === 0) {
        e.preventDefault();
        navigate(path);
        onSubItemClick();
      }
    },
    [navigate, onSubItemClick],
  );

  return (
    <>
      {/* Main menu item - either as a link or regular item */}
      {shouldRenderAsLink ? (
        <ListItemButton component={Link} href={item.path || '#'} onClick={handleMainItemClick}>
          <MenuItemContent item={item} isOpen={open} isSubMenuOpen={isSubMenuOpen} />
        </ListItemButton>
      ) : (
        <ListItemButton onClick={onClick}>
          <MenuItemContent item={item} isOpen={open} isSubMenuOpen={isSubMenuOpen} />
        </ListItemButton>
      )}

      {/* Submenu items in collapsible section - Fixed undefined check */}
      {hasSubMenuItems && item.subMenuItems && (
        <Collapse in={open && isSubMenuOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {item.subMenuItems.map((subItem) => (
              <SubMenuItem key={subItem.text} subItem={subItem} onItemClick={handleSubItemClick} />
            ))}
          </List>
        </Collapse>
      )}
    </>
  );
};

export default VerticalMenuItem;
