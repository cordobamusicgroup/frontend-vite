import React from 'react';
import { Box, Typography, Paper, Divider, Chip, Skeleton } from '@mui/material';
// import { Select, MenuItem, FormControl, InputLabel } from '@mui/material'; // Para el sistema de testing
import PaymentIcon from '@mui/icons-material/Payment';
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
// import { allMockData } from '../mocks/paymentMockData'; // Para el sistema de testing

/**
 * Página de información de pagos del usuario.
 *
 * Esta página permite al usuario gestionar y ver información relacionada
 * con sus métodos de pago y configuración de facturación.
 * 
 * SISTEMA DE TESTING MOCK:
 * Esta página incluye un sistema de testing completo con datos mock para desarrollo.
 * El sistema está comentado para producción pero puede activarse fácilmente:
 * 
 * 1. Descomenta las variables de estado: useMockData y selectedMockIndex
 * 2. Descomenta el import de allMockData desde './mocks/paymentMockData'
 * 3. Descomenta el selector UI en el render
 * 4. Descomenta los imports de MUI necesarios para el selector
 * 
 * El sistema incluye 13 casos de prueba:
 * - ✅ Casos válidos: PayPal, Bank Transfer (USD/EUR), Crypto (TRX/TON)
 * - ⚠️ Casos edge: métodos inválidos, datos corruptos, campos faltantes
 * - 🔄 Estados de sistema: loading, error
 *
 * @returns {React.FC} El componente UserPaymentInformationPage
 */
const UserPaymentInformationPage: React.FC = () => {
  const theme = useTheme();
  const { data: paymentInfo, isLoading, error } = useCurrentPaymentInfo();

  // Estado para testing con mocks - Comentado para uso futuro
  // const [useMockData, setUseMockData] = useState(true);
  // const [selectedMockIndex, setSelectedMockIndex] = useState(0);
  const useMockData = false;
  const selectedMockIndex = 0;

  // Development logging para debug de estados de la API
  logColor('info', 'UserPaymentInformationPage', 'PaymentInfo state:', { paymentInfo, isLoading, error });

  // Función para obtener los datos (reales o mock)
  const getCurrentPaymentInfo = () => {
    if (useMockData) {
      const mockData = allMockData[selectedMockIndex]?.data;
      
      // Casos especiales para simular estados
      if (mockData === "LOADING") return null;
      if (mockData === "ERROR") return null;
      
      return mockData || null;
    }
    return paymentInfo;
  };

  // Función para obtener el estado de loading simulado
  const getCurrentLoadingState = () => {
    if (useMockData) {
      return allMockData[selectedMockIndex]?.data === "LOADING";
    }
    return isLoading;
  };

  // Función para obtener el estado de error simulado
  const getCurrentErrorState = () => {
    if (useMockData) {
      return allMockData[selectedMockIndex]?.data === "ERROR" ? { message: "Simulated API Error" } : null;
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
    
    // Validación de estructura de datos
    if (!currentPaymentInfo.paymentMethod || !currentPaymentInfo.data) {
      logColor('warn', 'UserPaymentInformationPage', 'Invalid payment info structure:', currentPaymentInfo);
      return (
        <FetchErrorBox message="Payment information is currently unavailable." />
      );
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

  return (
    <>
      <Helmet>
        <title>Payment Information - Córdoba Music Group</title>
      </Helmet>

      <Box p={3} sx={{ display: 'flex', flexDirection: 'column' }}>
        <CustomPageHeader background={'rgba(0,79,131,1)'} color={theme.palette.primary.contrastText}>
          <Typography sx={{ flexGrow: 1, fontSize: '16px' }}>Payment Information</Typography>
          <BasicButton colorBackground="white" colorText={'#164723'} color="primary" variant="contained" startIcon={<SettingsIcon />}>
            Update Payment Information
          </BasicButton>
          <BackPageButton colorBackground="white" colorText={theme.palette.secondary.main} />
        </CustomPageHeader>

        <Box my={4}>
          {/* Mock Data Selector - Comentado para uso futuro */}
          {/* Para activar el sistema de testing, descomenta el siguiente bloque y las variables de estado arriba */}
          {/*
          <Box mb={3} p={2} bgcolor="grey.100" borderRadius={1}>
            <Typography variant="h6" mb={2}>
              🧪 Testing Mode
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
          */}

          {currentIsLoading && (
            <Paper
              elevation={3}
              sx={{
                p: 4,
                borderRadius: 2,
                bgcolor: 'background.paper',
              }}
            >
              <Box display="flex" alignItems="center" justifyContent="flex-end" mb={2}>
                <Skeleton variant="rectangular" width={100} height={24} sx={{ borderRadius: 1 }} />
              </Box>
              
              <Box mb={3}>
                <Skeleton variant="text" width="40%" height={32} sx={{ mb: 2 }} />
                <Skeleton variant="text" width="60%" height={24} sx={{ mb: 1 }} />
                <Skeleton variant="text" width="80%" height={24} sx={{ mb: 1 }} />
                <Skeleton variant="text" width="50%" height={24} sx={{ mb: 3 }} />
                
                <Box display="flex" gap={2} mb={2}>
                  <Skeleton variant="text" width="30%" height={24} />
                  <Skeleton variant="text" width="40%" height={24} />
                </Box>
                <Box display="flex" gap={2} mb={2}>
                  <Skeleton variant="text" width="35%" height={24} />
                  <Skeleton variant="text" width="45%" height={24} />
                </Box>
                <Box display="flex" gap={2}>
                  <Skeleton variant="text" width="25%" height={24} />
                  <Skeleton variant="text" width="55%" height={24} />
                </Box>
              </Box>
            </Paper>
          )}

          {currentError && (
            <FetchErrorBox message="Unable to load payment information. Please try again later." />
          )}

          {!currentIsLoading && !currentError && !currentPaymentInfo && (
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
          )}

          {!currentIsLoading && !currentError && currentPaymentInfo && (
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
          )}
        </Box>
      </Box>
    </>
  );
};

export default UserPaymentInformationPage;
