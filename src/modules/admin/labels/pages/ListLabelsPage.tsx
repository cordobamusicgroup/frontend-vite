import { Box, Typography } from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import theme from '@/theme';
import { useNavigate } from 'react-router';
import webRoutes from '@/routes/web.routes';
import BasicButton from '@/components/ui/atoms/BasicButton';
import ErrorBox from '@/components/ui/molecules/ErrorBox';
import SuccessBox from '@/components/ui/molecules/SuccessBox';
import { useNotificationStore } from '@/stores';
import CustomPageHeader from '@/components/ui/molecules/CustomPageHeader';
import type { MetaFunction } from 'react-router';
import ListLabelsTable from '../components/organisms/ListLabelsTable';

export const meta: MetaFunction = () => {
  return [
    { title: 'Labels - Córdoba Music Group' },
    { name: 'description', content: 'Manage music labels' },
  ];
};

const ListLabelsPage: React.FC = () => {
  const navigate = useNavigate();

  const { notification, setNotification } = useNotificationStore();

  const handleCreateLabel = (): void => {
    navigate(webRoutes.admin.labels.create);
  };

  return (
    <Box p={3} sx={{ display: 'flex', flexDirection: 'column' }}>
        <CustomPageHeader background={'#24793B'} color={theme.palette.primary.contrastText}>
          <Typography sx={{ flexGrow: 1, fontSize: '16px' }}>Manage Labels</Typography>
          <BasicButton colorBackground="white" colorText={'#164723'} onClick={handleCreateLabel} color="primary" variant="contained" startIcon={<PersonAddIcon />}>
            Create Label
          </BasicButton>
        </CustomPageHeader>

        <Box>
          {notification?.type === 'success' && <SuccessBox>{notification.message}</SuccessBox>}
          {notification?.type === 'error' && <ErrorBox>{notification.message}</ErrorBox>}
        </Box>

        <Box sx={{ display: 'flex', height: '600px', width: '100%' }}>
          <ListLabelsTable setNotification={setNotification} />
        </Box>
      </Box>
  );
};

export default ListLabelsPage;
