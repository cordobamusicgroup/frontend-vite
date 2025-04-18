import React, { useState } from 'react';
import { useLocation } from 'react-router';
import useAuthQueries from '../hooks/useAuthQueries';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { Box, Button, InputAdornment, IconButton, Typography } from '@mui/material';
import TextFieldForm from '@/components/ui/atoms/TextFieldForm';
import { Check, Close, Visibility, VisibilityOff } from '@mui/icons-material';
import FailedToLoadData from '@/components/ui/molecules/FailedToLoadData';
import { useErrorStore } from '@/stores';
import { AxiosError } from 'axios';
import ErrorModal2 from '@/components/ui/molecules/ErrorModal2';
import SuccessModal from '@/components/ui/molecules/SucessModal';
import { useNavigate } from 'react-router';
import webRoutes from '@/lib/web.routes';

interface IResetPasswordForm {
  newPassword: string;
  confirmPassword: string;
}

const resetPasswordValidationSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, 'At least 8 characters')
      .refine((val) => /[A-Z]/.test(val), {
        message: 'At least one uppercase letter',
      })
      .refine((val) => /[a-z]/.test(val), {
        message: 'At least one lowercase letter',
      })
      .refine((val) => /\d/.test(val), {
        message: 'At least one number',
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
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
    watch,
    formState: { isValid },
  } = methods;

  const password = watch('newPassword', '');
  const { error, openModal, closeModal, setError } = useErrorStore();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);
  const [countdown, setCountdown] = useState(3);

  if (!resetToken) {
    console.error('Reset token is missing');
    return (
      <Box sx={{ width: 600, mt: 2 }}>
        <FailedToLoadData secondaryText="Reset token is missing" />
      </Box>
    );
  }

  const onSubmitForm = handleSubmit(async (data: IResetPasswordForm) => {
    if (data.newPassword !== data.confirmPassword) {
      methods.setError('confirmPassword', { type: 'manual', message: 'Passwords do not match' });
    }

    resetPasswordMutation.mutateAsync(
      { token: resetToken, newPassword: data.newPassword },
      {
        onSuccess: () => {
          setShowSuccess(true);
          setCountdown(3);
        },
        onError: (e: unknown) => {
          console.log('Error resetting password:', e);
          const error = e as AxiosError<{ message?: string }>;
          setError(error.response?.data?.message || 'An error occurred while resetting the password');
        },
      },
    );
  });

  // Cuenta regresiva y redirección al login
  React.useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    if (showSuccess && countdown > 0) {
      timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    } else if (showSuccess && countdown === 0) {
      navigate(webRoutes.login);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [showSuccess, countdown, navigate]);

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
        <Box component="form" onSubmit={onSubmitForm} mt={3} sx={{ width: '100%', maxWidth: 400, mx: 'auto' }}>
          <TextFieldForm
            name="newPassword"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            variant="outlined"
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword((show) => !show)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
          <TextFieldForm
            name="confirmPassword"
            label="Confirm Password"
            type={showConfirmPassword ? 'text' : 'password'}
            variant="outlined"
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton aria-label={showConfirmPassword ? 'Hide password' : 'Show password'} onClick={() => setShowConfirmPassword((show) => !show)} edge="end">
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
          <Box mt={2}>
            {Object.entries(passwordCriteria).map(([key, criteria]) => (
              <Box display="flex" alignItems="center" key={key}>
                {criteria.test(password) ? <Check color="success" /> : <Close color="error" />}
                <Box component="span" ml={1}>
                  {criteria.message}
                </Box>
              </Box>
            ))}
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} loading={resetPasswordMutation.isPending} disabled={!isValid || resetPasswordMutation.isPending}>
              {resetPasswordMutation.isPending ? 'Resetting...' : 'Reset Password'}
            </Button>
          </Box>
        </Box>
        <ErrorModal2 open={openModal} onClose={closeModal}>
          <Typography>{error}</Typography>
        </ErrorModal2>
        <SuccessModal
          open={showSuccess}
          onClose={() => {}}
          title="Password Reset Successful"
          message={`Your password has been reset successfully. You will be redirected to the login page in ${countdown} seconds.`}
          showCloseButton={false}
        />
      </FormProvider>
    </>
  );
}
