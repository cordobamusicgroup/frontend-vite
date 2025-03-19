import { type RouteConfig, prefix, route } from "@react-router/dev/routes";

export default [
  // * matches all URLs, the ? makes it optional so it will match / as well
  ...prefix("auth", [route("login", "modules/auth/pages/LoginPage.tsx"), route("reset", "catchall.tsx")]),
] satisfies RouteConfig;
