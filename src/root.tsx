import { Links, Meta, Outlet, Scripts, ScrollRestoration, useNavigation } from "react-router";
import { AuthProvider } from "./modules/auth/context/AuthProvider";
import { Skeleton } from "@mui/material";
import FullScreenLoader from "./components/ui/molecules/FullScreenLoader";

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
        <AuthProvider>{children}</AuthProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function Root() {
  return <Outlet />;
}
