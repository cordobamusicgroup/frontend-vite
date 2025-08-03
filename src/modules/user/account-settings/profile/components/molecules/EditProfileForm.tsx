import TextFieldForm from '@/components/ui/atoms/TextFieldForm';

const EditProfileForm: React.FC = () => {
  return (
    <>
      <TextFieldForm margin="normal" fullWidth name="id" label="User ID" disabled />
      <TextFieldForm margin="normal" fullWidth name="username" label="Username" disabled />
      <TextFieldForm margin="normal" fullWidth name="email" label="Email" />
      <TextFieldForm margin="normal" fullWidth name="fullName" label="Full Name" />
    </>
  );
};

export default EditProfileForm;
