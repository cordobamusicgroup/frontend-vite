import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material';
import { BankTransferCurrencyDto } from '../../types/bankTransfer.types';

const CurrencySelector: React.FC = () => {
  const { control } = useFormContext();

  return (
    <Controller
      name="paymentData.currency"
      control={control}
      render={({ field, fieldState: { error } }) => (
        <FormControl fullWidth error={!!error} sx={{ marginBottom: 1.5 }}>
          <InputLabel>Currency</InputLabel>
          <Select {...field} label="Currency" value={field.value || ''}>
            <MenuItem value={BankTransferCurrencyDto.USD}>USD</MenuItem>
            <MenuItem value={BankTransferCurrencyDto.EUR}>EUR</MenuItem>
          </Select>
          {error && <FormHelperText>{error.message}</FormHelperText>}
        </FormControl>
      )}
    />
  );
};

export default CurrencySelector;