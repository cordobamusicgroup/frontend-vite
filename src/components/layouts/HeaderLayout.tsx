import { styled } from '@mui/material/styles';
import { AppBar, Toolbar, Box, useMediaQuery, useTheme } from '@mui/material';
import { usePageDataStore } from '@/stores';
import MenuButtonToggle from '../ui/atoms/MenuButtonToggle';
import MobileWhiteLogo from '../ui/atoms/MobileWhiteLogo';
import UserMenuHeader from '../ui/molecules/UserMenuHeader';

const StyledAppBar = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== 'isMenuOpen',
})<{ isMenuOpen: boolean }>(({ theme, isMenuOpen }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  width: isMenuOpen ? `calc(100% - 240px)` : `calc(100% - 60px)`,
  marginLeft: isMenuOpen ? `240px` : `60px`,
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    marginLeft: 0,
  },
}));

const HeaderLayout: React.FC = () => {
  const { openMenu, toggleMenu } = usePageDataStore();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleToggleDrawer = () => {
    toggleMenu();
  };

  return (
    <StyledAppBar position="fixed" isMenuOpen={openMenu} sx={{ boxShadow: 'none' }}>
      <Toolbar
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          background: 'linear-gradient(28deg, rgba(9,54,95,1) 17%, rgba(5,42,76,1) 57%, rgba(0,27,51,1) 100%)',
        }}
      >
        {/* Left section with menu button */}
        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-start' }}>
          <MenuButtonToggle isOpen={openMenu} onClick={handleToggleDrawer} />
        </Box>

        {/* Center section with logo (only on mobile) */}
        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center' }}>{isMobile && <MobileWhiteLogo />}</Box>

        {/* Right section - will contain user menu */}
        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
          <UserMenuHeader />
        </Box>
      </Toolbar>
    </StyledAppBar>
  );
};

export default HeaderLayout;
