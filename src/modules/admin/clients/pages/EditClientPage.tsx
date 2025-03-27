import { useEffect, useState } from 'react';
import { Box, CircularProgress, List, ListItem, ListItemText, TextField, Typography, useTheme } from '@mui/material';
import { AddOutlined, PersonAdd } from '@mui/icons-material';
import theme from '@/theme';
import { useNavigate, useParams } from 'react-router';
import webRoutes from '@/lib/web.routes';
import BasicButton from '@/components/ui/atoms/BasicButton';
import ErrorBox from '@/components/ui/molecules/ErrorBox';
import SuccessBox from '@/components/ui/molecules/SuccessBox';
import ListClientsTable from '../components/organisms/ListClientsTable';
import { useErrorStore, useNotificationStore } from '@/stores';
import CustomPageHeader from '@/components/ui/molecules/CustomPageHeader';
import { useNotificationCleanup } from '@/hooks/useNotificationCleanup';
import { Helmet } from 'react-helmet';
import { useClients } from '../hooks/useClientsAdmin';
import { FormProvider, useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ClientValidationSchema } from '../schemas/ClientValidationSchema';
import axios from 'axios';
import ErrorModal2 from '@/components/ui/molecules/ErrorModal2';
import BackPageButton from '@/components/ui/atoms/BackPageButton';
import ClientFormLayout from '../components/organisms/ClientFormLayout';
import { access } from 'fs';
import dayjs from 'dayjs';

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
  const navigate = useNavigate();
  const { client, updateClient, isFetching, isMutationPending, fetchError } = useClients(clientId);
  const { notification, setNotification, clearNotification } = useNotificationStore();
  const [errorOpen, setErrorOpen] = useState(false);

  // Estado para guardar los datos originales para comparación
  const [originalData, setOriginalData] = useState<any>(null);

  useNotificationCleanup();

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

  // Nuevo efecto para manejar errores en la carga inicial
  useEffect(() => {
    if (fetchError) {
      setNotification({ message: fetchError || 'Error loading client data', type: 'error' });
    }
  }, [fetchError, setNotification]);

  useEffect(() => {
    if (client) {
      const apiData: IFormData = {
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

      // Establecer los valores en el formulario
      reset(apiData);

      // Guardar los datos originales para referencia
      setOriginalData(apiData);
    }
  }, [client, reset]);

  const onSubmit: SubmitHandler<IFormData> = async (formData) => {
    const mappedData = {
      clientName: formData.client.clientName,
      firstName: formData.client.firstName,
      lastName: formData.client.lastName,
      type: formData.client.type,
      taxIdType: formData.client.taxIdType,
      taxId: formData.client.taxId,
      vatRegistered: formData.client.vatRegistered,
      vatId: formData.client.vatId,
      address: {
        street: formData.address.street,
        city: formData.address.city,
        state: formData.address.state,
        countryId: formData.address.countryId,
        zip: formData.address.zip,
      },
      contract: {
        type: formData.contract.type,
        status: formData.contract.status,
        startDate: formData.contract.startDate,
        endDate: formData.contract.endDate,
        signed: formData.contract.signed,
        signedBy: formData.contract.signedBy,
        signedAt: formData.contract.signedAt,
        ppd: formData.contract.ppd,
        docUrl: formData.contract.docUrl,
      },
      dmb: {
        accessType: formData.dmb.accessType,
        status: formData.dmb.status,
        subclientName: formData.dmb.subclientName,
        username: formData.dmb.username,
      },
    };
    updateClient.mutate(mappedData, {
      onSuccess: () => {
        setNotification({ message: 'Client updated successfully', type: 'success' });
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
        <CustomPageHeader
          background={'linear-gradient(58deg, rgba(0,124,233,1) 0%, rgba(0,79,131,1) 85%)'}
          color={theme.palette.primary.contrastText}
        >
          <Typography sx={{ flexGrow: 1, fontSize: '18px' }}>Update Client: ID {client?.id}</Typography>
          <BackPageButton colorBackground="white" colorText={theme.palette.secondary.main} />
          <BasicButton
            colorBackground="white"
            colorText={theme.palette.secondary.main}
            onClick={handleClientSubmit}
            color="primary"
            variant="contained"
            startIcon={<AddOutlined />}
            loading={isMutationPending}
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
