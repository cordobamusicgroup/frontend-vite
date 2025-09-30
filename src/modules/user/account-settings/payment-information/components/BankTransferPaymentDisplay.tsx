import React from 'react';
import { Box, Typography, Grid, Divider, Chip } from '@mui/material';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import FetchErrorBox from '@/components/ui/molecules/FetchErrorBox';
import {
  BankTransferData,
  BankTransferCurrencyDto,
  UsdTransferTypeDto,
  EurTransferTypeDto,
} from '../hooks/useCurrentPaymentInfo';
import { useValidatedBankTransferData } from '../hooks/useValidatedBankTransferData';

interface BankTransferPaymentDisplayProps {
  data: BankTransferData;
}

const BankTransferPaymentDisplay: React.FC<BankTransferPaymentDisplayProps> = ({ data }) => {
  const validation = useValidatedBankTransferData(data);

  // Handle validation errors
  if (!validation.isValid) {
    return <FetchErrorBox message={validation.errorMessage || 'Invalid payment data'} />;
  }

  const { normalizedData } = validation;
  const { accountHolder, bankDetails, currency } = normalizedData!;

  return (
    <Grid container spacing={2}>
      <Grid size={12}>
        <Typography variant="h6" color="primary.main" mb={2}>
          Account Holder Information
        </Typography>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box display="flex" alignItems="center" mb={1}>
              <AccountBalanceIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="subtitle2" color="text.secondary">
                Full Name
              </Typography>
            </Box>
            <Typography variant="body1" fontWeight="medium">
              {accountHolder.fullName}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box display="flex" alignItems="center" mb={1}>
              <Typography variant="subtitle2" color="text.secondary">
                Country
              </Typography>
            </Box>
            <Typography variant="body1" fontWeight="medium">
              {accountHolder.country}
            </Typography>
          </Grid>
          <Grid size={12}>
            <Box display="flex" alignItems="center" mb={1}>
              <Typography variant="subtitle2" color="text.secondary">
                Address
              </Typography>
            </Box>
            <Typography variant="body1" fontWeight="medium">
              {accountHolder.address}
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      <Grid size={12}>
        <Divider sx={{ my: 2 }} />
        <Typography variant="h6" color="primary.main" mb={2}>
          Bank Details ({currency})
        </Typography>

        {currency === BankTransferCurrencyDto.USD && (
          <Grid container spacing={2}>
            <Grid size={12}>
              <Chip
                label={bankDetails.transferType}
                color="secondary"
                size="small"
                sx={{ mb: 2 }}
              />
            </Grid>
            
            {bankDetails.transferType === UsdTransferTypeDto.ACH && bankDetails.routingNumber && (
              <>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Box display="flex" alignItems="center" mb={1}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Routing Number
                    </Typography>
                  </Box>
                  <Typography variant="body1" fontWeight="medium">
                    {bankDetails.routingNumber}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Box display="flex" alignItems="center" mb={1}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Account Number
                    </Typography>
                  </Box>
                  <Typography variant="body1" fontWeight="medium">
                    {bankDetails.accountNumber}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Box display="flex" alignItems="center" mb={1}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Account Type
                    </Typography>
                  </Box>
                  <Typography variant="body1" fontWeight="medium">
                    {bankDetails.accountType}
                  </Typography>
                </Grid>
              </>
            )}
            
            {bankDetails.transferType === UsdTransferTypeDto.SWIFT && bankDetails.swiftBic && (
              <>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box display="flex" alignItems="center" mb={1}>
                    <Typography variant="subtitle2" color="text.secondary">
                      SWIFT BIC
                    </Typography>
                  </Box>
                  <Typography variant="body1" fontWeight="medium">
                    {bankDetails.swiftBic}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box display="flex" alignItems="center" mb={1}>
                    <Typography variant="subtitle2" color="text.secondary">
                      IBAN/Account Number
                    </Typography>
                  </Box>
                  <Typography variant="body1" fontWeight="medium">
                    {bankDetails.ibanAccountNumber}
                  </Typography>
                </Grid>
              </>
            )}
          </Grid>
        )}

        {currency === BankTransferCurrencyDto.EUR && (
          <Grid container spacing={2}>
            <Grid size={12}>
              <Chip
                label={bankDetails.transferType}
                color="secondary"
                size="small"
                sx={{ mb: 2 }}
              />
            </Grid>
            
            {bankDetails.transferType === EurTransferTypeDto.SEPA && bankDetails.iban && (
              <>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box display="flex" alignItems="center" mb={1}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Account Holder
                    </Typography>
                  </Box>
                  <Typography variant="body1" fontWeight="medium">
                    {accountHolder.fullName}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box display="flex" alignItems="center" mb={1}>
                    <Typography variant="subtitle2" color="text.secondary">
                      IBAN
                    </Typography>
                  </Box>
                  <Typography variant="body1" fontWeight="medium">
                    {bankDetails.iban}
                  </Typography>
                </Grid>
              </>
            )}
            
            {bankDetails.transferType === EurTransferTypeDto.SWIFT && bankDetails.swiftBic && (
              <>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Box display="flex" alignItems="center" mb={1}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Account Holder
                    </Typography>
                  </Box>
                  <Typography variant="body1" fontWeight="medium">
                    {accountHolder.fullName}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Box display="flex" alignItems="center" mb={1}>
                    <Typography variant="subtitle2" color="text.secondary">
                      SWIFT BIC
                    </Typography>
                  </Box>
                  <Typography variant="body1" fontWeight="medium">
                    {bankDetails.swiftBic}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Box display="flex" alignItems="center" mb={1}>
                    <Typography variant="subtitle2" color="text.secondary">
                      IBAN/Account Number
                    </Typography>
                  </Box>
                  <Typography variant="body1" fontWeight="medium">
                    {bankDetails.ibanAccountNumber}
                  </Typography>
                </Grid>
              </>
            )}
          </Grid>
        )}
      </Grid>
    </Grid>
  );
};

export default BankTransferPaymentDisplay;