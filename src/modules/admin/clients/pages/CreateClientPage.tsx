import { useClientForm, ClientFormData } from '../hooks/useClientForm';
import { Box, Typography, useTheme } from '@mui/material';
import { FormProvider } from 'react-hook-form';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import BasicButton from '@/components/ui/atoms/BasicButton';
import { useNotificationStore } from '@/stores';
import CustomPageHeader from '@/components/ui/molecules/CustomPageHeader';
import { Helmet } from 'react-helmet';
// Reemplazado hook combinado por hooks individuales
import { useCreateClientMutation } from '../hooks/useCreateClientMutation';
import FormValidationErrorModal from '../../../../components/ui/organisms/FormValidationErrorModal';
import BackPageButton from '@/components/ui/atoms/BackPageButton';
import { formatError } from '@/lib/formatApiError.util';
import { buildClientPayload } from '../utils/buildClientPayload.util';
import { Roles } from '@/constants/roles';
import RoleProtectedRoute from '@/routes/RoleProtectedRoute';
import NotificationBox from '@/components/ui/molecules/NotificationBox';
import ClientFormLayout from '../components/organisms/ClientFormLayout';

const CreateClientPage: React.FC = () => {
  const theme = useTheme();
  const createClientMutation = useCreateClientMutation();
  const { setNotification: setClientNotification, clearNotification: clearClientNotification } = useNotificationStore();

  const clientForm = useClientForm(async (formData: ClientFormData) => {
    const clientPayload = buildClientPayload(formData);
    createClientMutation.mutate(clientPayload, {
      onSuccess: () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setClientNotification({ message: 'Client created successfully', type: 'success' });
        clientForm.reset();
      },
      onError: (clientApiError: any) => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        const msg = formatError(clientApiError).message.join('\n');
        if (msg) setClientNotification({ message: msg, type: 'error' });
        else clearClientNotification();
      },
    });
  });

  return (
    <RoleProtectedRoute allowedRoles={[Roles.Admin]}>
      <Helmet>
        <title>Create Client - Córdoba Music Group</title>
      </Helmet>
      <Box p={3} sx={{ display: 'flex', flexDirection: 'column' }}>
        <CustomPageHeader background={'linear-gradient(58deg, rgba(0,124,233,1) 0%, rgba(0,79,131,1) 85%)'} color={theme.palette.primary.contrastText}>
          <Typography sx={{ flexGrow: 1, fontSize: '18px' }}>Creating New Client</Typography>
          <BackPageButton colorBackground="white" colorText={theme.palette.secondary.main} />
          <BasicButton
            colorBackground="white"
            colorText={theme.palette.secondary.main}
            onClick={clientForm.handleClientFormSubmit}
            color="primary"
            variant="contained"
            disabled={createClientMutation.isPending}
            startIcon={<AddOutlinedIcon />}
            loading={createClientMutation.isPending}
          >
            Create Client
          </BasicButton>
        </CustomPageHeader>
        <NotificationBox />
        <FormProvider {...clientForm}>
          <form onChange={clientForm.handleInputChange} onSubmit={clientForm.handleClientFormSubmit}>
            <ClientFormLayout />
            <FormValidationErrorModal open={clientForm.isValidationErrorModalOpen} onClose={() => clientForm.setIsValidationErrorModalOpen(false)} errors={clientForm.formState.errors} />
          </form>
        </FormProvider>
      </Box>
    </RoleProtectedRoute>
  );
};

export default CreateClientPage;
