import { Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router';
import { AuthProvider } from './modules/auth/context/AuthProvider';
import { ServerStatusProvider } from './context/ServerStatusContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS

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
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover theme="colored" />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function Root() {
  return (
    <ServerStatusProvider>
      <AuthProvider>
        <Outlet />
      </AuthProvider>
    </ServerStatusProvider>
  );
}
