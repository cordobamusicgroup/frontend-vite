import { type RouteConfig, index, layout, prefix, route } from "@react-router/dev/routes";

export default [
  // Auth routes
  ...prefix("auth", [
    route("login", "modules/auth/pages/LoginPage.tsx"),
  ]),

  // Backoffice routes
  ...prefix("/backoffice", [
    layout("components/layouts/BackofficeLayout.tsx", [
      index("modules/portal/pages/Overview.tsx"),
      ...prefix("client", [
        index("modules/admin/clients/pages/ListClientsPage.tsx"),
        route("create", "modules/admin/clients/pages/CreateClientPage.tsx"),
        route("edit", "modules/admin/clients/pages/EditClientPage.tsx"),
      ]),
    ]),
  ]),
] satisfies RouteConfig;

