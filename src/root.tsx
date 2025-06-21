import { Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router';
import { AuthProvider } from './modules/auth/context/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import theme from './theme';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { CssBaseline, ThemeProvider } from '@mui/material';

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* All `meta` exports on all routes will render here */}
        <Meta />

        {/* All `link` exports on all routes will render here */}
        <Links />
      </head>
      <body>
        <QueryClientProvider client={new QueryClient()}>
          <ThemeProvider theme={theme}>
            <AuthProvider>
              <CssBaseline />
              {/* Asegura que la fuente Roboto esté disponible para todos los componentes */}
              <Outlet />
            </AuthProvider>
          </ThemeProvider>
        </QueryClientProvider>

        {/* Use this to add custom elements to the document head */}
        {/* <DocumentHead /> */}

        {/* All `script` exports on all routes will render here */}
        {/* If you use a nonce-based content security policy for scripts, you must provide the `nonce` prop. Otherwise, omit the nonce prop as shown here. */}

        {/* Manages scroll position for client-side transitions */}
        {/* If you use a nonce-based content security policy for scripts, you must provide the `nonce` prop. Otherwise, omit the nonce prop as shown here. */}
        <ScrollRestoration />

        {/* Script tags go here */}
        {/* If you use a nonce-based content security policy for scripts, you must provide the `nonce` prop. Otherwise, omit the nonce prop as shown here. */}
        <Scripts />
      </body>
    </html>
  );
}
