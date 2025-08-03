import React, { PropsWithChildren, useRef } from 'react';
import { AuthProvider } from '../../modules/auth/context/AuthContext';
import { HydrationBoundary, QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Si tu versión de React Query soporta Hydrate, usa este import:
// import { Hydrate } from '@tanstack/react-query';
// Si no, comenta la línea de arriba y usa la experimental:
// import { Hydrate } from '@tanstack/react-query-next-experimental';
import theme from '../../theme';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { CssBaseline, ThemeProvider } from '@mui/material';

/**
 * RootLayout envuelve la app con todos los providers globales y estilos.
 */

interface RootLayoutProps extends PropsWithChildren {
  dehydratedState?: unknown;
}

/**
 * RootLayout envuelve la app con todos los providers globales y estilos.
 * Incluye soporte para hidratación SSR de React Query.
 */
const RootLayout: React.FC<RootLayoutProps> = ({ children, dehydratedState }) => {
  // QueryClient persistente por request/cliente
  const queryClientRef = useRef<QueryClient>(new QueryClient());
  return (
    <QueryClientProvider client={queryClientRef.current}>
      <HydrationBoundary state={dehydratedState}>
        <ThemeProvider theme={theme}>
          <AuthProvider>
            <CssBaseline />
            {children}
          </AuthProvider>
        </ThemeProvider>
      </HydrationBoundary>
    </QueryClientProvider>
  );
};

export default RootLayout;
