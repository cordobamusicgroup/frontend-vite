/**
 * TODO:
 * * Add error handling for login failures
 * * Migrate Form Reset Popup (requieres new hooks)
 */

import { Box, Grid2, Button, Link } from "@mui/material";
import { useForm, type SubmitHandler, FormProvider } from "react-hook-form";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { MetaFunction } from "react-router";
import ErrorModal from "@/components/ui/molecules/ErrorModal";
import { useLoaderStore, useErrorStore } from "@/stores";
import LoginFormFields from "../components/molecules/LoginFormFields";
import { useAuth } from "../hooks/useAuth";
import AuthLayout from "../layouts/AuthLayout";
import { Helmet } from "react-helmet";
import { useState } from "react";
import ForgotPasswordPopup from "./ForgotPasswordPopup";

export const meta: MetaFunction = () => {
  return [{ title: "Auth - Córdoba Music Group" }];
};

interface IFormInput {
  username: string;
  password: string;
}

const schema = z.object({
  username: z.string().nonempty("Username is required"),
  password: z.string().nonempty("Password is required"),
});

function LoginPage() {
  const { login } = useAuth();
  const { loading, setLoading } = useLoaderStore();
  const { error, clearError } = useErrorStore();
  const [openPopUpForgot, setOpenPopUpForgot] = useState<boolean>(false);

  const methods = useForm({
    mode: "all",
    resolver: zodResolver(schema),
  });

  const { handleSubmit } = methods;

  const onSubmit: SubmitHandler<IFormInput> = async ({ username, password }) => {
    setLoading(true);
    clearError();
    console.log("Form submitted with:", { username, password });
    const success = await login({ username, password });
    if (!success) {
      // Handle login failure
      console.error("Login failed");
    }
    setLoading(false);
  };

  return (
    <>
      <Helmet>
        <title>Auth - Córdoba Music Group</title>
        <meta name="description" content="Login page for Córdoba Music Group" />
      </Helmet>
      <AuthLayout>
        <FormProvider {...methods}>
          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3, width: "100%", maxWidth: "400px", mx: "auto" }}>
            <LoginFormFields />
            <Button type="submit" sx={{ mt: 3, mb: 2 }} fullWidth loading={loading} loadingPosition="end" variant="contained">
              Sign In
            </Button>
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
            <Grid2 container justifyContent="center" sx={{ mt: 2 }}>
              <Grid2>
                <Link href="#" onClick={() => setOpenPopUpForgot(true)} variant="body2">
                  Forgot password?
                </Link>
              </Grid2>
            </Grid2>
          </Box>
        </FormProvider>
        <ErrorModal open={!!error} onClose={clearError} errorMessage={error || ""} />
        <ForgotPasswordPopup open={openPopUpForgot} onClose={() => setOpenPopUpForgot(false)} />
      </AuthLayout>
    </>
  );
}

export default LoginPage;
