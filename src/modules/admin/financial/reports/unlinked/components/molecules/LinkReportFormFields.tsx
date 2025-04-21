import { CircularProgress, Autocomplete } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import TextFieldForm from '@/components/ui/atoms/TextFieldForm';
import { CheckCircle, DoDisturbOnOutlined } from '@mui/icons-material';
import { useLabelsAdmin } from '@/modules/admin/labels/hooks/useLabelsAdmin';

const LinkReportFormFields: React.FC = () => {
  const { control } = useFormContext();
  const { labelsData, labelFetchLoading } = useLabelsAdmin();

  return (
    <>
      <TextFieldForm name="id" label="Unlinked Report ID" disabled />
      <TextFieldForm name="labelName" label="Label Name" disabled />
      <TextFieldForm name="distributor" label="Distributor" disabled />
      <TextFieldForm name="reportingMonth" label="Reporting Month" disabled />
      <TextFieldForm name="count" label="Count" disabled />
      <Controller
        name="labelId"
        control={control}
        render={({ field }) => (
          <Autocomplete
            options={labelsData}
            getOptionLabel={(option) => `[ID: ${option.id}] ${option.name} (${option.status})`}
            loading={labelFetchLoading}
            onChange={(_, value) => field.onChange(value ? value.id : null)}
            value={labelsData?.find((label: any) => label.id === field.value) || null}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderOption={(props, option) => (
              <li {...props}>
                {option.status === 'ACTIVE' ? <CheckCircle style={{ marginRight: 8, color: '#4caf50' }} /> : <DoDisturbOnOutlined style={{ marginRight: 8, color: '#f44336' }} />}
                {[`[ID: ${option.id}] ${option.name}`]}
              </li>
            )}
            renderInput={(params) => (
              <TextFieldForm
                {...params}
                required
                name="labelId"
                label="Select Label"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {labelFetchLoading ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
        )}
      />
    </>
  );
};

export default LinkReportFormFields;
