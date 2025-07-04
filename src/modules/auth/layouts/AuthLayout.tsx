import { Box } from '@mui/material';
import LoginLogo from '../components/atoms/LoginLogo';
import { Outlet } from 'react-router';
import { useRouteCleanup } from '@/hooks/useRouteCleanup';
import PublicOnlyRoute from '@/routes/PublicOnlyRoute';

const AuthLayout: React.FC = () => {
  useRouteCleanup();
  return (
    <PublicOnlyRoute>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          padding: 3,
        }}
      >
        <LoginLogo />
        <Outlet />
      </Box>
    </PublicOnlyRoute>
  );
};
export default AuthLayout;
