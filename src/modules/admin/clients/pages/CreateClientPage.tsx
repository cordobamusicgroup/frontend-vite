import { useState } from 'react';
import { Box, List, ListItem, ListItemText, Typography, useTheme, Paper } from '@mui/material';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import BasicButton from '@/components/ui/atoms/BasicButton';
import ErrorBox from '@/components/ui/molecules/ErrorBox';
import SuccessBox from '@/components/ui/molecules/SuccessBox';
import { useNotificationStore } from '@/stores';
import CustomPageHeader from '@/components/ui/molecules/CustomPageHeader';
import { Helmet } from 'react-helmet';
import { useClientsAdmin } from '../hooks/useClientsAdmin';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ClientValidationYupSchema } from '../schemas/ClientValidationYupSchema';
import ErrorModal2 from '@/components/ui/molecules/ErrorModal2';
import BackPageButton from '@/components/ui/atoms/BackPageButton';
import ClientFormLayout from '../components/organisms/ClientFormLayout';
import { formatError } from '@/lib/formatApiError.util';
import { buildClientPayload } from '../utils/buildClientPayload.util';
import { extractValidationMessages } from '../utils/extractValidationMessages';

import { Roles } from '@/constants/roles';
import RoleProtectedRoute from '@/routes/RoleProtectedRoute';

const CreateClientPage: React.FC = () => {
  const theme = useTheme();
  const { mutations: clientMutations, loading: clientOperationsLoading } = useClientsAdmin();
  const { notification: clientNotification, setNotification: setClientNotification, clearNotification: clearClientNotification } = useNotificationStore();
  const [isValidationErrorModalOpen, setIsValidationErrorModalOpen] = useState(false);

  const clientFormMethods = useForm({
    mode: 'all',
    resolver: yupResolver(ClientValidationYupSchema),
  });

  const {
    handleSubmit,
    formState: { errors: clientFormErrors },
    reset: resetClientForm,
  } = clientFormMethods;

  const onSubmitClient = async (formData: any) => {
    const clientPayload = buildClientPayload(formData);
    clientMutations.createClient.mutate(clientPayload, {
      onSuccess: () => {
        scrollToPageTop();
        setClientNotification({ message: 'Client created successfully', type: 'success' });
        resetClientForm(); // Reset the form after successful submission
      },
      onError: (clientApiError: any) => {
        scrollToPageTop();
        setClientNotification({
          message: formatError(clientApiError).message.join('\n'),
          type: 'error',
        });
      },
    });
  };

  const handleClientFormSubmit = handleSubmit(
    (clientFormData) => {
      onSubmitClient(clientFormData);
    },
    (validationErrors) => {
      if (Object.keys(validationErrors).length > 0) {
        // Log para debug: estructura real de los errores
        // eslint-disable-next-line no-console
        console.log('clientFormErrors', validationErrors);
        setIsValidationErrorModalOpen(true);
      }
    },
  );

  const scrollToPageTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleInputChange = () => clearClientNotification();

  // Ahora importado desde utils/extractValidationMessages

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
          onClick={handleClientFormSubmit}
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

          <FormProvider {...clientFormMethods}>
            <ClientFormLayout handleSubmit={handleClientFormSubmit} onChange={handleInputChange} />
          </FormProvider>
          <ErrorModal2 open={isValidationErrorModalOpen} onClose={() => setIsValidationErrorModalOpen(false)}>
            <List sx={{ padding: 0, margin: 0 }}>
              {extractValidationMessages(clientFormErrors).map((msg, index) => (
                <ListItem key={index} disableGutters sx={{ padding: '1px 0' }}>
                  <ListItemText primary={`• ${msg}`} sx={{ margin: 0, padding: 0 }} />
                </ListItem>
              ))}
            </List>
          </ErrorModal2>
        </Box>
      </Paper>
    </RoleProtectedRoute>
  );
};

export default CreateClientPage;
