import React from "react";
import TextFieldForm from "../../../../components/ui/atoms/TextFieldForm";

const LoginFormFields: React.FC = () => {
  return (
    <>
      <TextFieldForm fullWidth name="username" label="Username / Email" />
      <TextFieldForm fullWidth name="password" label="Password" type="password" />
    </>
  );
};
export default LoginFormFields;
