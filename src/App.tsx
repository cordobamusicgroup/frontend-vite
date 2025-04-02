import { HydratedRouter } from 'react-router/dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import theme from './theme';
import { ToastContainer } from 'react-toastify';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <HydratedRouter />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
