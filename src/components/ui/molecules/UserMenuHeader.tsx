// React imports
import React, { useState } from 'react';

// MUI components
import { Menu, MenuItem, ListItemIcon, ListItemText, Box, Typography, IconButton, Divider, Avatar } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

// Custom hooks and utilities
import { useUserMenuItems } from '@/hooks/userMenuItems';
import { useUserStore } from '@/stores';
import { isMobile } from '@/theme';

// Components
import LoadingSpinner from '../atoms/LoadingSpinner';
import { useNavigate } from 'react-router';
import { shallow } from 'zustand/shallow';

/**
 * Component that displays a user menu with options for the current user.
 * Shows "Profile" label on desktop next to the icon.
 * User information is displayed within the dropdown menu for both mobile and desktop.
 *
 * @returns {React.FC} The UserMenuHeader component
 */
const UserMenuHeader: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();

  const theme = useTheme();
  const userData = useUserStore((state) => state.userData);
  const menuItems = useUserMenuItems(userData?.role || 'User');

  const isMobileView = isMobile();
  const isMenuOpen = Boolean(anchorEl);

  // Get the first letter of user's fullName or use "U" as fallback
  const userInitial = userData?.fullName ? userData.fullName.charAt(0).toUpperCase() : 'U';

  /**
   * Opens the user menu when clicking on the user icon.
   * @param {React.MouseEvent<HTMLElement>} event - The click event
   */
  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  /**
   * Closes the user menu.
   */
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  /**
   * Handles menu item click based on whether it has onClick or path
   */
  const handleMenuItemClick = (item: any) => {
    if (item.onClick) {
      item.onClick();
    } else if (item.path) {
      navigate(item.path);
    }
    handleCloseMenu();
  };

  return (
    <Box display="flex" alignItems="center">
      <Box display="flex" alignItems="center" sx={{ cursor: 'pointer' }} onClick={handleOpenMenu}>
        <IconButton
          edge="end"
          aria-label="user account menu"
          aria-controls="user-menu"
          aria-haspopup="true"
          color="inherit"
          size="small" // Make the icon button smaller
          sx={{ padding: '4px' }}
        >
          <Avatar
            sx={{
              width: 32,
              height: 32,
              bgcolor: 'white',
              color: theme.palette.primary.main,
              fontSize: '0.875rem',
              fontWeight: 'bold',
            }}
          >
            {userInitial}
          </Avatar>
        </IconButton>
        {!isMobileView && (
          <Typography
            variant="body2"
            sx={{
              display: { xs: 'none', sm: 'block' },
              ml: 1, // Reduce margin between text and icon
            }}
          >
            {userData?.fullName}
          </Typography>
        )}
      </Box>

      {/* User dropdown menu */}
      <Menu
        id="user-menu"
        anchorEl={anchorEl}
        keepMounted
        open={isMenuOpen}
        onClose={handleCloseMenu}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        slotProps={{
          paper: {
            style: {
              maxHeight: '300px',
              [theme.breakpoints.down('sm')]: {
                maxHeight: '200px',
              },
            },
          },
          list: {
            dense: false,
            sx: { py: 0 },
          },
        }}
      >
        {userData ? (
          <div>
            <Box sx={{ px: 2, py: 1, textAlign: 'center' }}>
              <Typography variant="subtitle2" fontWeight="bold">
                {userData.username || 'User'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Client ID: {userData?.clientId || 'Unknown'}
              </Typography>
            </Box>
            <Divider sx={{ my: 0 }} />
          </div>
        ) : (
          <div>
            <Box sx={{ px: 2, py: 1, textAlign: 'center', display: 'flex', justifyContent: 'center' }}>
              <LoadingSpinner size={20} />
            </Box>
            <Divider sx={{ my: 0.5 }} />
          </div>
        )}

        <Box
          sx={{
            mt: 1,
            mb: 1,
          }}
        >
          {menuItems.map((item, index) => (
            <MenuItem key={index} onClick={() => handleMenuItemClick(item)}>
              <ListItemIcon sx={{ minWidth: '35px' }}>{item.icon}</ListItemIcon>
              <ListItemText
                primary={item.text}
                slotProps={{
                  primary: {
                    fontSize: '14px',
                  },
                }}
              />
            </MenuItem>
          ))}
        </Box>
      </Menu>
    </Box>
  );
};

export default UserMenuHeader;
