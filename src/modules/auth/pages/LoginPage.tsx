/**
 * TODO:
 * * Add error handling for login failures
 * * Migrate Form Reset Popup (requieres new hooks)
 */

import { Helmet } from "react-helmet";
import AuthLayout from "../layouts/AuthLayout";
import { useLoaderStore } from "../../../stores";
import { useForm, SubmitHandler, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "../hooks/useAuth";
import { Box, Button, Grid2, Link } from "@mui/material";
import LoginFormFields from "../components/molecules/LoginFormFields";

interface IFormInput {
  username: string;
  password: string;
}

const validationSchema = z.object({
  username: z.string().nonempty("Username is required"),
  password: z.string().nonempty("Password is required"),
});

function LoginPage() {
  const { login } = useAuth();
  const { loading, setLoading } = useLoaderStore();

  const methods = useForm({
    mode: "all",
    resolver: zodResolver(validationSchema),
    reValidateMode: "onSubmit",
  });

  const { handleSubmit } = methods;

  const onSubmit: SubmitHandler<IFormInput> = async ({ username, password }) => {
    setLoading(true);
    console.log("Form submitted with:", { username, password });
    try {
      const success = await login({ username, password });
      if (!success) {
        // Handle login failure
        alert("Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Auth - Córdoba Music Group</title>
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
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid2>
            </Grid2>
          </Box>
        </FormProvider>
      </AuthLayout>
    </>
  );
}

export default LoginPage;
