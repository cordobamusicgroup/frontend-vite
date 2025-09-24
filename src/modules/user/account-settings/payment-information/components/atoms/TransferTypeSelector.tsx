import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material';
import { BankTransferCurrencyDto, TransferTypeDto } from '../../types/bankTransfer.types';

interface TransferTypeSelectorProps {
  selectedCurrency: BankTransferCurrencyDto;
}

const TransferTypeSelector: React.FC<TransferTypeSelectorProps> = ({ selectedCurrency }) => {
  const { control } = useFormContext();

  const getMenuItems = () => {
    if (selectedCurrency === BankTransferCurrencyDto.USD) {
      return [
        <MenuItem key="ach" value={TransferTypeDto.ACH}>ACH</MenuItem>,
        <MenuItem key="swift-usd" value={TransferTypeDto.SWIFT}>SWIFT</MenuItem>
      ];
    }
    if (selectedCurrency === BankTransferCurrencyDto.EUR) {
      return [
        <MenuItem key="sepa" value={TransferTypeDto.SEPA}>SEPA</MenuItem>,
        <MenuItem key="swift-eur" value={TransferTypeDto.SWIFT}>SWIFT</MenuItem>
      ];
    }
    return [];
  };

  return (
    <Controller
      name="paymentData.bank_details.transfer_type"
      control={control}
      render={({ field, fieldState: { error } }) => (
        <FormControl fullWidth error={!!error} sx={{ marginBottom: 1, marginTop: 1 }}>
          <InputLabel>Transfer Type</InputLabel>
          <Select {...field} label="Transfer Type" value={field.value || ''}>
            {getMenuItems()}
          </Select>
          {error && <FormHelperText>{error.message}</FormHelperText>}
        </FormControl>
      )}
    />
  );
};

export default TransferTypeSelector;