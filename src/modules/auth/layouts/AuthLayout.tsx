import { Box } from '@mui/material';
import LoginLogo from '../components/atoms/LoginLogo';
import { Outlet } from 'react-router';

const AuthLayout: React.FC = () => {
  return (
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
  );
};
export default AuthLayout;
