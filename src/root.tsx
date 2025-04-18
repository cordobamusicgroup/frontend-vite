import { Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router';
import { AuthProvider } from './modules/auth/context/AuthContext';
import { ServerStatusProvider } from './context/ServerStatusContext';
import { useRouteCleanup } from './hooks/useRouteCleanup';

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        {/* <ToastContainer position="bottom-center" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover theme="colored" /> */}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function Root() {
  useRouteCleanup();

  return (
    <ServerStatusProvider>
      <AuthProvider>
        <Outlet />
      </AuthProvider>
    </ServerStatusProvider>
  );
}
