/**
 * TODO:
 * * Add error handling for login failures
 * * Migrate Form Reset Popup (requieres new hooks)
 */

import { Box, Button, Grid, Link, Typography } from '@mui/material';
import { useForm, type SubmitHandler, FormProvider } from 'react-hook-form';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import type { MetaFunction } from 'react-router';
import { useErrorStore } from '@/stores';
import LoginFormFields from '../components/molecules/LoginFormFields';
import AuthLayout from '../layouts/AuthLayout';
import { Helmet } from 'react-helmet';
import { useState } from 'react';
import ForgotPasswordPopup from './ForgotPasswordPopup';
import ErrorModal2 from '@/components/ui/molecules/ErrorModal2';
import useAuthQueries from '../hooks/useAuthQueries';

export const meta: MetaFunction = () => {
  return [{ title: 'Auth - Córdoba Music Group' }];
};

interface IFormInput {
  username: string;
  password: string;
}

const schema = z.object({
  username: z.string().nonempty('Username is required'),
  password: z.string().nonempty('Password is required'),
});

function LoginPage() {
  const { loginMutation } = useAuthQueries();
  const { error, openModal, clearError, closeModal } = useErrorStore();
  const [openPopUpForgot, setOpenPopUpForgot] = useState<boolean>(false);

  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(schema),
  });

  const { handleSubmit } = methods;

  const onSubmitLogin: SubmitHandler<IFormInput> = async ({ username, password }) => {
    clearError();
    loginMutation.mutateAsync({ username, password });
  };

  return (
    <>
      <Helmet>
        <title>Auth - Córdoba Music Group</title>
        <meta name="description" content="Login page for Córdoba Music Group" />
      </Helmet>
      <AuthLayout>
        <FormProvider {...methods}>
          <Box component="form" onSubmit={handleSubmit(onSubmitLogin)} sx={{ mt: 3, width: '100%', maxWidth: '400px', mx: 'auto' }}>
            <LoginFormFields />
            <Button type="submit" sx={{ mt: 3, mb: 2 }} fullWidth loading={loginMutation.isPending} loadingPosition="end" variant="contained">
              Sign In
            </Button>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
            <Grid container justifyContent="center" sx={{ mt: 2 }}>
              <Grid>
                <Link href="#" onClick={() => setOpenPopUpForgot(true)} variant="body2">
                  Forgot password?
                </Link>
              </Grid>
            </Grid>
          </Box>
        </FormProvider>
        <ErrorModal2 open={openModal} onClose={closeModal}>
          <Typography>{error}</Typography>
        </ErrorModal2>
        <ForgotPasswordPopup open={openPopUpForgot} onClose={() => setOpenPopUpForgot(false)} />
      </AuthLayout>
    </>
  );
}

export default LoginPage;
