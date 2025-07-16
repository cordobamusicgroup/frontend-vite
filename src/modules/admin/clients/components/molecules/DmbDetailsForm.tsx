import { MenuItem, Box } from '@mui/material';

import { AccessTypeDMB, StatusDMB } from '@/constants/backend.enums';
import TextFieldForm from '@/components/ui/atoms/TextFieldForm';

const DmbDetailsForm: React.FC = () => {
  return (
    <Box>
      <TextFieldForm
        name="dmb.clientId"
        label="DMB Client ID"
        type="number"
        inputProps={{ min: 1, step: 1 }}
        // value controlado por React Hook Form, pero si usas Controller aquí, asegúrate que value nunca sea undefined
      />

      <TextFieldForm required name="dmb.accessType" label="DMB Access Type" select>
        {AccessTypeDMB.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextFieldForm>

      <TextFieldForm required name="dmb.status" label="DMB Status" select>
        {StatusDMB.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextFieldForm>

      <TextFieldForm name="dmb.subclientName" label="DMB Client Name" />
    </Box>
  );
};

export default DmbDetailsForm;
