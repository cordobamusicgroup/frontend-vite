import React from 'react';
import { Box, TextField, FormControlLabel, Checkbox, Typography } from '@mui/material';
import { useFormContext, Controller } from 'react-hook-form';

interface EditableFieldWithCapitalizationProps {
  name: string;
  overrideName: string;
  label: string;
  placeholder?: string;
  helperText?: string;
  required?: boolean;
  multiline?: boolean;
  rows?: number;
  disabled?: boolean;
}

const EditableFieldWithCapitalization: React.FC<EditableFieldWithCapitalizationProps> = ({
  name,
  overrideName,
  label,
  placeholder,
  helperText,
  required = false,
  multiline = false,
  rows,
  disabled = false,
}) => {
  const {
    control,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext();

  const fieldValue = watch(name);
  const overrideValue = watch(overrideName);

  const handleCheckboxChange = (checked: boolean) => {
    if (!checked && fieldValue) {
      // When unchecking, restore original capitalization (if you had stored it)
      // For now, we'll just keep the current value
    }
  };

  return (
    <Box>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label={label}
            variant="outlined"
            placeholder={placeholder}
            helperText={(errors[name]?.message as string) || helperText}
            error={!!errors[name]}
            required={required}
            fullWidth
            multiline={multiline}
            rows={rows}
            disabled={!overrideValue || disabled}
          />
        )}
      />

      {fieldValue && (
        <Controller
          name={overrideName}
          control={control}
          render={({ field }) => (
            <FormControlLabel
              control={
                <Checkbox
                  {...field}
                  checked={field.value || false}
                  onChange={(e) => {
                    field.onChange(e.target.checked);
                    handleCheckboxChange(e.target.checked);
                  }}
                  disabled={disabled}
                />
              }
              label={
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Override capitalization and edit manually
                </Typography>
              }
              sx={{ mt: 1 }}
            />
          )}
        />
      )}
    </Box>
  );
};

export default EditableFieldWithCapitalization;
