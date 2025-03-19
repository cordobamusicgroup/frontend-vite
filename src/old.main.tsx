import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import theme from "./theme.ts";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { AuthProvider } from "./modules/auth/context/AuthProvider.tsx";
import LoginPage from "./modules/auth/pages/LoginPage.tsx";
import ObpLayout from "./components/layouts/ObpLayout.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="auth">
              <Route path="login" element={<LoginPage />} />
              <Route path="reset" element={<div>Reset</div>} />
            </Route>
            <Route path="bop">
              <Route element={<ObpLayout />}>
                <Route index element={<div>Dashboard</div>} />
                <Route path="admin">
                  <Route path="clients" element={<div>Clients</div>} />
                </Route>
                <Route path="financial">
                  <Route path="reports" element={<div>Reports</div>} />
                  <Route path="payments-operations" element={<div>Payments & Operations</div>} />
                </Route>
              </Route>
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
);
