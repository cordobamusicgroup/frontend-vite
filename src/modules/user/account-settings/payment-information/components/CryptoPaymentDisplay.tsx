import React from 'react';
import { Box, Typography, Grid, Chip } from '@mui/material';
import { CryptoData, CryptoNetworkDto } from '../hooks/useCurrentPaymentInfo';

interface CryptoPaymentDisplayProps {
  data: CryptoData;
}

const CryptoPaymentDisplay: React.FC<CryptoPaymentDisplayProps> = ({ data }) => {
  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 6 }}>
        <Box display="flex" alignItems="center" mb={1}>
          <Typography variant="subtitle2" color="text.secondary">
            Network
          </Typography>
        </Box>
        <Chip 
          label={data.network === CryptoNetworkDto.TRX ? 'Tron (TRC20)' : 'The Open Network'} 
          color="primary" 
          variant="outlined"
        />
      </Grid>
      <Grid size={12}>
        <Box display="flex" alignItems="center" mb={1}>
          <Typography variant="subtitle2" color="text.secondary">
            Wallet Address
          </Typography>
        </Box>
        <Typography 
          variant="body1" 
          fontWeight="medium"
          sx={{ 
            wordBreak: 'break-all',
            fontFamily: 'monospace',
            bgcolor: 'grey.100',
            p: 1,
            borderRadius: 1
          }}
        >
          {data.walletAddress}
        </Typography>
      </Grid>
    </Grid>
  );
};

export default CryptoPaymentDisplay;