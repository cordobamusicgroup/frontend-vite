import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material';
import { PaymentMethodDto } from '../../hooks/useCurrentPaymentInfo';

const PaymentMethodSelector: React.FC = () => {
  const { control } = useFormContext();

  return (
    <Controller
      name="paymentMethod"
      control={control}
      render={({ field, fieldState: { error } }) => (
        <FormControl fullWidth error={!!error} sx={{ marginBottom: 1.5 }}>
          <InputLabel>Payment Method</InputLabel>
          <Select {...field} label="Payment Method">
            <MenuItem value={PaymentMethodDto.PAYPAL}>PayPal</MenuItem>
            <MenuItem value={PaymentMethodDto.BANK_TRANSFER}>Bank Transfer</MenuItem>
            <MenuItem value={PaymentMethodDto.CRYPTO}>Cryptocurrency</MenuItem>
          </Select>
          {error && <FormHelperText>{error.message}</FormHelperText>}
        </FormControl>
      )}
    />
  );
};

export default PaymentMethodSelector;