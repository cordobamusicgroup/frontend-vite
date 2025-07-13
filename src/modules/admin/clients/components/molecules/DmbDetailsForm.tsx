import { MenuItem, Box } from '@mui/material';

import { AccessTypeDMB, StatusDMB } from '@/constants/backend.enums';
import TextFieldForm from '@/components/ui/atoms/TextFieldForm';

const DmbDetailsForm: React.FC = () => {
  return (
    <Box>
      <TextFieldForm type="number" name="dmb.clientId" label="DMB Client ID" slotProps={{ htmlInput: { min: 1, step: 0 } }} />

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
