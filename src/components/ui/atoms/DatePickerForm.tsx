import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useState } from "react";

import { useFormContext } from "react-hook-form";
import { BaseDatePickerProps } from "@mui/x-date-pickers/DatePicker/shared";
import { DateValidationError } from "@mui/x-date-pickers/models";

interface DatePickerFormProps extends Omit<BaseDatePickerProps<any>, "error"> {
  name: string; // Nombre del campo
  label: string;
  defaultValue?: string; // Valor por defecto
  rules?: object; // Reglas opcionales de validación
}

const DatePickerForm: React.FC<DatePickerFormProps> = ({ name, label, defaultValue = "", rules, ...props }) => {
  const {
    setValue,
    watch,
    formState: { errors },
    clearErrors,
    trigger,
  } = useFormContext(); // Obtiene funciones de react-hook-form
  // Observa los cambios en el valor del campo correspondiente
  const selectedDate = watch(name) || defaultValue;
  const [error, setError] = useState<DateValidationError | null>(null);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        {...props}
        label={label}
        value={selectedDate ? selectedDate : null} // Establece el valor observado
        format="DD/MM/YYYY"
        onError={(newError) => setError(newError)}
        slotProps={{
          textField: {
            variant: "standard",
            helperText: errors[name]?.message?.toString(),
            error: Boolean(errors[name]),
          },
        }}
        onChange={(value) => {
          // Establece el nuevo valor en el formulario
          setValue(name, value, { shouldValidate: true });
          clearErrors(name); // Borra el error cuando cambia el valor
          trigger(name); // Vuelve a validar el campo
        }}
        sx={{ marginBottom: 2, marginTop: 2 }}
      />
    </LocalizationProvider>
  );
};

export default DatePickerForm;
