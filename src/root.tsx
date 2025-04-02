import { Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router';
import { AuthProvider } from './modules/auth/context/AuthProvider';
import { ServerStatusProvider } from './context/ServerStatusContext';

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
