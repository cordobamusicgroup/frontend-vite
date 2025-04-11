import TextFieldForm from '@/components/ui/atoms/TextFieldForm';

const ChangePasswordForm: React.FC = () => {
  return (
    <>
      <TextFieldForm margin="normal" fullWidth name="currentPassword" label="Current Password" type="password" />
      <TextFieldForm margin="normal" fullWidth name="newPassword" label="New Password" type="password" />
      <TextFieldForm margin="normal" fullWidth name="confirmPassword" label="Confirm Password" type="password" />
    </>
  );
};

export default ChangePasswordForm;
