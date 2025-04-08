import { useEffect, useState, useMemo } from 'react';
import { Box, List, ListItem, ListItemText, Paper, Typography, useTheme } from '@mui/material';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { useParams } from 'react-router';
import BasicButton from '@/components/ui/atoms/BasicButton';
import ErrorBox from '@/components/ui/molecules/ErrorBox';
import SuccessBox from '@/components/ui/molecules/SuccessBox';
import { useNotificationStore } from '@/stores';
import CustomPageHeader from '@/components/ui/molecules/CustomPageHeader';
import { Helmet } from 'react-helmet';
import { useClientsAdmin } from '../hooks/useClientsAdmin';
import { FormProvider, useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ClientValidationSchema } from '../schemas/ClientValidationSchema';
import ErrorModal2 from '@/components/ui/molecules/ErrorModal2';
import BackPageButton from '@/components/ui/atoms/BackPageButton';
import ClientFormLayout from '../components/organisms/ClientFormLayout';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import dayjs from 'dayjs';
import SkeletonLoader from '@/components/ui/molecules/SkeletonLoader';

type IFormData = z.infer<typeof ClientValidationSchema>;

const getUpdatedFields = (formData: any, originalData: any) => {
  return Object.keys(formData).reduce((acc: any, key) => {
    if (formData[key] !== originalData[key]) {
      acc[key] = formData[key];
    }
    return acc;
  }, {});
};

const UpdateClientPage: React.FC = () => {
  const theme = useTheme();
  const { clientId } = useParams();
  const { clientsData: client, updateClient, updateClientLoading, clientFetchError } = useClientsAdmin(clientId);
  const { notification, setNotification, clearNotification } = useNotificationStore();
  const [errorOpen, setErrorOpen] = useState(false);

  // Reintroduce originalData state
  const [originalData, setOriginalData] = useState<IFormData | null>(null);

  const methods = useForm<IFormData>({
    mode: 'onSubmit',
    resolver: zodResolver(ClientValidationSchema),
    reValidateMode: 'onChange',
  });

  const {
    handleSubmit,
    formState: { errors },
    reset,
  } = methods;

  const apiData = useMemo(() => {
    if (!client) return null;

    return {
      client: {
        clientId: client.id,
        clientName: client.clientName,
        firstName: client.firstName,
        lastName: client.lastName,
        type: client.type,
        taxIdType: client.taxIdType,
        taxId: client.taxId,
        vatRegistered: client.vatRegistered,
        vatId: client.vatId,
      },
      address: {
        street: client.address?.street,
        city: client.address?.city,
        state: client.address?.state,
        countryId: client.address?.countryId,
        zip: client.address?.zip,
      },
      contract: {
        uuid: client.contract.uuid,
        type: client.contract.type,
        status: client.contract.status,
        startDate: dayjs(client.contract.startDate),
        endDate: dayjs(client.contract.endDate),
        signedBy: client.contract.signedBy,
        signedAt: dayjs(client.contract.signedAt),
        ppd: parseFloat(client.contract.ppd),
        docUrl: client.contract.docUrl,
      },
      dmb: {
        accessType: client.dmb?.accessType,
        status: client.dmb?.status,
        subclientName: client.dmb?.subclientName,
        username: client.dmb?.username,
      },
    };
  }, [client]);

  useEffect(() => {
    if (apiData) {
      reset(apiData); // Reset form data unconditionally when apiData changes
      setOriginalData(apiData); // Store the original data for comparison
    }
  }, [apiData, reset]);

  if (clientFetchError) {
    return (
      <Box
        sx={{
          width: '100%',
          mx: 'auto',
          mt: 1,
          textAlign: 'center',
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: 5,
            borderRadius: 3,
            backgroundColor: (theme) => (theme.palette.mode === 'light' ? 'rgba(244, 67, 54, 0.05)' : 'rgba(244, 67, 54, 0.1)'),
          }}
        >
          <ErrorOutlineIcon sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />

          <Typography variant="h5" color="error.main" gutterBottom>
            Oops! Something went wrong
          </Typography>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {clientFetchError.message || 'Failed to load client data.'}
          </Typography>
        </Paper>
      </Box>
    );
  }

  if (!client) {
    return <SkeletonLoader />;
  }

  const onSubmit: SubmitHandler<IFormData> = async (formData) => {
    if (!originalData) return; // Ensure originalData is available

    const updatedFields = getUpdatedFields(formData, originalData);

    const mappedData = {
      clientName: updatedFields.client.clientName,
      firstName: updatedFields.client.firstName,
      lastName: updatedFields.client.lastName,
      type: updatedFields.client.type,
      taxIdType: updatedFields.client.taxIdType,
      taxId: updatedFields.client.taxId,
      vatRegistered: updatedFields.client.vatRegistered,
      vatId: updatedFields.client.vatId,
      address: {
        street: updatedFields.address.street,
        city: updatedFields.address.city,
        state: updatedFields.address.state,
        countryId: updatedFields.address.countryId,
        zip: updatedFields.address.zip,
      },
      contract: {
        type: updatedFields.contract.type,
        status: updatedFields.contract.status,
        startDate: updatedFields.contract.startDate,
        endDate: updatedFields.contract.endDate,
        signed: updatedFields.contract.signed,
        signedBy: updatedFields.contract.signedBy,
        signedAt: updatedFields.contract.signedAt,
        ppd: updatedFields.contract.ppd,
        docUrl: updatedFields.contract.docUrl,
      },
      dmb: {
        accessType: updatedFields.dmb.accessType,
        status: updatedFields.dmb.status,
        subclientName: updatedFields.dmb.subclientName,
        username: updatedFields.dmb.username,
      },
    };
    updateClient.mutate(mappedData, {
      onSuccess: () => {
        setNotification({ message: 'Client updated successfully', type: 'success' });
        scrollToTop();
      },
      onError: (error: any) => {
        setNotification({
          message: error.messages,
          type: 'error',
        });
        scrollToTop();
      },
    });
  };

  const handleClientSubmit = handleSubmit(
    (data) => {
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
        <title>{`Update Client: ${client?.clientName ?? 'Unknown'} - Córdoba Music Group`}</title>
      </Helmet>
      <Box p={3} sx={{ display: 'flex', flexDirection: 'column' }}>
        <CustomPageHeader background={'linear-gradient(58deg, rgba(0,124,233,1) 0%, rgba(0,79,131,1) 85%)'} color={theme.palette.primary.contrastText}>
          <Typography sx={{ flexGrow: 1, fontSize: '18px' }}>Update Client: ID {client?.id}</Typography>
          <BackPageButton colorBackground="white" colorText={theme.palette.secondary.main} />
          <BasicButton
            colorBackground="white"
            colorText={theme.palette.secondary.main}
            onClick={handleClientSubmit}
            color="primary"
            variant="contained"
            startIcon={<AddOutlinedIcon />}
            loading={updateClientLoading}
          >
            Update Client
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

export default UpdateClientPage;
