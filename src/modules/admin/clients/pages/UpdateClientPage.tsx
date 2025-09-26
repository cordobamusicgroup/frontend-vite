import { useEffect, useState, useMemo } from 'react';
import dayjs from 'dayjs';
import { Box, Paper, Typography, useTheme } from '@mui/material';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { useParams, useNavigate } from 'react-router';
import BasicButton from '@/components/ui/atoms/BasicButton';
import NotificationBox from '@/components/ui/molecules/NotificationBox';
import { useNotificationStore } from '@/stores';
import CustomPageHeader from '@/components/ui/molecules/CustomPageHeader';
// Reemplazado hook combinado por hooks individuales
import { useClientQuery } from '../hooks/useClientQuery';
import { useUpdateClientMutation } from '../hooks/useUpdateClientMutation';
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
import PaymentInfoSection from '../components/molecules/PaymentInfoSection';
import { formatError } from '@/lib/formatApiError.util';
import GroupIcon from '@mui/icons-material/Group';
import { Roles } from '@/constants/roles';
import RoleProtectedRoute from '@/routes/RoleProtectedRoute';
import UsersGridTable from '../components/molecules/UsersGridTable';

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
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mb: 1 }}>
      <Box>
        <Typography variant="subtitle2" color="text.secondary">
          USD
        </Typography>
        <Typography variant="h6">$ {Number(usd.amount ?? 0)}</Typography>
        <Typography variant="body2" color="text.secondary">
          Retained: $ {Number(usd.retained ?? 0)}
        </Typography>
      </Box>
      <Box>
        <Typography variant="subtitle2" color="text.secondary">
          EUR
        </Typography>
        <Typography variant="h6">€ {Number(eur.amount ?? 0)}</Typography>
        <Typography variant="body2" color="text.secondary">
          Retained: € {Number(eur.retained ?? 0)}
        </Typography>
      </Box>
    </Box>
  );
}

// UsersTable removed, now using UsersGridTable

const UpdateClientPage: React.FC = () => {
  const theme = useTheme();
  const { clientId } = useParams();
  const navigate = useNavigate();
  const clientIdNumeric = clientId ? Number(clientId) : undefined;
  const clientQuery = useClientQuery(clientIdNumeric);
  const updateClientMutation = useUpdateClientMutation();
  const { setNotification: setClientNotification, clearNotification: clearClientNotification } = useNotificationStore();
  const [initialClientData, setInitialClientData] = useState<ClientFormData | null>(null);

  const formattedClientData = useMemo(() => {
    if (!clientQuery.data) return null;
    return {
      client: {
        clientId: clientQuery.data.id,
        clientName: clientQuery.data.clientName,
        firstName: clientQuery.data.firstName,
        lastName: clientQuery.data.lastName,
        type: clientQuery.data.type,
        companyName: clientQuery.data.companyName,
        taxIdType: clientQuery.data.taxIdType,
        taxId: clientQuery.data.taxId,
        vatRegistered: typeof clientQuery.data.vatRegistered === 'boolean' ? clientQuery.data.vatRegistered : false,
        vatId: clientQuery.data.vatId,
      },
      address: {
        street: clientQuery.data.address?.street,
        city: clientQuery.data.address?.city,
        state: clientQuery.data.address?.state,
        countryId: clientQuery.data.address?.countryId,
        zip: clientQuery.data.address?.zip,
      },
      contract: (() => {
        const contract = Array.isArray(clientQuery.data.contract) ? clientQuery.data.contract[0] : clientQuery.data.contract;
        return {
          uuid: contract?.uuid ?? '',
          type: contract?.type ?? '',
          status: contract?.status ?? '',
          startDate: contract?.startDate ? dayjs(contract.startDate).toDate() : dayjs().toDate(),
          endDate: contract?.endDate ? dayjs(contract.endDate).toDate() : dayjs().toDate(),
          signedBy: contract?.signedBy ?? '',
          signedAt: contract?.signedAt ? dayjs(contract.signedAt).toDate() : undefined,
          ppd: contract?.ppd !== undefined && contract?.ppd !== null ? parseFloat(contract.ppd) : undefined,
          docUrl: contract?.docUrl ?? '',
        };
      })(),
      dmb: {
        accessType: clientQuery.data.dmb?.accessType,
        status: clientQuery.data.dmb?.status,
        subclientName: clientQuery.data.dmb?.subclientName,
        username: clientQuery.data.dmb?.username,
      },
    };
  }, [clientQuery.data]);

  // --- HOOKS deben ir antes de cualquier return ---
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const clientForm = useClientForm(async (formData: ClientFormData) => {
    if (!initialClientData) return;

    if (!clientIdNumeric) {
      setClientNotification({ message: 'Client ID is missing. Cannot update.', type: 'error' });
      return;
    }

    const compareData = initialClientData;
    const modifiedFields = getModifiedFields(formData, compareData);
    const clientUpdatePayload = buildClientPayload(modifiedFields);

    if (Object.keys(clientUpdatePayload).length === 0) {
      setClientNotification({ message: 'No changes detected to update.', type: 'info' });
      return;
    }

    updateClientMutation.mutate(
      { clientId: clientIdNumeric, data: clientUpdatePayload },
      {
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
      },
    );
  });

  useEffect(() => {
    if (formattedClientData && !initialClientData) {
      clientForm.reset(formattedClientData);
      setInitialClientData(formattedClientData);
    }
  }, [formattedClientData, initialClientData, clientForm]);

  // --- END HOOKS ---

  if (clientQuery.error) {
    return (
      <Box
        sx={{
          width: '100%',
          mx: 'auto',
          mt: 1,
          textAlign: 'center',
        }}
      >
        <title>Error - Córdoba Music Group</title>
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
            {clientQuery.error.message || 'Failed to load client data.'}
          </Typography>
        </Paper>
      </Box>
    );
  }

  if (!clientQuery.data) {
    return <SkeletonLoader />;
  }

  // Ahora importado desde utils/extractValidationMessages

  return (
    <RoleProtectedRoute allowedRoles={[Roles.Admin]}>
      <title>{`Update Client: ${clientQuery.data?.clientName ?? 'Unknown'} - Córdoba Music Group`}</title>
      <Box p={3} sx={{ display: 'flex', flexDirection: 'column' }}>
        <CustomPageHeader background={'linear-gradient(58deg, rgba(0,124,233,1) 0%, rgba(0,79,131,1) 85%)'} color={theme.palette.primary.contrastText}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography sx={{ fontSize: '20px', fontWeight: 'bold' }}>
              Update Client: {clientQuery.data?.clientName || `ID ${clientQuery.data?.id}`}
            </Typography>
            <Typography sx={{ fontSize: '14px', opacity: 0.8 }}>
              {clientQuery.data?.firstName && clientQuery.data?.lastName
                ? `${clientQuery.data.firstName} ${clientQuery.data.lastName} • `
                : ''}
              {clientQuery.data?.type === 'PERSON' ? '👤 Person' :
               clientQuery.data?.type === 'BUSINESS' ? '🏢 Business' :
               'Unknown Type'} • ID: {clientQuery.data?.id}
            </Typography>
          </Box>
          <BackPageButton colorBackground="white" colorText={theme.palette.secondary.main} />
          <BasicButton
            colorBackground="white"
            colorText={theme.palette.secondary.main}
            onClick={clientForm.handleClientFormSubmit}
            color="primary"
            variant="contained"
            startIcon={<AddOutlinedIcon />}
            loading={updateClientMutation.isPending}
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
                <BalancesBlock balances={clientQuery.data.balances} />
              </FormSectionAccordion>
              <PaymentInfoSection paymentData={clientQuery.data.paymentData || clientQuery.data.payment_info} />
              {Array.isArray(clientQuery.data.users) && clientQuery.data.users.length > 0 && (
                <FormSectionAccordion title="Users" icon={<GroupIcon sx={{ color: 'primary.main' }} />} defaultExpanded={false}>
                  <UsersGridTable users={clientQuery.data.users} onEdit={(id) => navigate(`${webRoutes.admin.users.edit}/${id}`)} />
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
