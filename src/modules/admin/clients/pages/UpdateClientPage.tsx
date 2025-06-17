import { useEffect, useState, useMemo } from 'react';
import { Box, List, ListItem, ListItemText, Paper, Typography, useTheme, Table, TableHead, TableRow, TableCell, TableBody, Button, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { useParams, useNavigate } from 'react-router';
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
import { buildClientPayload } from '../utils/buildClientPayload.util';
import webRoutes from '@/lib/web.routes';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import GroupIcon from '@mui/icons-material/Group';
import PersonIcon from '@mui/icons-material/Person';

type ClientFormData = z.infer<typeof ClientValidationSchema>;

const getModifiedFields = (currentFormData: any, initialData: any) => {
  return Object.keys(currentFormData).reduce((changedFields: any, key) => {
    if (currentFormData[key] !== initialData[key]) {
      changedFields[key] = currentFormData[key];
    }
    return changedFields;
  }, {});
};

const AccordionTitle = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
  <Box display="flex" alignItems="center">
    {icon}
    <Typography variant="subtitle1" sx={{ fontSize: '16px', ml: 1 }}>
      {text}
    </Typography>
  </Box>
);

function BalancesBlock({ balances }: { balances: any[] }) {
  const usd = balances?.find((b: any) => b.currency === 'USD') || {};
  const eur = balances?.find((b: any) => b.currency === 'EUR') || {};
  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', gap: 4, alignItems: 'center', mb: 1 }}>
      <Box>
        <Typography variant="subtitle2" color="text.secondary">
          USD
        </Typography>
        <Typography variant="h6">$ {Number(usd.amount ?? 0).toFixed(2)}</Typography>
        <Typography variant="body2" color="text.secondary">
          Retained: $ {Number(usd.retained ?? 0).toFixed(2)}
        </Typography>
      </Box>
      <Box>
        <Typography variant="subtitle2" color="text.secondary">
          EUR
        </Typography>
        <Typography variant="h6">€ {Number(eur.amount ?? 0).toFixed(2)}</Typography>
        <Typography variant="body2" color="text.secondary">
          Retained: € {Number(eur.retained ?? 0).toFixed(2)}
        </Typography>
      </Box>
    </Box>
  );
}

function UsersTable({ users, onEdit }: { users: any[]; onEdit: (id: number) => void }) {
  return (
    <Table size="small" sx={{ minWidth: 300, borderCollapse: 'separate', borderSpacing: 0 }}>
      <TableHead>
        <TableRow>
          <TableCell sx={{ fontWeight: 'bold', borderBottom: '2px solid #e0e0e0' }}>Username</TableCell>
          <TableCell sx={{ fontWeight: 'bold', borderBottom: '2px solid #e0e0e0' }}>Email</TableCell>
          <TableCell sx={{ fontWeight: 'bold', borderBottom: '2px solid #e0e0e0' }}>Full Name</TableCell>
          <TableCell sx={{ fontWeight: 'bold', borderBottom: '2px solid #e0e0e0' }}>Role</TableCell>
          <TableCell align="center" sx={{ fontWeight: 'bold', borderBottom: '2px solid #e0e0e0' }}>
            Actions
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {users.map((user: any, idx: number) => (
          <TableRow key={user.id} sx={{ backgroundColor: idx % 2 === 0 ? '#fafbfc' : 'white' }}>
            <TableCell>{user.username}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.fullName}</TableCell>
            <TableCell>{user.role}</TableCell>
            <TableCell align="center">
              <Button variant="outlined" size="small" onClick={() => onEdit(user.id)} sx={{ minWidth: 80 }}>
                Edit
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

const UpdateClientPage: React.FC = () => {
  const theme = useTheme();
  const { clientId } = useParams();
  const navigate = useNavigate();
  const { clientsData: clientData, mutations: clientMutations, loading: clientOperationsLoading, errors: clientApiErrors } = useClientsAdmin(clientId);
  const { notification: clientNotification, setNotification: setClientNotification, clearNotification: clearClientNotification } = useNotificationStore();
  const [isValidationErrorModalOpen, setIsValidationErrorModalOpen] = useState(false);

  // Store the initial data for comparison
  const [initialClientData, setInitialClientData] = useState<ClientFormData | null>(null);

  const clientFormMethods = useForm<ClientFormData>({
    mode: 'onSubmit',
    resolver: zodResolver(ClientValidationSchema),
    reValidateMode: 'onChange',
  });

  const {
    handleSubmit,
    formState: { errors: clientFormErrors },
    reset: resetClientForm,
  } = clientFormMethods;

  const formattedClientData = useMemo(() => {
    if (!clientData) return null;

    return {
      client: {
        clientId: clientData.id,
        clientName: clientData.clientName,
        firstName: clientData.firstName,
        lastName: clientData.lastName,
        type: clientData.type,
        taxIdType: clientData.taxIdType,
        taxId: clientData.taxId,
        vatRegistered: clientData.vatRegistered,
        vatId: clientData.vatId,
      },
      address: {
        street: clientData.address?.street,
        city: clientData.address?.city,
        state: clientData.address?.state,
        countryId: clientData.address?.countryId,
        zip: clientData.address?.zip,
      },
      contract: {
        uuid: clientData.contract.uuid,
        type: clientData.contract.type,
        status: clientData.contract.status,
        startDate: dayjs(clientData.contract.startDate),
        endDate: clientData.contract.endDate ? dayjs(clientData.contract.endDate) : undefined,
        signedBy: clientData.contract.signedBy,
        signedAt: clientData.contract.signedAt ? dayjs(clientData.contract.signedAt) : undefined,
        ppd: parseFloat(clientData.contract.ppd),
        docUrl: clientData.contract.docUrl,
      },
      dmb: {
        accessType: clientData.dmb?.accessType,
        status: clientData.dmb?.status,
        subclientName: clientData.dmb?.subclientName,
        username: clientData.dmb?.username,
      },
    };
  }, [clientData]);

  useEffect(() => {
    if (formattedClientData) {
      resetClientForm(formattedClientData);
      setInitialClientData(formattedClientData);
    }
  }, [formattedClientData, resetClientForm]);

  if (clientApiErrors.clientFetch) {
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
            {clientApiErrors.clientFetch.message || 'Failed to load client data.'}
          </Typography>
        </Paper>
      </Box>
    );
  }

  if (!clientData) {
    return <SkeletonLoader />;
  }

  const onSubmitClientUpdate: SubmitHandler<ClientFormData> = async (formData) => {
    if (!initialClientData) return;
    const modifiedFields = getModifiedFields(formData, initialClientData);
    const clientUpdatePayload = buildClientPayload(modifiedFields);
    clientMutations.updateClient.mutate(clientUpdatePayload, {
      onSuccess: () => {
        setClientNotification({ message: 'Client updated successfully', type: 'success' });
        scrollToTop();
      },
      onError: (error: any) => {
        setClientNotification({
          message: error.messages,
          type: 'error',
        });
        scrollToTop();
      },
    });
  };

  const handleClientFormSubmit = handleSubmit(
    (data) => {
      onSubmitClientUpdate(data); // Llama a la función onSubmit si no hay errores
    },
    (errors) => {
      if (Object.keys(errors).length > 0) {
        setIsValidationErrorModalOpen(true); // Abre el popup si hay errores
      }
    },
  );

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleInputChange = () => clearClientNotification();

  const getErrorMessages = (errors: any): string[] => {
    const messages: string[] = [];
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
        <title>{`Update Client: ${clientData?.clientName ?? 'Unknown'} - Córdoba Music Group`}</title>
      </Helmet>
      <Box p={3} sx={{ display: 'flex', flexDirection: 'column' }}>
        <CustomPageHeader background={'linear-gradient(58deg, rgba(0,124,233,1) 0%, rgba(0,79,131,1) 85%)'} color={theme.palette.primary.contrastText}>
          <Typography sx={{ flexGrow: 1, fontSize: '18px' }}>Update Client: ID {clientData?.id}</Typography>
          <BackPageButton colorBackground="white" colorText={theme.palette.secondary.main} />
          <BasicButton
            colorBackground="white"
            colorText={theme.palette.secondary.main}
            onClick={handleClientFormSubmit}
            color="primary"
            variant="contained"
            startIcon={<AddOutlinedIcon />}
            loading={clientOperationsLoading.updateClient}
          >
            Update Client
          </BasicButton>
        </CustomPageHeader>

        <Box>
          {clientNotification?.type === 'success' && <SuccessBox>{clientNotification.message}</SuccessBox>}
          {clientNotification?.type === 'error' && <ErrorBox>{clientNotification.message}</ErrorBox>}
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: 500 }}>
          <Accordion defaultExpanded={false} sx={{ width: '100%' }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <AccordionTitle icon={<PersonIcon sx={{ color: 'primary.main' }} />} text="Client Form" />
            </AccordionSummary>
            <AccordionDetails sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 1 }}>
              <FormProvider {...clientFormMethods}>
                <ClientFormLayout handleSubmit={handleClientFormSubmit} onChange={handleInputChange} />
              </FormProvider>
            </AccordionDetails>
          </Accordion>
          <Accordion defaultExpanded={false} sx={{ width: '100%' }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <AccordionTitle icon={<AttachMoneyIcon sx={{ color: 'secondary.main' }} />} text="Balances" />
            </AccordionSummary>
            <AccordionDetails sx={{ bgcolor: 'background.paper', borderRadius: 1 }}>
              <BalancesBlock balances={clientData.balances} />
            </AccordionDetails>
          </Accordion>
          {Array.isArray(clientData.users) && clientData.users.length > 0 && (
            <Accordion defaultExpanded={false} sx={{ width: '100%' }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <AccordionTitle icon={<GroupIcon sx={{ color: 'primary.main' }} />} text="Users" />
              </AccordionSummary>
              <AccordionDetails sx={{ bgcolor: 'background.paper', borderRadius: 1 }}>
                <UsersTable users={clientData.users} onEdit={(id) => navigate(`${webRoutes.admin.users.edit}/${id}`)} />
              </AccordionDetails>
            </Accordion>
          )}
        </Box>

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

export default UpdateClientPage;
