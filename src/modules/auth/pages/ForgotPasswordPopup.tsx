import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNotificationStore } from '@/stores';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import TextFieldForm from '@/components/ui/atoms/TextFieldForm';
import useAuthQueries from '../hooks/useAuthQueries';

interface ForgotPasswordProps {
  open: boolean;
  onClose: () => void;
}

interface IFormInput {
  email: string;
}

const validationSchema = z.object({
  email: z.string().email('Invalid email address').nonempty('Email is required'),
});

const ForgotPasswordPopup: React.FC<ForgotPasswordProps> = ({ open, onClose }) => {
  const { notification, setNotification, clearNotification } = useNotificationStore();
  const { forgotPasswordMutation } = useAuthQueries();
  const loading = forgotPasswordMutation.isPending;

  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(validationSchema),
  });

  const { handleSubmit } = methods;

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    clearNotification();
    forgotPasswordMutation.mutateAsync(data.email, {
      onSuccess: () => {
        setNotification({
          message: 'If a user account exists with the entered email, we will send an email with further instructions to reset the password.',
          type: 'success',
        });
      },
      onError: () => {
        setNotification({
          message: 'An error occurred. Please try again later',
          type: 'error',
        });
      },
    });
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Forgot Password</DialogTitle>
      <DialogContent>
        <Typography>Please enter your email address associated with your account. We will email instructions on how to reset your password.</Typography>
        <FormProvider {...methods}>
          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <TextFieldForm margin="normal" fullWidth name="email" label="Email" disabled={loading} />
            {notification?.type === 'success' && <Typography>{notification.message}</Typography>}
            {notification?.type === 'error' && <Typography>{notification.message}</Typography>}
          </Box>
        </FormProvider>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" onClick={handleSubmit(onSubmit)} color="primary" loading={loading}>
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ForgotPasswordPopup;
