import React, { useEffect } from "react";
import { MenuItem, InputAdornment, Box, FormControlLabel, Switch } from "@mui/material";
import { Controller, set, useFormContext } from "react-hook-form";

import { AccessTypeDMB, StatusDMB } from "@/constants/backend.enums";
import TextFieldForm from "@/components/ui/atoms/TextFieldForm";

const DmbDetailsForm: React.FC = () => {

  return (
    <Box>
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

      <TextFieldForm name="dmb.username" label="DMB Username" />
    </Box>
  );
};

export default DmbDetailsForm;
