import { usePageDataStore } from '@/stores';
import { isMobile } from '@/theme';
import { styled } from '@mui/material';
import { Outlet, useNavigation } from 'react-router';
import HeaderLayout from './HeaderLayout';
import VerticalMenu from '../ui/molecules/VerticalMenu';
import SkeletonLoader from '../ui/molecules/SkeletonLoader';
import ViewAsClientDialog from '../ui/molecules/ViewAsClientDialog';
import { useRouteCleanup } from '@/hooks/useRouteCleanup';

/**
 * Represents the main content component.
 * @component
 */

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{ open?: boolean }>(({ theme, open }) => {
  const mobile = isMobile();
  return {
    flexGrow: 1,
    backgroundColor: '#fcfcfc',
    padding: theme.spacing(3),
    minHeight: 'calc(100vh - 64px)',
    marginTop: 64,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: mobile ? 0 : `60px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: mobile ? 0 : `240px`,
    }),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(1),
    },
  };
});

const BackofficeLayout: React.FC = () => {
  useRouteCleanup();
  const isOpen = usePageDataStore().openMenu;
  const navigation = useNavigation();
  const isNavigating = Boolean(navigation.location);

  return (
    <div>
      {isNavigating && <title>Loading ...</title>}
      <HeaderLayout />
      {!isMobile() && <VerticalMenu />}
      {isMobile() && isOpen && <VerticalMenu />}
      <Main open={isOpen}>{isNavigating ? <SkeletonLoader /> : <Outlet />}</Main>
      <ViewAsClientDialog />
    </div>
  );
};

export default BackofficeLayout;
