import React from 'react';
import { Box } from '@mui/material';
import TextFieldForm from '@/components/ui/atoms/TextFieldForm';

const AccountHolderForm: React.FC = () => {
  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}>
        <TextFieldForm name="paymentData.accountHolder.first_name" label="First Name" variant="outlined" placeholder="Enter first name" />
        <TextFieldForm name="paymentData.accountHolder.last_name" label="Last Name" variant="outlined" placeholder="Enter last name" />
      </Box>
      
      <TextFieldForm name="paymentData.accountHolder.street_address" label="Street Address" variant="outlined" placeholder="Enter street address" />
      <TextFieldForm name="paymentData.accountHolder.house_number" label="House Number (Optional)" variant="outlined" placeholder="Enter house number (optional)" />
      
      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}>
        <TextFieldForm name="paymentData.accountHolder.city" label="City" variant="outlined" placeholder="Enter city" />
        <TextFieldForm name="paymentData.accountHolder.state" label="State" variant="outlined" placeholder="Enter state" />
        <TextFieldForm name="paymentData.accountHolder.zip" label="ZIP Code" variant="outlined" placeholder="Enter ZIP code" />
      </Box>
      
      <TextFieldForm name="paymentData.accountHolder.country" label="Country" variant="outlined" placeholder="Enter country" />
    </>
  );
};

export default AccountHolderForm;