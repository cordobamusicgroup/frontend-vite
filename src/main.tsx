import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { BrowserRouter, Route, Routes } from "react-router";
import theme from "./theme";
import { AuthProvider } from "./modules/auth/context/AuthProvider";
import LoginPage from "./modules/auth/pages/LoginPage";
import PageOverview from "./modules/portal/pages/Overview";
import BackofficeLayout from "./components/layouts/BackofficeLayout";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <Routes>
            <Route path="backoffice">
              <Route element={<BackofficeLayout />}>
                <Route index element={<PageOverview />} />
              </Route>
            </Route>
            <Route path="auth">
              <Route path="login" Component={LoginPage} />
            </Route>
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);
