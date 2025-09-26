import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material';
import { UsdAccountTypeDto } from '../../types/bankTransfer.types';

const AccountTypeSelector: React.FC = () => {
  const { control } = useFormContext();

  return (
    <Controller
      name="paymentData.bank_details.ach.account_type"
      control={control}
      render={({ field, fieldState: { error } }) => (
        <FormControl fullWidth error={!!error} sx={{ marginBottom: 1, marginTop: 1 }}>
          <InputLabel>Account Type</InputLabel>
          <Select {...field} label="Account Type" value={field.value || ''}>
            <MenuItem value={UsdAccountTypeDto.CHECKING}>Checking</MenuItem>
            <MenuItem value={UsdAccountTypeDto.SAVINGS}>Savings</MenuItem>
          </Select>
          {error && <FormHelperText>{error.message}</FormHelperText>}
        </FormControl>
      )}
    />
  );
};

export default AccountTypeSelector;