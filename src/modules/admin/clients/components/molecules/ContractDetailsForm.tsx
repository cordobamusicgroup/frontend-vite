import React, { useEffect, useState, useCallback } from "react";
import { MenuItem, InputAdornment, Box, FormControlLabel, Switch } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import { contractStatusOptions, CreateClientContractType } from "@/constants/backend.enums";
import TextFieldForm from "@/components/ui/atoms/TextFieldForm";
import DatePickerForm from "@/components/ui/atoms/DatePickerForm";

const ContractDetailsForm: React.FC = () => {
  const { setValue, watch, getValues, control } = useFormContext();
  const [isDraft, setIsDraft] = useState(false);

  const updateContractSigned = useCallback(
    (status: string, contractSigned: boolean) => {
      const shouldBeDraft = status === "DRAFT";
      if (shouldBeDraft && contractSigned !== false) {
        setValue("contract.contractSigned", false);
        setIsDraft(true);
      } else if (!shouldBeDraft && contractSigned !== true) {
        setValue("contract.contractSigned", true);
        setIsDraft(false);
      }
    },
    [setValue]
  );

  useEffect(() => {
    const subscription = watch((value) => {
      const { contract } = value;
      updateContractSigned(contract?.status, contract?.contractSigned);
    });
    return () => subscription.unsubscribe();
  }, [watch, updateContractSigned]);

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
            InputProps={{
              startAdornment: <InputAdornment position="start">%</InputAdornment>,
            }}
            onChange={(e) => field.onChange(parseFloat(e.target.value))}
          />
        )}
      />
      <TextFieldForm name="contract.docUrl" label="Document URL" />
      <Box sx={{ display: "flex", gap: 5 }}>
        <DatePickerForm name="contract.startDate" label="Start Date" />
        <DatePickerForm name="contract.endDate" label="End Date" minDate={getValues("contract.startDate")} />
      </Box>
      <Controller name="contract.contractSigned" control={control} render={({ field }) => <FormControlLabel control={<Switch checked={field.value} name="contractSigned" color="primary" disabled />} label="Contract Signed" />} />
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
