import { useEffect, useState, useMemo } from 'react';
import dayjs from 'dayjs';
import { Box, Paper, Typography, useTheme, Table, TableHead, TableRow, TableCell, TableBody, Button } from '@mui/material';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { useParams, useNavigate } from 'react-router';
import BasicButton from '@/components/ui/atoms/BasicButton';
import NotificationBox from '@/components/ui/molecules/NotificationBox';
import { useNotificationStore } from '@/stores';
import CustomPageHeader from '@/components/ui/molecules/CustomPageHeader';
import { Helmet } from 'react-helmet';
import { useClientsAdmin } from '../hooks/useClientsAdmin';
import { FormProvider } from 'react-hook-form';
import { useClientForm, ClientFormData } from '../hooks/useClientForm';
import FormValidationErrorModal from '../../../../components/ui/organisms/FormValidationErrorModal';
import BackPageButton from '@/components/ui/atoms/BackPageButton';
import ClientFormLayout from '../components/organisms/ClientFormLayout';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import SkeletonLoader from '@/components/ui/molecules/SkeletonLoader';
import { buildClientPayload } from '../utils/buildClientPayload.util';
import webRoutes from '@/routes/web.routes';
import FormSectionAccordion from '@/components/ui/molecules/FormSectionAccordion';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { formatError } from '@/lib/formatApiError.util';
import GroupIcon from '@mui/icons-material/Group';
import { Roles } from '@/constants/roles';
import RoleProtectedRoute from '@/routes/RoleProtectedRoute';

const getModifiedFields = (currentFormData: any, initialData: any) => {
  return Object.keys(currentFormData).reduce((changedFields: any, key) => {
    if (currentFormData[key] !== initialData[key]) {
      changedFields[key] = currentFormData[key];
    }
    return changedFields;
  }, {});
};

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
  const { setNotification: setClientNotification, clearNotification: clearClientNotification } = useNotificationStore();
  const [initialClientData, setInitialClientData] = useState<ClientFormData | null>(null);

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
        startDate: clientData.contract.startDate ? dayjs(clientData.contract.startDate).toDate() : dayjs().toDate(),
        endDate: clientData.contract.endDate ? dayjs(clientData.contract.endDate).toDate() : dayjs().toDate(),
        signedBy: clientData.contract.signedBy,
        signedAt: clientData.contract.signedAt ? dayjs(clientData.contract.signedAt).toDate() : undefined,
        ppd: clientData.contract.ppd !== undefined && clientData.contract.ppd !== null ? parseFloat(clientData.contract.ppd) : undefined,
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

  // --- HOOKS deben ir antes de cualquier return ---
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const clientForm = useClientForm(async (formData: ClientFormData) => {
    if (!initialClientData) return;
    const compareData = initialClientData;
    const modifiedFields = getModifiedFields(formData, compareData);
    const clientUpdatePayload = buildClientPayload(modifiedFields);
    clientMutations.updateClient.mutate(clientUpdatePayload, {
      onSuccess: () => {
        clearClientNotification();
        setClientNotification({ message: 'Client updated successfully', type: 'success' });
        scrollToTop();
      },
      onError: (error: any) => {
        clearClientNotification();
        const msg = formatError(error).message.join('\n');
        if (msg) setClientNotification({ message: msg, type: 'error' });
        else clearClientNotification();
        scrollToTop();
      },
    });
  });

  useEffect(() => {
    if (formattedClientData) {
      clientForm.reset(formattedClientData);
      setInitialClientData(formattedClientData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formattedClientData]);

  // --- END HOOKS ---

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

  // Ahora importado desde utils/extractValidationMessages

  return (
    <RoleProtectedRoute allowedRoles={[Roles.Admin]}>
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
            onClick={clientForm.handleClientFormSubmit}
            color="primary"
            variant="contained"
            startIcon={<AddOutlinedIcon />}
            loading={clientOperationsLoading.updateClient}
          >
            Update Client
          </BasicButton>
        </CustomPageHeader>

        <NotificationBox />

        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: 500 }}>
          <FormProvider {...clientForm}>
            <form onChange={clientForm.handleInputChange} onSubmit={clientForm.handleClientFormSubmit}>
              <ClientFormLayout />
              <FormSectionAccordion title="Balances" icon={<AttachMoneyIcon sx={{ color: 'secondary.main' }} />} defaultExpanded={false}>
                <BalancesBlock balances={clientData.balances} />
              </FormSectionAccordion>
              {Array.isArray(clientData.users) && clientData.users.length > 0 && (
                <FormSectionAccordion title="Users" icon={<GroupIcon sx={{ color: 'primary.main' }} />} defaultExpanded={false}>
                  <UsersTable users={clientData.users} onEdit={(id) => navigate(`${webRoutes.admin.users.edit}/${id}`)} />
                </FormSectionAccordion>
              )}
            </form>
          </FormProvider>
        </Box>

        <FormValidationErrorModal open={clientForm.isValidationErrorModalOpen} onClose={() => clientForm.setIsValidationErrorModalOpen(false)} errors={clientForm.formState.errors} />
      </Box>
    </RoleProtectedRoute>
  );
};

export default UpdateClientPage;
