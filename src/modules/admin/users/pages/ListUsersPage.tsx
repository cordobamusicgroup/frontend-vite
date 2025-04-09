import { Box, Typography } from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import theme from '@/theme';
import { useNavigate } from 'react-router';
import webRoutes from '@/lib/web.routes';
import BasicButton from '@/components/ui/atoms/BasicButton';
import ErrorBox from '@/components/ui/molecules/ErrorBox';
import SuccessBox from '@/components/ui/molecules/SuccessBox';
import { useNotificationStore } from '@/stores';
import CustomPageHeader from '@/components/ui/molecules/CustomPageHeader';
import { useNotificationCleanup } from '@/hooks/useNotificationCleanup';
import { Helmet } from 'react-helmet';
import ListUserTable from '../components/organisms/ListUsersTable';

const ListUsersPage: React.FC = () => {
  const navigate = useNavigate();

  const { notification, setNotification } = useNotificationStore();

  const handleCreate = (): void => {
    navigate(webRoutes.admin.users.create);
  };

  useNotificationCleanup();

  return (
    <>
      <Helmet>
        <title>Users - Córdoba Music Group</title>
      </Helmet>
      <Box p={3} sx={{ display: 'flex', flexDirection: 'column' }}>
        <CustomPageHeader background={'#24793B'} color={theme.palette.primary.contrastText}>
          <Typography sx={{ flexGrow: 1, fontSize: '16px' }}>Manage Users</Typography>
          <BasicButton colorBackground="white" colorText={'#164723'} onClick={handleCreate} color="primary" variant="contained" startIcon={<PersonAddIcon />}>
            Create User
          </BasicButton>
        </CustomPageHeader>

        <Box>
          {notification?.type === 'success' && <SuccessBox>{notification.message}</SuccessBox>}
          {notification?.type === 'error' && <ErrorBox>{notification.message}</ErrorBox>}
        </Box>

        <Box sx={{ display: 'flex', height: '600px', width: '100%' }}>
          <ListUserTable setNotification={setNotification} />
        </Box>
      </Box>
    </>
  );
};

export default ListUsersPage;
