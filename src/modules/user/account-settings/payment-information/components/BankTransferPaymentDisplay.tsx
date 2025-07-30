import React from 'react';
import { Box, Typography, Grid, Divider, Chip } from '@mui/material';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import {
  BankTransferData,
  BankTransferCurrencyDto,
  UsdTransferTypeDto,
  EurTransferTypeDto,
} from '../hooks/useCurrentPaymentInfo';

interface BankTransferPaymentDisplayProps {
  data: BankTransferData;
}

const BankTransferPaymentDisplay: React.FC<BankTransferPaymentDisplayProps> = ({ data }) => {
  const { accountHolder, bank_details, currency } = data;

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
              {accountHolder.first_name} {accountHolder.last_name}
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
              {accountHolder.street_address}
              {accountHolder.house_number && ` ${accountHolder.house_number}`}, 
              {accountHolder.city}, {accountHolder.state} {accountHolder.zip}
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
                label={bank_details.transfer_type} 
                color="secondary" 
                size="small" 
                sx={{ mb: 2 }}
              />
            </Grid>
            
            {bank_details.transfer_type === UsdTransferTypeDto.ACH && bank_details.ach && (
              <>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Box display="flex" alignItems="center" mb={1}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Routing Number
                    </Typography>
                  </Box>
                  <Typography variant="body1" fontWeight="medium">
                    {bank_details.ach.routing_number}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Box display="flex" alignItems="center" mb={1}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Account Number
                    </Typography>
                  </Box>
                  <Typography variant="body1" fontWeight="medium">
                    {bank_details.ach.account_number}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Box display="flex" alignItems="center" mb={1}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Account Type
                    </Typography>
                  </Box>
                  <Typography variant="body1" fontWeight="medium">
                    {bank_details.ach.account_type}
                  </Typography>
                </Grid>
              </>
            )}
            
            {bank_details.transfer_type === UsdTransferTypeDto.SWIFT && bank_details.swift && (
              <>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box display="flex" alignItems="center" mb={1}>
                    <Typography variant="subtitle2" color="text.secondary">
                      SWIFT BIC
                    </Typography>
                  </Box>
                  <Typography variant="body1" fontWeight="medium">
                    {bank_details.swift.swift_bic}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box display="flex" alignItems="center" mb={1}>
                    <Typography variant="subtitle2" color="text.secondary">
                      IBAN/Account Number
                    </Typography>
                  </Box>
                  <Typography variant="body1" fontWeight="medium">
                    {bank_details.swift.iban_account_number}
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
                label={bank_details.transfer_type} 
                color="secondary" 
                size="small" 
                sx={{ mb: 2 }}
              />
            </Grid>
            
            {bank_details.transfer_type === EurTransferTypeDto.SEPA && bank_details.sepa && (
              <>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box display="flex" alignItems="center" mb={1}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Account Holder
                    </Typography>
                  </Box>
                  <Typography variant="body1" fontWeight="medium">
                    {bank_details.sepa.account_holder.full_name}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box display="flex" alignItems="center" mb={1}>
                    <Typography variant="subtitle2" color="text.secondary">
                      IBAN
                    </Typography>
                  </Box>
                  <Typography variant="body1" fontWeight="medium">
                    {bank_details.sepa.iban}
                  </Typography>
                </Grid>
              </>
            )}
            
            {bank_details.transfer_type === EurTransferTypeDto.SWIFT && bank_details.swift && (
              <>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Box display="flex" alignItems="center" mb={1}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Account Holder
                    </Typography>
                  </Box>
                  <Typography variant="body1" fontWeight="medium">
                    {bank_details.swift.account_holder.full_name}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Box display="flex" alignItems="center" mb={1}>
                    <Typography variant="subtitle2" color="text.secondary">
                      SWIFT BIC
                    </Typography>
                  </Box>
                  <Typography variant="body1" fontWeight="medium">
                    {bank_details.swift.swift_bic}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Box display="flex" alignItems="center" mb={1}>
                    <Typography variant="subtitle2" color="text.secondary">
                      IBAN/Account Number
                    </Typography>
                  </Box>
                  <Typography variant="body1" fontWeight="medium">
                    {bank_details.swift.iban_account_number}
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