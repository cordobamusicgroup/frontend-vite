import { FormControlLabel, Input, MenuItem, Switch, TextField } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import { typeOptions, taxIdTypeOptions } from "@/constants/backend.enums";
import TextFieldForm from "@/components/ui/atoms/TextFieldForm";

const ClientDetailsForm: React.FC = () => {
  const { setValue, watch, control } = useFormContext();
  const vatRegistered = watch("client.vatRegistered");

  const handleVatToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue("client.vatRegistered", event.target.checked);
    if (!event.target.checked) {
      setValue("client.vatId", "");
    }
  };

  return (
    <>
      <TextFieldForm name="client.clientId" label="Client ID" disabled />

      <TextFieldForm name="client.clientName" label="Client Name" />
      <TextFieldForm name="client.firstName" label="First Name" />

      <TextFieldForm name="client.lastName" label="Last Name" />
      <TextFieldForm name="client.type" label="Type" select>
        {typeOptions.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextFieldForm>

      <TextFieldForm name="client.taxIdType" label="Tax ID Type" select>
        {taxIdTypeOptions.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextFieldForm>

      <TextFieldForm name="client.taxId" label="Tax ID" />

      <Controller name="client.vatRegistered" control={control} defaultValue={false} render={({ field }) => <FormControlLabel control={<Switch checked={vatRegistered} onChange={handleVatToggle} color="primary" />} label="VAT Registered" />} />

      {vatRegistered && <TextFieldForm name="client.vatId" label="VAT ID" />}
    </>
  );
};

export default ClientDetailsForm;
