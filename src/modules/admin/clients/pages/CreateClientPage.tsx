import { useState } from 'react';
import { Box, List, ListItem, ListItemText, Typography, useTheme } from '@mui/material';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import BasicButton from '@/components/ui/atoms/BasicButton';
import ErrorBox from '@/components/ui/molecules/ErrorBox';
import SuccessBox from '@/components/ui/molecules/SuccessBox';
import { useNotificationStore } from '@/stores';
import CustomPageHeader from '@/components/ui/molecules/CustomPageHeader';
import { useNotificationCleanup } from '@/hooks/useNotificationCleanup';
import { Helmet } from 'react-helmet';
import { useClientsAdmin } from '../hooks/useClientsAdmin';
import { FormProvider, useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ClientValidationSchema } from '../schemas/ClientValidationSchema';
import ErrorModal2 from '@/components/ui/molecules/ErrorModal2';
import BackPageButton from '@/components/ui/atoms/BackPageButton';
import ClientFormLayout from '../components/organisms/ClientFormLayout';
import { FormattedApiError } from '@/lib/formatApiError.util';

type ClientFormData = z.infer<typeof ClientValidationSchema>;

const CreateClientPage: React.FC = () => {
  const theme = useTheme();
  const { mutations: clientMutations, loading: clientOperationsLoading } = useClientsAdmin();
  const { notification: clientNotification, setNotification: setClientNotification, clearNotification: clearClientNotification } = useNotificationStore();
  const [isValidationErrorModalOpen, setIsValidationErrorModalOpen] = useState(false);

  useNotificationCleanup();

  const clientFormMethods = useForm<ClientFormData>({
    mode: 'all',
    resolver: zodResolver(ClientValidationSchema),
  });

  const {
    handleSubmit,
    formState: { errors: clientFormErrors },
    reset: resetClientForm,
  } = clientFormMethods;

  const onSubmitClient: SubmitHandler<ClientFormData> = async (formData) => {
    const { client, contract, address, dmb } = formData;
    const clientPayload = {
      clientName: client.clientName,
      firstName: client.firstName,
      lastName: client.lastName,
      type: client.type,
      taxIdType: client.taxIdType,
      taxId: client.taxId,
      vatRegistered: client.vatRegistered,
      vatId: client.vatId,
      address: {
        street: address.street,
        city: address.city,
        state: address.state,
        countryId: address.countryId,
        zip: address.zip,
      },
      contract: {
        type: contract.type,
        status: contract.status,
        signed: contract.signed,
        signedBy: contract.signedBy,
        signedAt: contract.signedAt,
        startDate: contract.startDate,
        endDate: contract.endDate,
        ppd: contract.ppd,
        docUrl: contract.docUrl,
      },
      dmb: {
        accessType: dmb?.accessType,
        status: dmb?.status,
        subclientName: dmb?.subclientName,
        username: dmb?.username,
      },
    };
    clientMutations.createClient.mutate(clientPayload, {
      onSuccess: () => {
        scrollToPageTop();
        setClientNotification({ message: 'Client created successfully', type: 'success' });
        resetClientForm(); // Reset the form after successful submission
      },
      onError: (clientApiError: FormattedApiError) => {
        scrollToPageTop();
        setClientNotification({
          message: clientApiError.messages,
          type: 'error',
        });
      },
    });
    console.log('Create Client Form Submitted:', clientPayload);
  };

  const handleClientFormSubmit = handleSubmit(
    (clientFormData) => {
      console.log('Form data:', clientFormData);
      onSubmitClient(clientFormData);
    },
    (validationErrors) => {
      if (Object.keys(validationErrors).length > 0) {
        setIsValidationErrorModalOpen(true);
      }
    },
  );

  const scrollToPageTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleInputChange = () => clearClientNotification();

  const getErrorMessages = (errors: any): string[] => {
    let messages: string[] = [];
    const iterate = (errObj: any) => {
      if (errObj?.message) {
        messages.push(errObj.message);
      }
      if (errObj && typeof errObj === 'object') {
        for (const key in errObj) {
          if (typeof errObj[key] === 'object') {
            iterate(errObj[key]);
          }
        }
      }
    };
    iterate(errors);
    return messages;
  };

  return (
    <>
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

        <Box>
          {clientNotification?.type === 'success' && <SuccessBox>{clientNotification.message}</SuccessBox>}
          {clientNotification?.type === 'error' && <ErrorBox>{clientNotification.message}</ErrorBox>}
        </Box>

        <FormProvider {...clientFormMethods}>
          <ClientFormLayout handleSubmit={handleClientFormSubmit} onChange={handleInputChange} />
        </FormProvider>
        <ErrorModal2 open={isValidationErrorModalOpen} onClose={() => setIsValidationErrorModalOpen(false)}>
          <List sx={{ padding: 0, margin: 0 }}>
            {getErrorMessages(clientFormErrors).map((msg, index) => (
              <ListItem key={index} disableGutters sx={{ padding: '1px 0' }}>
                <ListItemText primary={`• ${msg}`} sx={{ margin: 0, padding: 0 }} />
              </ListItem>
            ))}
          </List>
        </ErrorModal2>
      </Box>
    </>
  );
};

export default CreateClientPage;
