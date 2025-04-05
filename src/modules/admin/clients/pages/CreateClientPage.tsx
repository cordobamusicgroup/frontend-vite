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
  const { createClient, createClientLoading } = useClientsAdmin();
  const { notification, setNotification, clearNotification } = useNotificationStore();
  const [errorOpen, setErrorOpen] = useState(false);

  useNotificationCleanup();

  const methods = useForm<ClientFormData>({
    mode: 'all',
    resolver: zodResolver(ClientValidationSchema),
  });

  const {
    handleSubmit,
    formState: { errors },
    reset,
  } = methods;

  const onSubmit: SubmitHandler<ClientFormData> = async (formData) => {
    const { client, contract, address, dmb } = formData;
    const payload = {
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
    createClient.mutate(payload, {
      onSuccess: () => {
        scrollToTop();
        setNotification({ message: 'Client created successfully', type: 'success' });
        reset(); // Reset the form after successful submission
      },
      onError: (error: FormattedApiError) => {
        scrollToTop();
        setNotification({
          message: error.messages,
          type: 'error',
        });
      },
    });
    console.log('Create Client Form Submitted:', payload);
  };

  const handleClientSubmit = handleSubmit(
    (data) => {
      console.log('Form data:', data); // Muestra los datos del formulario en la consola
      onSubmit(data); // Llama a la función onSubmit si no hay errores
    },
    (errors) => {
      if (Object.keys(errors).length > 0) {
        setErrorOpen(true); // Abre el popup si hay errores
      }
    },
  );

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleInputChange = () => clearNotification();

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
            onClick={handleClientSubmit}
            color="primary"
            variant="contained"
            disabled={createClientLoading}
            startIcon={<AddOutlinedIcon />}
            loading={createClientLoading}
          >
            Create Client
          </BasicButton>
        </CustomPageHeader>

        <Box>
          {notification?.type === 'success' && <SuccessBox>{notification.message}</SuccessBox>}
          {notification?.type === 'error' && <ErrorBox>{notification.message}</ErrorBox>}
        </Box>

        <FormProvider {...methods}>
          <ClientFormLayout handleSubmit={handleClientSubmit} onChange={handleInputChange} />
        </FormProvider>
        <ErrorModal2 open={errorOpen} onClose={() => setErrorOpen(false)}>
          <List sx={{ padding: 0, margin: 0 }}>
            {getErrorMessages(errors).map((msg, index) => (
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
