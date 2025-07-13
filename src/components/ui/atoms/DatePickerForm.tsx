import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Controller, useFormContext } from 'react-hook-form';
import { BaseDatePickerProps } from '@mui/x-date-pickers/DatePicker/shared';
import dayjs from 'dayjs';

interface DatePickerFormProps extends Omit<BaseDatePickerProps<any>, 'error' | 'value' | 'onChange'> {
  name: string;
  label: string;
  defaultValue?: string;
  rules?: object;
}

const DatePickerForm: React.FC<DatePickerFormProps> = ({ name, label, defaultValue = '', rules, ...props }) => {
  const { control } = useFormContext();

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue ? dayjs(defaultValue) : undefined}
        rules={rules}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <DatePicker
            {...props}
            label={label}
            value={value ? dayjs(value) : null} // null si no hay valor
            onChange={(newValue) => {
              onChange(newValue);
            }}
            format="DD/MM/YYYY"
            slotProps={{
              textField: {
                variant: 'standard',
                error: !!error,
                helperText: error?.message,
              },
            }}
            sx={{ marginBottom: 2, marginTop: 2 }}
          />
        )}
      />
    </LocalizationProvider>
  );
};

export default DatePickerForm;
