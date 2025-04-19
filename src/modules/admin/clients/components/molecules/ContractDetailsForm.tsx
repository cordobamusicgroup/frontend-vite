import React, { useEffect } from 'react';
import { MenuItem, InputAdornment, Box, FormControlLabel, Switch } from '@mui/material';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { contractStatusOptions, CreateClientContractType } from '@/constants/backend.enums';
import TextFieldForm from '@/components/ui/atoms/TextFieldForm';
import DatePickerForm from '@/components/ui/atoms/DatePickerForm';

const ContractDetailsForm: React.FC = () => {
  const { setValue, control } = useFormContext();

  // Observamos los campos necesarios
  const status: string = useWatch({ name: 'contract.status' });
  const signed: boolean = useWatch({ name: 'contract.signed' });
  const startDate = useWatch({ name: 'contract.startDate' });

  // Determinar si es DRAFT
  const isDraft = !status || status === 'DRAFT';

  useEffect(() => {
    const shouldBeSigned = status && status !== 'DRAFT';

    // Si no hay status aún, lo tomamos como DRAFT (signed = false)
    const desiredSigned = shouldBeSigned ? true : false;

    if (signed !== desiredSigned) {
      setValue('contract.signed', desiredSigned, {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
  }, [status, signed, setValue]);

  return (
    <Box>
      <TextFieldForm name="contract.uuid" label="Contract UUID" disabled />
      <TextFieldForm required name="contract.type" label="Contract Type" select>
        {CreateClientContractType.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextFieldForm>
      <TextFieldForm required name="contract.status" label="Contract Status" select>
        {contractStatusOptions.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextFieldForm>
      <Controller
        control={control}
        name="contract.ppd"
        render={({ field }) => (
          <TextFieldForm
            {...field}
            label="Published Price to Dealer"
            type="number"
            slotProps={{
              input: {
                startAdornment: <InputAdornment position="start">%</InputAdornment>,
              },
            }}
            onChange={(e) => field.onChange(parseFloat(e.target.value))}
          />
        )}
      />
      <TextFieldForm name="contract.docUrl" label="Document URL" />
      <Box sx={{ display: 'flex', gap: 5 }}>
        <DatePickerForm name="contract.startDate" label="Start Date" />
        <DatePickerForm name="contract.endDate" label="End Date" minDate={startDate && startDate.isValid && startDate.isValid() ? startDate.add(1, 'day') : undefined} />
      </Box>
      <Controller
        name="contract.signed"
        control={control}
        render={({ field }) => <FormControlLabel control={<Switch checked={field.value} name="contractSigned" color="primary" disabled />} label="Contract Signed" />}
      />
      {!isDraft && (
        <>
          <TextFieldForm name="contract.signedBy" label="Signed By" />
          <DatePickerForm name="contract.signedAt" label="Signed At" />
        </>
      )}
    </Box>
  );
};

export default ContractDetailsForm;
