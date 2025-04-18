import React from 'react';
import TextFieldForm from '../../../../components/ui/atoms/TextFieldForm';

const LoginFormFields: React.FC = () => {
  return (
    <>
      <TextFieldForm fullWidth name="username" label="Username / Email" variant="outlined" />
      <TextFieldForm fullWidth name="password" label="Password" type="password" variant="outlined" />
    </>
  );
};
export default LoginFormFields;
