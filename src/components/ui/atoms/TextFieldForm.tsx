import { TextField, type TextFieldProps } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';

interface TextFieldFormProps extends Omit<TextFieldProps, 'error'> {
  name: string; // Nombre del campo
  label: string;
  defaultValue?: string; // Valor por defecto
  rules?: object; // Reglas opcionales de validación
}

const TextFieldForm: React.FC<TextFieldFormProps> = ({ name, label, defaultValue = '', rules, helperText, ...props }) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      rules={rules}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          // Convert null values to empty string to avoid React warnings
          variant="standard"
          {...props}
          value={field.value === null ? '' : field.value}
          label={label}
          fullWidth
          sx={{ marginBottom: 1, marginTop: 1 }}
          error={Boolean(error)}
          helperText={error?.message || helperText}
        />
      )}
    />
  );
};

export default TextFieldForm;
