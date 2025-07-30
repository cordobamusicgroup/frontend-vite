import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import { PaypalData } from '../hooks/useCurrentPaymentInfo';

interface PaypalPaymentDisplayProps {
  data: PaypalData;
}

const PaypalPaymentDisplay: React.FC<PaypalPaymentDisplayProps> = ({ data }) => {
  return (
    <Grid container spacing={2}>
      <Grid size={12}>
        <Box display="flex" alignItems="center" mb={1}>
          <EmailIcon sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="subtitle2" color="text.secondary">
            PayPal Email
          </Typography>
        </Box>
        <Typography variant="body1" fontWeight="medium">
          {data.paypalEmail}
        </Typography>
      </Grid>
    </Grid>
  );
};

export default PaypalPaymentDisplay;