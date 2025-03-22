import { type RouteConfig, index, prefix, route } from "@react-router/dev/routes";
import PageOverview from "./modules/portal/pages/Overview";

export default [...prefix("/backoffice", [index("modules/portal/pages/Overview.tsx")]), ...prefix("auth", [route("login", "modules/auth/pages/LoginPage.tsx")])] satisfies RouteConfig;
