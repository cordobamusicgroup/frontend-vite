import { type RouteConfig, index, layout, prefix, route } from "@react-router/dev/routes";
import PageOverview from "./modules/portal/pages/Overview";

export default [...prefix("/backoffice", [layout("components/layouts/BackofficeLayout.tsx", [index("modules/portal/pages/Overview.tsx")])]), ...prefix("auth", [route("login", "modules/auth/pages/LoginPage.tsx")])] satisfies RouteConfig;
