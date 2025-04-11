import { Autocomplete } from '@mui/material';
import { useFormContext } from 'react-hook-form';
import TextFieldForm from '@/components/ui/atoms/TextFieldForm';
import { useCountries } from '@/hooks/useCountries';

const AddressDetailsForm: React.FC = () => {
  const { setValue, watch } = useFormContext();
  const { countries, countriesLoading } = useCountries();

  // Watch the 'address.countryId' field to detect external changes
  const countryId = watch('address.countryId');

  // Find the selected country based on 'countryId'
  const selectedCountry = countries?.find((country: any) => country.id === countryId) || null;

  return (
    <>
      <TextFieldForm required name="address.street" label="Street" />
      <TextFieldForm required name="address.city" label="City" />
      <TextFieldForm required name="address.state" label="State" />
      <Autocomplete
        options={countries || []}
        getOptionLabel={(option) => option.name}
        loading={countriesLoading}
        onChange={(_, value) => setValue('address.countryId', value ? value.id : null)}
        value={selectedCountry}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        renderInput={(params) => <TextFieldForm {...params} required name="address.countryId" label="Country" />}
      />
      <TextFieldForm required name="address.zip" label="Zip" />
    </>
  );
};

export default AddressDetailsForm;
