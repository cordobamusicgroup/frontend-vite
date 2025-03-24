import { CssBaseline, ThemeProvider } from "@mui/material";
import theme from "./theme";
import { AuthProvider } from "./modules/auth/context/AuthProvider";

import React from "react";
import ReactDOM from "react-dom/client";
import { HydratedRouter } from "react-router/dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

ReactDOM.hydrateRoot(
  document,
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <HydratedRouter />
  </ThemeProvider>
);
