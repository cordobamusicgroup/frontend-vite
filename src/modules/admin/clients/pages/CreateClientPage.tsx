import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ClientDetailsForm from '../components/molecules/ClientDetailsForm';
import AddressDetailsForm from '../components/molecules/AddressDetailsForm';
import ContractDetailsForm from '../components/molecules/ContractDetailsForm';
import DmbDetailsForm from '../components/molecules/DmbDetailsForm';
import { useClientForm, ClientFormData } from '../hooks/useClientForm';
import { Box, Typography, useTheme } from '@mui/material';
import { FormProvider } from 'react-hook-form';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import PersonIcon from '@mui/icons-material/Person';
import HomeIcon from '@mui/icons-material/Home';
import DescriptionIcon from '@mui/icons-material/Description';
import DnsIcon from '@mui/icons-material/Dns';
import BasicButton from '@/components/ui/atoms/BasicButton';
import { useNotificationStore } from '@/stores';
import CustomPageHeader from '@/components/ui/molecules/CustomPageHeader';
import { Helmet } from 'react-helmet';
import { useClientsAdmin } from '../hooks/useClientsAdmin';
import FormValidationErrorModal from '../../../../components/ui/organisms/FormValidationErrorModal';
import BackPageButton from '@/components/ui/atoms/BackPageButton';
import { formatError } from '@/lib/formatApiError.util';
import { buildClientPayload } from '../utils/buildClientPayload.util';
import { Roles } from '@/constants/roles';
import RoleProtectedRoute from '@/routes/RoleProtectedRoute';
import NotificationBox from '@/components/ui/molecules/NotificationBox';

const CreateClientPage: React.FC = () => {
  const theme = useTheme();
  const { mutations: clientMutations, loading: clientOperationsLoading } = useClientsAdmin();
  const { setNotification: setClientNotification, clearNotification: clearClientNotification } = useNotificationStore();

  const clientForm = useClientForm(async (formData: ClientFormData) => {
    const clientPayload = buildClientPayload(formData);
    clientMutations.createClient.mutate(clientPayload, {
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
            disabled={clientOperationsLoading.createClient}
            startIcon={<AddOutlinedIcon />}
            loading={clientOperationsLoading.createClient}
          >
            Create Client
          </BasicButton>
        </CustomPageHeader>
        <NotificationBox />
        <FormProvider {...clientForm}>
          <form onChange={clientForm.handleInputChange} onSubmit={clientForm.handleClientFormSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: 500 }}>
              <Accordion defaultExpanded={true} sx={{ width: '100%' }}>
                <AccordionSummary expandIcon={<AddOutlinedIcon />}>
                  <Box display="flex" alignItems="center">
                    <PersonIcon sx={{ color: 'primary.main' }} />
                    <Typography variant="subtitle1" sx={{ fontSize: '16px', ml: 1 }}>
                      Personal Details
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 1 }}>
                  <ClientDetailsForm />
                </AccordionDetails>
              </Accordion>
              <Accordion defaultExpanded={false} sx={{ width: '100%' }}>
                <AccordionSummary expandIcon={<AddOutlinedIcon />}>
                  <Box display="flex" alignItems="center">
                    <HomeIcon sx={{ color: 'primary.main' }} />
                    <Typography variant="subtitle1" sx={{ fontSize: '16px', ml: 1 }}>
                      Address
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 1 }}>
                  <AddressDetailsForm />
                </AccordionDetails>
              </Accordion>
              <Accordion defaultExpanded={false} sx={{ width: '100%' }}>
                <AccordionSummary expandIcon={<AddOutlinedIcon />}>
                  <Box display="flex" alignItems="center">
                    <DescriptionIcon sx={{ color: 'secondary.main' }} />
                    <Typography variant="subtitle1" sx={{ fontSize: '16px', ml: 1 }}>
                      Contract Details
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 1 }}>
                  <ContractDetailsForm />
                </AccordionDetails>
              </Accordion>
              <Accordion defaultExpanded={false} sx={{ width: '100%' }}>
                <AccordionSummary expandIcon={<AddOutlinedIcon />}>
                  <Box display="flex" alignItems="center">
                    <DnsIcon sx={{ color: 'secondary.main' }} />
                    <Typography variant="subtitle1" sx={{ fontSize: '16px', ml: 1 }}>
                      DMB Data
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 1 }}>
                  <DmbDetailsForm />
                </AccordionDetails>
              </Accordion>
            </Box>
            <FormValidationErrorModal open={clientForm.isValidationErrorModalOpen} onClose={() => clientForm.setIsValidationErrorModalOpen(false)} errors={clientForm.formState.errors} />
          </form>
        </FormProvider>
      </Box>
    </RoleProtectedRoute>
  );
};

export default CreateClientPage;
