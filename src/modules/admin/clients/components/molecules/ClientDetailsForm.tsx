import { FormControlLabel, MenuItem, Switch } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import { typeOptions, taxIdTypeOptions } from '@/constants/backend.enums';
import TextFieldForm from '@/components/ui/atoms/TextFieldForm';

const ClientDetailsForm: React.FC = () => {
  const { control, setValue, watch } = useFormContext();
  const vatRegistered = watch('client.vatRegistered');

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
      <Controller
        name="client.vatRegistered"
        control={control}
        defaultValue={false}
        render={({ field: { onChange, value } }) => <FormControlLabel control={<Switch checked={!!value} onChange={onChange} />} label="VAT Registered" />}
      />
      {vatRegistered && <TextFieldForm name="client.vatNumber" label="VAT Number" onChange={(e) => setValue('client.vatNumber', e.target.value)} />}
    </>
  );
};

export default ClientDetailsForm;
