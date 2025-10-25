import { Roles } from '@/constants/roles';

export interface ProtectedRouteConfig {
  path: string;
  roles?: Roles[] | Roles.All; // roles ahora es opcional
  public?: boolean; // nueva propiedad para rutas públicas
}

interface RouteValue {
  [key: string]: string | RouteValue;
}

const BACKOFFICE_BASE_URL = '/backoffice';

function prefixRoutes<T extends RouteValue>(prefix: string, routes: T): T {
  const result: RouteValue = {};

  for (const [key, value] of Object.entries(routes)) {
    if (typeof value === 'string') {
      result[key] = `${prefix}${value}`;
    } else {
      result[key] = prefixRoutes(prefix, value);
    }
  }

  return result as T;
}

// Definir rutas base sin prefijos
const baseRoutes = {
  backoffice: {
    overview: '/',
    financial: {
      payments: '/financial/payments-operations',
      reports: '/financial/reports',
      invoices: '/financial/invoices',
    },
    distribution: {
      releaseSubmission: '/dmb/release-submission',
    },
    support: '/support',
    userSettings: {
      root: '/account-settings',
      profile: '/account-settings/profile',
      paymentInformation: '/account-settings/payment-information',
    },
  },
  admin: {
    root: '/admin',
    workflow: {
      root: '/admin/workflow',
    },
    clients: {
      root: '/admin/clients',
      create: '/admin/clients/create',
      edit: '/admin/clients/edit',
      search: '/admin/clients/search',
    },
    labels: {
      root: '/admin/labels',
      create: '/admin/labels/create',
      edit: '/admin/labels/edit',
      search: '/admin/labels/search',
    },
    users: {
      root: '/admin/users',
      create: '/admin/users/create',
      edit: '/admin/users/edit',
    },
    reports: {
      root: '/admin/reports',
      unlinked: {
        root: '/admin/reports/unlinked',
        create: '/admin/reports/unlinked/link-report',
      },
    },
  },
};

// Aplicar prefijo a todas las rutas
const prefixedRoutes = prefixRoutes(BACKOFFICE_BASE_URL, baseRoutes);

// Función para crear rutas protegidas
function createProtectedRoutes(): ProtectedRouteConfig[] {
  return [
    { path: '/auth/login', public: true },
    { path: '/auth/reset', public: true },
    { path: prefixedRoutes.admin.root as string, roles: [Roles.Admin] },
    { path: prefixedRoutes.backoffice.userSettings.root as string, roles: [Roles.User, Roles.Admin] },
    { path: prefixedRoutes.backoffice.financial.invoices as string, roles: [Roles.All] },
    { path: prefixedRoutes.backoffice.financial.reports as string, roles: [Roles.All] },
  ];
}

const webRoutes = {
  login: '/auth/login',
  ...prefixedRoutes,
  protected: createProtectedRoutes(),
};

export default webRoutes;
