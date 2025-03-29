import { useState } from 'react';
import { Box, TextField, Typography } from '@mui/material';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
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
import ListClientsTable from '../../clients/components/organisms/ListClientsTable';
import ListLabelsTable from '../components/organisms/ListLabelsTable';

const ListLabelsPage: React.FC = () => {
  const navigate = useNavigate();

  const { notification, setNotification, clearNotification } = useNotificationStore();

  const handleCreateClient = (): void => {
    navigate(webRoutes.admin.clients.create);
  };

  useNotificationCleanup();

  return (
    <>
      <Helmet>
        <title>Labels - Córdoba Music Group</title>
      </Helmet>
      <Box p={3} sx={{ display: 'flex', flexDirection: 'column' }}>
        <CustomPageHeader background={'#24793B'} color={theme.palette.primary.contrastText}>
          <Typography sx={{ flexGrow: 1, fontSize: '16px' }}>Manage Labels</Typography>
          <BasicButton
            colorBackground="white"
            colorText={'#164723'}
            onClick={handleCreateClient}
            color="primary"
            variant="contained"
            startIcon={<PersonAddIcon />}
          >
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
    </>
  );
};

export default ListLabelsPage;
