import React from 'react';
import { useFormContext } from 'react-hook-form';
import TextFieldForm from '@/components/ui/atoms/TextFieldForm';
import { Box, Alert, Typography } from '@mui/material';
import PaymentMethodSelector from '../atoms/PaymentMethodSelector';
import BankTransferForm from './BankTransferForm';
import { PaymentMethodDto, CryptoNetworkDto } from '../../hooks/useCurrentPaymentInfo';
import { BankTransferCurrencyDto, TransferTypeDto } from '../../types/bankTransfer.types';
import { FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material';
import { Controller } from 'react-hook-form';

interface PaymentFormContentProps {
  selectedPaymentMethod: PaymentMethodDto;
  selectedCurrency: BankTransferCurrencyDto;
  selectedTransferType: TransferTypeDto;
}

const PaymentFormContent: React.FC<PaymentFormContentProps> = ({
  selectedPaymentMethod,
  selectedCurrency,
  selectedTransferType
}) => {
  const { control, watch } = useFormContext();

  const renderPaymentMethodFields = () => {
    if (selectedPaymentMethod === PaymentMethodDto.PAYPAL) {
      return <TextFieldForm name="paymentData.paypalEmail" label="PayPal Email" type="email" variant="outlined" placeholder="Enter your PayPal email address" />;
    }

    if (selectedPaymentMethod === PaymentMethodDto.BANK_TRANSFER) {
      return <BankTransferForm selectedCurrency={selectedCurrency} selectedTransferType={selectedTransferType} />;
    }

    if (selectedPaymentMethod === PaymentMethodDto.CRYPTO) {
      return (
        <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Alert severity="error" sx={{ mb: 1 }}>
            <Typography variant="body2">
              <strong>CRITICAL:</strong> This wallet address will receive USDC payments from us. Do NOT enter an address that doesn't support USDC tokens. Using an incompatible address will result in
              permanent loss of funds.
            </Typography>
          </Alert>

          <Controller
            name="paymentData.network"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <FormControl fullWidth error={!!error}>
                <InputLabel>Cryptocurrency Network (USDC Only)</InputLabel>
                <Select {...field} label="Cryptocurrency Network (USDC Only)">
                  <MenuItem value={CryptoNetworkDto.BSC}>
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        BNB Smart Chain (BEP20) - USDC
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Fee: 0.02 USDC
                      </Typography>
                    </Box>
                  </MenuItem>
                  <MenuItem value={CryptoNetworkDto.SOL}>
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        Solana - USDC
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Fee: 0.5 USDC
                      </Typography>
                    </Box>
                  </MenuItem>
                  <MenuItem value={CryptoNetworkDto.ETH}>
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        Ethereum (ERC20) - USDC
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Fee: 1 USDC
                      </Typography>
                    </Box>
                  </MenuItem>
                  <MenuItem value={CryptoNetworkDto.XLM}>
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        Stellar Network - USDC
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Fee: 1 USDC
                      </Typography>
                    </Box>
                  </MenuItem>
                </Select>
                {error && <FormHelperText>{error.message}</FormHelperText>}
              </FormControl>
            )}
          />

          <TextFieldForm
            name="paymentData.walletAddress"
            label="USDC Wallet Address"
            variant="outlined"
            placeholder="Enter your USDC wallet address"
            inputProps={{ style: { fontFamily: 'monospace' } }}
            helperText="Enter your USDC wallet address where you want to receive payments"
          />

          {selectedPaymentMethod === PaymentMethodDto.CRYPTO && watch('paymentData.network') === CryptoNetworkDto.XLM && (
            <TextFieldForm name="paymentData.memo" label="Memo (Optional)" variant="outlined" placeholder="Enter memo (optional)" helperText="Optional memo for Stellar USDC transactions - required by some exchanges" />
          )}

          <Alert severity="info">
            <Typography variant="body2">Withdrawal payments are processed instantly. Verify your wallet address carefully as transactions cannot be reversed.</Typography>
          </Alert>
        </Box>
      );
    }

    return null;
  };

  return (
    <>
      <PaymentMethodSelector />
      {renderPaymentMethodFields()}
    </>
  );
};

export default PaymentFormContent;