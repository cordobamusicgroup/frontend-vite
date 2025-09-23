import { Autocomplete, MenuItem } from '@mui/material';
import { useFormContext } from 'react-hook-form';
import { LabelStatus, LabelRegistrationStatus } from '@/constants/backend.enums';
import { CheckCircleOutline, DoDisturbOnOutlined, BlockOutlined, DisabledByDefault, PendingOutlined } from '@mui/icons-material';
import { useListClientsQuery } from '@/modules/admin/clients/hooks/useListClientsQuery';
import TextFieldForm from '@/components/ui/atoms/TextFieldForm';

const LabelDetailsForm: React.FC = () => {
  const { setValue, watch } = useFormContext();
  const clientsQuery = useListClientsQuery();
  const clientsData: any[] | undefined = clientsQuery.data;

  const clientId = watch('clientId');
  const selectedClient = clientsData?.find((client: any) => client.id === clientId) || null;

  const beatportStatus = watch('beatportStatus');
  const traxsourceStatus = watch('traxsourceStatus');

  // Función para renderizar el icono correcto según el status
  const getRegistrationStatusIcon = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <CheckCircleOutline fontSize="small" color="success" style={{ marginRight: '8px', verticalAlign: 'middle' }} />;
      case 'PENDING':
        return <PendingOutlined fontSize="small" color="warning" style={{ marginRight: '8px', verticalAlign: 'middle' }} />;
      case 'REJECTED':
        return <BlockOutlined fontSize="small" color="error" style={{ marginRight: '8px', verticalAlign: 'middle' }} />;
      case 'NO_REGISTRATION':
        return <DisabledByDefault fontSize="small" color="action" style={{ marginRight: '8px', verticalAlign: 'middle' }} />;
      default:
        return null;
    }
  };

  return (
    <>
      <TextFieldForm name="labelId" label="Label ID" disabled />

      <Autocomplete
        options={clientsData}
        getOptionLabel={(option) => `[ID: ${option.id}] ${option.clientName} (${option.firstName} ${option.lastName}) `}
        loading={clientsQuery.isLoading}
        onChange={(_, value) => setValue('clientId', value ? value.id : null)}
        value={selectedClient}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        renderInput={(params) => <TextFieldForm {...params} required name="clientId" label="Client" />}
      />

      <TextFieldForm name="name" label="Label Name" />

      <TextFieldForm name="labelStatus" label="Label Status" select>
        {LabelStatus.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.value === 'ACTIVE' ? (
              <CheckCircleOutline fontSize="small" color="success" style={{ marginRight: '8px', verticalAlign: 'middle' }} />
            ) : (
              <DoDisturbOnOutlined fontSize="small" color="error" style={{ marginRight: '8px', verticalAlign: 'middle' }} />
            )}
            {option.label}
          </MenuItem>
        ))}
      </TextFieldForm>

      <TextFieldForm name="beatportStatus" label="Beatport Status" select>
        {LabelRegistrationStatus.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {getRegistrationStatusIcon(option.value)}
            {option.label}
          </MenuItem>
        ))}
      </TextFieldForm>

      {beatportStatus === 'ACTIVE' && <TextFieldForm name="beatportUrl" label="Beatport URL" />}

      <TextFieldForm name="traxsourceStatus" label="Traxsource Status" select>
        {LabelRegistrationStatus.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {getRegistrationStatusIcon(option.value)}
            {option.label}
          </MenuItem>
        ))}
      </TextFieldForm>

      {traxsourceStatus === 'ACTIVE' && <TextFieldForm name="traxsourceUrl" label="Traxsource URL" />}
    </>
  );
};

export default LabelDetailsForm;
