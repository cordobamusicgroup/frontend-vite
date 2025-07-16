import { Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router';

import RootLayout from './components/layouts/RootLayout';

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
        <RootLayout>
          {/* Asegura que la fuente Roboto esté disponible para todos los componentes */}
          <Outlet />
        </RootLayout>

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
