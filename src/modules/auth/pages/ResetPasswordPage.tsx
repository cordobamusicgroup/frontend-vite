import { useLocation } from 'react-router';
import useAuthQueries from '../hooks/useAuthQueries';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { Box, Button } from '@mui/material';
import TextFieldForm from '@/components/ui/atoms/TextFieldForm';
import { Check, Close } from '@mui/icons-material';

interface IResetPasswordForm {
  newPassword: string;
  confirmPassword: string;
}

const resetPasswordValidationSchema = z.object({
  newPassword: z.string().min(8, 'Password must be at least 8 characters long'),
  confirmPassword: z.string().min(8, 'Confirm Password must be at least 8 characters long'),
});

export default function ResetPasswordPage() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const resetToken = queryParams.get('token');

  const { resetPasswordMutation } = useAuthQueries();
  const methods = useForm<IResetPasswordForm>({
    mode: 'all',
    resolver: zodResolver(resetPasswordValidationSchema),
  });

  const {
    handleSubmit,
    formState: { errors },
  } = methods;

  const onSubmitForm = async (data: IResetPasswordForm) => {
    if (data.newPassword !== data.confirmPassword) {
      methods.setError('confirmPassword', { type: 'manual', message: 'Passwords do not match' });
      return;
    }

    if (!resetToken) {
      // Handle the case where the token is missing (e.g., show an error message)
      console.error('Reset token is missing');
      return;
    }

    resetPasswordMutation.mutateAsync(
      { token: resetToken, newPassword: data.newPassword },
      {
        onSuccess: () => {
          // Handle success (e.g., redirect to login page)
        },
        onError: () => {
          // Handle error (e.g., show error message)
        },
      },
    );
  };

  const passwordCriteria = {
    isLengthValid: {
      test: (password: string) => password.length >= 8,
      message: 'At least 8 characters',
    },
    hasUpperCase: {
      test: (password: string) => /[A-Z]/.test(password),
      message: 'At least one uppercase letter',
    },
    hasLowerCase: {
      test: (password: string) => /[a-z]/.test(password),
      message: 'At least one lowercase letter',
    },
    hasNumber: {
      test: (password: string) => /\d/.test(password),
      message: 'At least one number',
    },
  };

  return (
    <>
      <FormProvider {...methods}>
        <Box component="form" onSubmit={handleSubmit(onSubmitForm)} mt={3} sx={{ width: '100%', maxWidth: 400, mx: 'auto' }}>
          <TextFieldForm name="newPassowrd" label="Password" />
          <TextFieldForm name="confirmPassword" label="Confirm Password" />
          <Box mt={2}>
            {Object.entries(passwordCriteria).map(([key, criteria]) => (
              <Box display="flex" alignItems="center" key={key}>
                {criteria.test(password) ? <Check color="success" /> : <Close color="error" />}
                <Box component="span" ml={1}>
                  {criteria.message}
                </Box>
              </Box>
            ))}
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} loading={resetPasswordMutation.isPending}>
              {resetPasswordMutation.isPending ? 'Resetting...' : 'Reset Password'}
            </Button>
          </Box>
        </Box>
      </FormProvider>
    </>
  );
}
