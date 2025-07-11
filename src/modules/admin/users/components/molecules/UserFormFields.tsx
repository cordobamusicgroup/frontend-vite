import TextFieldForm from '@/components/ui/atoms/TextFieldForm';
import { useClientsAdmin } from '@/modules/admin/clients/hooks/useClientsAdmin';
import { Autocomplete, MenuItem } from '@mui/material';
import { useFormContext } from 'react-hook-form';

const UserDetailsForm: React.FC = () => {
  const { setValue, watch } = useFormContext();
  const { clientsData: clientData, loading: clientLoading } = useClientsAdmin();
  const clientId = watch('clientId');
  const selectedClient = clientData?.find((client: any) => client.id === clientId) || null;

  return (
    <>
      <TextFieldForm name="username" label="Username" />
      <TextFieldForm name="email" label="Email" />
      <TextFieldForm name="fullName" label="Full Name" />
      <TextFieldForm name="role" label="Role" select>
        <MenuItem value="ADMIN">Admin</MenuItem>
        <MenuItem value="USER">User</MenuItem>
      </TextFieldForm>
      <Autocomplete
        options={clientData}
        getOptionLabel={(option) => `[ID: ${option.id}] ${option.clientName} (${option.firstName} ${option.lastName}) `}
        loading={clientLoading.clientFetch}
        onChange={(_, value) => setValue('clientId', value ? value.id : null)}
        value={selectedClient}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        renderInput={(params) => <TextFieldForm {...params} name="clientId" label="Client" />}
      />
    </>
  );
};

export default UserDetailsForm;
