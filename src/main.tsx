import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import theme from "./theme.ts";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { AuthProvider } from "./context/AuthProvider.tsx";
import LoginPage from "./modules/auth/pages/LoginPage.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="about" element={<div>About</div>} />
            <Route path="auth">
              <Route path="login" element={<LoginPage />} />
              <Route path="reset" element={<div>Reset</div>} />
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
);
