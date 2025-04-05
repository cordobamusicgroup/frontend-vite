import { type RouteConfig, index, layout, prefix, route } from '@react-router/dev/routes';

export default [
  index('modules/portal/RedirectToBackoffice.tsx'),

  // Auth routes
  ...prefix('auth', [route('login', 'modules/auth/pages/LoginPage.tsx')]),

  // Backoffice routes
  ...prefix('/backoffice', [
    layout('components/layouts/BackofficeLayout.tsx', [
      index('modules/portal/pages/Overview.tsx'),
      ...prefix('financial', [
        // route('payments-operations', 'modules/financial/pages/PaymentsOperations.tsx'),
        // route('reports', 'modules/financial/pages/ReportsPage.tsx'),
      ]),
      ...prefix('clients', []),
      ...prefix('admin', [
        ...prefix('clients', [
          index('modules/admin/clients/pages/ListClientsPage.tsx'),
          route('create', 'modules/admin/clients/pages/CreateClientPage.tsx'),
          route('edit/:clientId', 'modules/admin/clients/pages/EditClientPage.tsx'),
        ]),
        ...prefix('labels', [
          index('modules/admin/labels/pages/ListLabelsPage.tsx'),
          route('create', 'modules/admin/labels/pages/CreateLabelPage.tsx'),
          // route('edit/:labelId', 'modules/admin/labels/pages/EditLabelPage.tsx'),
        ]),
        ...prefix('users', [
          // index('modules/admin/users/pages/ListUsersPage.tsx'),
          // route('create', 'modules/admin/users/pages/CreateUserPage.tsx'),
          // route('edit/:userId', 'modules/admin/users/pages/EditUserPage.tsx'),
        ]),
        ...prefix('reports', [
          // route('unlinked', 'modules/admin/reports/pages/UnlinkedReportsPage.tsx')
        ]),
      ]),
    ]),
  ]),
] satisfies RouteConfig;
