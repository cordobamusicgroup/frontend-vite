import React from 'react';
import { Box, Typography, Grid, Chip } from '@mui/material';
import { CryptoData, CryptoNetworkDto } from '../hooks/useCurrentPaymentInfo';

interface CryptoPaymentDisplayProps {
  data: CryptoData;
}

const CryptoPaymentDisplay: React.FC<CryptoPaymentDisplayProps> = ({ data }) => {
  const getNetworkLabel = (network: CryptoNetworkDto) => {
    switch (network) {
      case CryptoNetworkDto.BSC:
        return 'BNB Smart Chain (BEP20) - USDC';
      case CryptoNetworkDto.SOL:
        return 'Solana - USDC';
      case CryptoNetworkDto.ETH:
        return 'Ethereum (ERC20) - USDC';
      case CryptoNetworkDto.XLM:
        return 'Stellar Network - USDC';
      default:
        return `${network} - USDC`;
    }
  };

  // Not used currently this method

  // const getNetworkFee = (network: CryptoNetworkDto) => {
  //   switch (network) {
  //     case CryptoNetworkDto.BSC:
  //       return '0.02 USDC';
  //     case CryptoNetworkDto.SOL:
  //       return '0.5 USDC';
  //     case CryptoNetworkDto.ETH:
  //       return '1 USDC';
  //     case CryptoNetworkDto.XLM:
  //       return '1 USDC';
  //     default:
  //       return 'Unknown';
  //   }
  // };

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 6 }}>
        <Box display="flex" alignItems="center" mb={1}>
          <Typography variant="subtitle2" color="text.secondary">
            Network
          </Typography>
        </Box>
        <Chip label={`${getNetworkLabel(data.network)}`} color="primary" variant="outlined" />
      </Grid>
      <Grid size={12}>
        <Box display="flex" alignItems="center" mb={1}>
          <Typography variant="subtitle2" color="text.secondary">
            USDC Wallet Address
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
            borderRadius: 1,
          }}
        >
          {data.walletAddress}
        </Typography>
      </Grid>
      {data.memo && (
        <Grid size={12}>
          <Box display="flex" alignItems="center" mb={1}>
            <Typography variant="subtitle2" color="text.secondary">
              Memo
            </Typography>
          </Box>
          <Typography
            variant="body1"
            fontWeight="medium"
            sx={{
              fontFamily: 'monospace',
              bgcolor: 'grey.100',
              p: 1,
              borderRadius: 1,
            }}
          >
            {data.memo}
          </Typography>
        </Grid>
      )}
    </Grid>
  );
};

export default CryptoPaymentDisplay;
