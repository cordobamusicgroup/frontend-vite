import React, { useState } from 'react';
import { Box, Typography, Paper, Divider, Chip, Skeleton, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import PaymentIcon from '@mui/icons-material/Payment';
import PendingIcon from '@mui/icons-material/Pending';
import FetchErrorBox from '@/components/ui/molecules/FetchErrorBox';
import { Helmet } from 'react-helmet';
import { logColor } from '@/lib/log.util';
import CustomPageHeader from '@/components/ui/molecules/CustomPageHeader';
import { useTheme } from '@mui/material/styles';
import BackPageButton from '@/components/ui/atoms/BackPageButton';
import BasicButton from '@/components/ui/atoms/BasicButton';
import SettingsIcon from '@mui/icons-material/Settings';
import { useCurrentPaymentInfo, PaymentMethodDto, PaypalData, BankTransferData, CryptoData } from '../hooks/useCurrentPaymentInfo';
import BankTransferPaymentDisplay from '../components/BankTransferPaymentDisplay';
import PaypalPaymentDisplay from '../components/PaypalPaymentDisplay';
import CryptoPaymentDisplay from '../components/CryptoPaymentDisplay';
import { allMockData } from '../mocks/paymentMockData';
import PaymentUpdateModal from '../components/PaymentUpdateModal';
import { usePaymentUpdateRequest } from '../hooks/usePaymentUpdateRequest';
import { PaymentUpdateFormData } from '../schemas/PaymentUpdateValidationSchema';
import { useFetchWithdrawalAuth } from '@/modules/user/financial/payments-operations/hooks/queries/useFetchWithdrawalAuth';
import { useQueryClient } from '@tanstack/react-query';

/**
 * Página de información de pagos del usuario.
 *
 * Esta página permite al usuario gestionar y ver información relacionada
 * con sus métodos de pago y configuración de facturación.
 *
 * SISTEMA DE TESTING MOCK:
 * Esta página incluye un sistema de testing completo con datos mock que se activa
 * automáticamente SOLO en modo desarrollo (import.meta.env.MODE === 'development').
 * En producción, el sistema de mock está completamente deshabilitado.
 *
 * Características del sistema de testing:
 * - 🔧 Se activa automáticamente en desarrollo
 * - 🚫 Completamente deshabilitado en producción
 * - 🎛️ UI de control para alternar entre API real y datos mock
 * - 📊 13 casos de prueba disponibles:
 *   - ✅ Casos válidos: PayPal, Bank Transfer (USD/EUR), Crypto (TRX/TON)
 *   - ⚠️ Casos edge: métodos inválidos, datos corruptos, campos faltantes
 *   - 🔄 Estados de sistema: loading, error
 *
 * @returns {React.FC} El componente UserPaymentInformationPage
 */
const UserPaymentInformationPage: React.FC = () => {
  const theme = useTheme();
  const queryClient = useQueryClient();
  const { data: paymentInfo, isLoading, error } = useCurrentPaymentInfo();
  const { submitPaymentUpdateAsync, isLoading: isSubmittingUpdate, error: paymentUpdateError, isSuccess: paymentUpdateSuccess, reset: resetPaymentUpdate } = usePaymentUpdateRequest();
  const { withdrawalData, withdrawalLoading } = useFetchWithdrawalAuth();

  // Modal state
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  // Sistema de mock basado en environment - solo disponible en desarrollo
  const isMockingEnabled = import.meta.env.MODE === 'development';
  const [useMockData, setUseMockData] = useState(false);
  const [selectedMockIndex, setSelectedMockIndex] = useState(0);

  // Development logging para debug de estados de la API
  logColor('info', 'UserPaymentInformationPage', 'PaymentInfo state:', { paymentInfo, isLoading, error });

  // Función para obtener los datos (reales o mock)
  const getCurrentPaymentInfo = () => {
    if (isMockingEnabled && useMockData) {
      const mockData = allMockData[selectedMockIndex]?.data;

      // Casos especiales para simular estados
      if (mockData === 'LOADING') return null;
      if (mockData === 'ERROR') return null;

      return mockData || null;
    }
    return paymentInfo;
  };

  // Función para obtener el estado de loading simulado
  const getCurrentLoadingState = () => {
    if (isMockingEnabled && useMockData) {
      return allMockData[selectedMockIndex]?.data === 'LOADING';
    }
    return isLoading;
  };

  // Función para obtener el estado de error simulado
  const getCurrentErrorState = () => {
    if (isMockingEnabled && useMockData) {
      return allMockData[selectedMockIndex]?.data === 'ERROR' ? { message: 'Simulated API Error' } : null;
    }
    return error;
  };

  const currentPaymentInfo = getCurrentPaymentInfo();
  const currentIsLoading = getCurrentLoadingState();
  const currentError = getCurrentErrorState();

  const renderPaymentData = () => {
    if (!currentPaymentInfo) {
      logColor('info', 'UserPaymentInformationPage', 'No currentPaymentInfo available');
      return null;
    }

    logColor('info', 'UserPaymentInformationPage', 'PaymentInfo exists:', currentPaymentInfo);

    // El backend ahora devuelve { paymentMethod: null, data: null } cuando no hay info de pago
    if (!currentPaymentInfo.paymentMethod || !currentPaymentInfo.data) {
      logColor('info', 'UserPaymentInformationPage', 'No payment method configured (paymentMethod or data is null)');
      return null; // Retornar null para mostrar el estado "No Payment Information"
    }

    const { paymentMethod, data } = currentPaymentInfo;
    logColor('info', 'UserPaymentInformationPage', 'PaymentMethod:', paymentMethod);
    logColor('info', 'UserPaymentInformationPage', 'PaymentData:', data);

    switch (paymentMethod) {
      case PaymentMethodDto.PAYPAL: {
        logColor('info', 'UserPaymentInformationPage', 'Rendering PayPal payment method');
        return <PaypalPaymentDisplay data={data as PaypalData} />;
      }

      case PaymentMethodDto.BANK_TRANSFER: {
        logColor('info', 'UserPaymentInformationPage', 'Rendering Bank Transfer payment method');
        return <BankTransferPaymentDisplay data={data as BankTransferData} />;
      }

      case PaymentMethodDto.CRYPTO: {
        logColor('info', 'UserPaymentInformationPage', 'Rendering Crypto payment method');
        return <CryptoPaymentDisplay data={data as CryptoData} />;
      }

      default:
        logColor('warn', 'UserPaymentInformationPage', 'Unsupported payment method:', paymentMethod);
        return <FetchErrorBox message="Payment method is not supported at this time." />;
    }
  };

  const getPaymentMethodLabel = (method: PaymentMethodDto) => {
    switch (method) {
      case PaymentMethodDto.PAYPAL:
        return 'PayPal';
      case PaymentMethodDto.BANK_TRANSFER:
        return 'Bank Transfer';
      case PaymentMethodDto.CRYPTO:
        return 'Cryptocurrency';
      default:
        return method;
    }
  };

  const handleOpenUpdateModal = () => {
    setIsUpdateModalOpen(true);
    resetPaymentUpdate();
  };

  const handleCloseUpdateModal = () => {
    setIsUpdateModalOpen(false);
  };

  const handleSubmitPaymentUpdate = async (data: PaymentUpdateFormData) => {
    await submitPaymentUpdateAsync(data);
    // Refresh withdrawal auth data to get updated isPaymentDataInValidation status
    queryClient.invalidateQueries({ queryKey: ['payments', 'withdrawal-authorized'] });
    // Don't close modal - let user see the success/error message inside modal
  };

  // Function to render the appropriate content when there's no payment info
  const renderNoPaymentContent = () => {
    // Check if there's a pending payment request
    if (!withdrawalLoading && withdrawalData?.isPaymentDataInValidation) {
      return (
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 2,
            bgcolor: 'background.paper',
          }}
        >
          <Box display="flex" flexDirection="column" alignItems="center" textAlign="center">
            <Box mb={1}>
              <PendingIcon
                sx={{
                  fontSize: 60,
                  color: '#0069BF',
                }}
              />
            </Box>

            <Typography
              variant="h6"
              component="h1"
              sx={{
                fontWeight: 500,
                color: '#0069BF',
                mb: 1,
              }}
            >
              Payment Information Update Pending
            </Typography>

            <Typography
              variant="body1"
              sx={{
                color: 'text.secondary',
                maxWidth: 520,
                fontSize: '0.9rem',
                lineHeight: 1.5,
              }}
            >
              We will notify you once your payment information update has been reviewed and approved. If you have any questions, please contact our support team.
            </Typography>
          </Box>
        </Paper>
      );
    }

    // Default "no payment info" content
    return (
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 2,
          bgcolor: 'background.paper',
        }}
      >
        <Box display="flex" flexDirection="column" alignItems="center" textAlign="center">
          <Box mb={2}>
            <PaymentIcon
              sx={{
                fontSize: 70,
                color: 'text.secondary',
                mb: 1,
              }}
            />
          </Box>

          <Typography
            variant="h5"
            component="h1"
            sx={{
              fontWeight: 'bold',
              color: 'text.primary',
              mb: 1,
            }}
          >
            No Payment Information
          </Typography>

          <Divider sx={{ width: '60%', my: 2 }} />

          <Typography
            variant="body1"
            sx={{
              color: 'text.secondary',
              maxWidth: 450,
              mb: 1,
              fontSize: '1.05rem',
            }}
          >
            You haven't set up your payment information yet. Click "Update Payment Information" to get started.
          </Typography>
        </Box>
      </Paper>
    );
  };

  return (
    <>
      <Helmet>
        <title>Payment Information - Córdoba Music Group</title>
      </Helmet>

      <Box p={3} sx={{ display: 'flex', flexDirection: 'column' }}>
        <CustomPageHeader background={'rgba(0,79,131,1)'} color={theme.palette.primary.contrastText}>
          <Typography sx={{ flexGrow: 1, fontSize: '16px' }}>Payment Information</Typography>
          {/* Only show update button if there's no pending payment validation */}
          {(withdrawalLoading || !withdrawalData?.isPaymentDataInValidation) && (
            <BasicButton colorBackground="white" colorText={'#164723'} color="primary" variant="contained" startIcon={<SettingsIcon />} onClick={handleOpenUpdateModal}>
              Update Payment Information
            </BasicButton>
          )}
          <BackPageButton colorBackground="white" colorText={theme.palette.secondary.main} />
        </CustomPageHeader>

        <Box my={4}>
          {/* Mock Data Selector - Solo disponible en desarrollo */}
          {isMockingEnabled && (
            <Box mb={3} p={2} bgcolor="grey.100" borderRadius={1}>
              <Typography variant="h6" mb={2}>
                🧪 Development Testing Mode
              </Typography>
              <Box display="flex" gap={2} alignItems="center">
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>Data Source</InputLabel>
                  <Select value={useMockData ? 'mock' : 'api'} label="Data Source" onChange={(e) => setUseMockData(e.target.value === 'mock')}>
                    <MenuItem value="api">Real API</MenuItem>
                    <MenuItem value="mock">Mock Data</MenuItem>
                  </Select>
                </FormControl>

                {useMockData && (
                  <FormControl size="small" sx={{ minWidth: 200 }}>
                    <InputLabel>Mock Type</InputLabel>
                    <Select value={selectedMockIndex} label="Mock Type" onChange={(e) => setSelectedMockIndex(Number(e.target.value))}>
                      {allMockData.map((mock, index) => (
                        <MenuItem key={index} value={index}>
                          {mock.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              </Box>
            </Box>
          )}

          {currentIsLoading && (
            <Paper
              elevation={3}
              sx={{
                p: 4,
                borderRadius: 2,
                bgcolor: 'background.paper',
              }}
            >
              {/* Payment method chip skeleton */}
              <Box display="flex" alignItems="center" justifyContent="flex-end" mb={3}>
                <Skeleton variant="rectangular" width={120} height={28} sx={{ borderRadius: 1 }} />
              </Box>

              {/* Simple content skeletons */}
              <Box mb={2}>
                <Skeleton variant="text" width="30%" height={24} sx={{ mb: 1 }} />
                <Skeleton variant="rectangular" width="100%" height={48} sx={{ borderRadius: 1, mb: 2 }} />
              </Box>

              <Box mb={2}>
                <Skeleton variant="text" width="25%" height={24} sx={{ mb: 1 }} />
                <Skeleton variant="rectangular" width="100%" height={48} sx={{ borderRadius: 1 }} />
              </Box>
            </Paper>
          )}

          {currentError && <FetchErrorBox message="Unable to load payment information. Please try again later." />}

          {!currentIsLoading && !currentError && (!currentPaymentInfo || !currentPaymentInfo.paymentMethod || !currentPaymentInfo.data) && renderNoPaymentContent()}

          {!currentIsLoading && !currentError && currentPaymentInfo && currentPaymentInfo.paymentMethod && currentPaymentInfo.data && (
            <>
              {/* Show pending validation message outside paper if there's a pending request */}
              {!withdrawalLoading && withdrawalData?.isPaymentDataInValidation && (
                <Box
                  sx={{
                    mb: 2,
                    p: 2,
                    border: '0.5px solid #fff4d6',
                    borderRadius: 1,
                    bgcolor: '#fefdf8',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 1.5,
                  }}
                >
                  <PendingIcon sx={{ color: '#664d03', mt: 0.25, fontSize: '20px' }} />
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#664d03', mb: 0.5 }}>
                      Payment information update in progress
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: '0.875rem', color: '#664d03', lineHeight: 1.4 }}>
                      Please wait for validation of the submitted data before making new changes. Current information is shown below.
                    </Typography>
                  </Box>
                </Box>
              )}

              <Paper
                elevation={3}
                sx={{
                  p: 4,
                  borderRadius: 2,
                  bgcolor: 'background.paper',
                }}
              >
                <Box mb={3}>
                  <Box display="flex" alignItems="center" justifyContent="flex-end" mb={2}>
                    <Chip label={getPaymentMethodLabel(currentPaymentInfo.paymentMethod)} color="primary" variant="outlined" size="small" />
                  </Box>

                  {renderPaymentData()}
                </Box>
              </Paper>
            </>
          )}
        </Box>

        <PaymentUpdateModal
          open={isUpdateModalOpen}
          onClose={handleCloseUpdateModal}
          onSubmit={handleSubmitPaymentUpdate}
          loading={isSubmittingUpdate}
          error={paymentUpdateError}
          isSuccess={paymentUpdateSuccess}
        />
      </Box>
    </>
  );
};

export default UserPaymentInformationPage;
