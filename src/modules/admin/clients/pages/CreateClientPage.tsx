import { useCallback } from 'react';
import { useClientForm, ClientFormData } from '../hooks/useClientForm';
import { Box, Typography, useTheme, Paper } from '@mui/material';
import { FormProvider } from 'react-hook-form';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import BasicButton from '@/components/ui/atoms/BasicButton';
import ErrorBox from '@/components/ui/molecules/ErrorBox';
import SuccessBox from '@/components/ui/molecules/SuccessBox';
import { useNotificationStore } from '@/stores';
import CustomPageHeader from '@/components/ui/molecules/CustomPageHeader';
import { Helmet } from 'react-helmet';
import { useClientsAdmin } from '../hooks/useClientsAdmin';
import ValidationErrorModal from '../components/ValidationErrorModal';
import BackPageButton from '@/components/ui/atoms/BackPageButton';
import ClientFormLayout from '../components/organisms/ClientFormLayout';
import { formatError } from '@/lib/formatApiError.util';
import { buildClientPayload } from '../utils/buildClientPayload.util';
import { Roles } from '@/constants/roles';
import RoleProtectedRoute from '@/routes/RoleProtectedRoute';

const CreateClientPage: React.FC = () => {
  const theme = useTheme();
  const { mutations: clientMutations, loading: clientOperationsLoading } = useClientsAdmin();
  const { notification: clientNotification, setNotification: setClientNotification, clearNotification: clearClientNotification } = useNotificationStore();

  const onSuccess = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setClientNotification({ message: 'Client created successfully', type: 'success' });
  }, [setClientNotification]);

  const onError = useCallback(
    (msg: string) => {
      if (msg) setClientNotification({ message: msg, type: 'error' });
      else clearClientNotification();
    },
    [setClientNotification, clearClientNotification],
  );

  const onSubmitClient = async (formData: ClientFormData) => {
    const clientPayload = buildClientPayload(formData);
    clientMutations.createClient.mutate(clientPayload, {
      onSuccess: () => {
        onSuccess();
        clientForm.reset();
      },
      onError: (clientApiError: any) => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        onError(formatError(clientApiError).message.join('\n'));
      },
    });
  };

  const clientForm = useClientForm(onSubmitClient, onError, onSuccess);

  return (
    <RoleProtectedRoute allowedRoles={[Roles.Admin]}>
      <Helmet>
        <title>Create Client - Córdoba Music Group</title>
      </Helmet>
      <CustomPageHeader background={'linear-gradient(58deg, rgba(0,124,233,1) 0%, rgba(0,79,131,1) 85%)'} color={theme.palette.primary.contrastText}>
        <Typography sx={{ flexGrow: 1, fontSize: '18px' }}>Creating New Client</Typography>
        <BackPageButton colorBackground="white" colorText={theme.palette.secondary.main} />
        <BasicButton
          colorBackground="white"
          colorText={theme.palette.secondary.main}
          onClick={clientForm.handleClientFormSubmit}
          color="primary"
          variant="contained"
          disabled={clientOperationsLoading.createClient}
          startIcon={<AddOutlinedIcon />}
          loading={clientOperationsLoading.createClient}
        >
          Create Client
        </BasicButton>
      </CustomPageHeader>
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Box>
            {clientNotification?.type === 'success' && <SuccessBox>{clientNotification.message}</SuccessBox>}
            {clientNotification?.type === 'error' && <ErrorBox>{clientNotification.message}</ErrorBox>}
          </Box>

          <FormProvider {...clientForm}>
            <ClientFormLayout handleSubmit={clientForm.handleClientFormSubmit} onChange={clientForm.handleInputChange} />
          </FormProvider>
          <ValidationErrorModal open={clientForm.isValidationErrorModalOpen} onClose={() => clientForm.setIsValidationErrorModalOpen(false)} errors={clientForm.formState.errors} />
        </Box>
      </Paper>
    </RoleProtectedRoute>
  );
};

export default CreateClientPage;
