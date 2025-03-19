import { CssBaseline, ThemeProvider } from "@mui/material";
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import theme from "./theme";
import { AuthProvider } from "./modules/auth/context/AuthProvider";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Córdoba Music Group</title>
        <Meta />
        <Links />
      </head>
      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function Root() {
  return <Outlet />;
}
