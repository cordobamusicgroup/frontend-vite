import React from 'react';
import { Box, Typography, Container, Paper, Divider } from '@mui/material';
import PaymentIcon from '@mui/icons-material/Payment';
import { Helmet } from 'react-helmet';
import CustomPageHeader from '@/components/ui/molecules/CustomPageHeader';
import { useTheme } from '@mui/material/styles';
import BackPageButton from '@/components/ui/atoms/BackPageButton';
import BasicButton from '@/components/ui/atoms/BasicButton';
import SettingsIcon from '@mui/icons-material/Settings';

/**
 * Página de información de pagos del usuario.
 *
 * Esta página permite al usuario gestionar y ver información relacionada
 * con sus métodos de pago y configuración de facturación.
 *
 * @returns {React.FC} El componente UserPaymentInformationPage
 */
const UserPaymentInformationPage: React.FC = () => {
  const theme = useTheme();

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

        <Container maxWidth="md">
          <Box my={4}>
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
                      color: 'primary.main',
                      mb: 1,
                    }}
                  />
                </Box>

                <Typography
                  variant="h5"
                  component="h1"
                  sx={{
                    fontWeight: 'bold',
                    color: 'primary.main',
                    mb: 1,
                  }}
                >
                  Payment Information Management
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
                  Aquí podrás gestionar tus métodos de pago, información de facturación y configurar las preferencias para recibir pagos de regalías.
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    color: 'text.secondary',
                    maxWidth: 450,
                    fontSize: '0.98rem',
                  }}
                >
                  Esta funcionalidad estará disponible próximamente. Mantente atento a las actualizaciones!
                </Typography>
              </Box>
            </Paper>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default UserPaymentInformationPage;
