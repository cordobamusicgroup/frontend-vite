import { type RouteConfig, index, layout, prefix, route } from '@react-router/dev/routes';

export default [
  index('modules/portal/RedirectToBackoffice.tsx'),

  route('*', 'modules/portal/pages/not-found.tsx'),
  // Auth routes
  ...prefix('auth', [layout('modules/auth/layouts/AuthLayout.tsx', [route('login', 'modules/auth/pages/LoginPage.tsx'), route('reset', 'modules/auth/pages/ResetPasswordPage.tsx')])]),

  // Backoffice routes
  ...prefix('/backoffice', [
    layout('components/layouts/BackofficeLayout.tsx', [
      index('modules/portal/pages/Overview.tsx'),
      ...prefix('financial', [
        route('payments-operations', 'modules/user/financial/payments-operations/pages/PaymentsUserPage.tsx'),
        route('reports', 'modules/user/financial/reports/pages/ReportsUserPage.tsx'),
      ]),
      ...prefix('distribution', [route('dmb-submission-qc', 'modules/user/distribution/dmb-submission-qc/pages/DMBSubmissionQCUser.tsx')]),
      ...prefix('user', [route('profile', 'modules/user/profile/pages/UserProfilePage.tsx')]),
      ...prefix('admin', [
        ...prefix('clients', [
          index('modules/admin/clients/pages/ListClientsPage.tsx'),
          route('create', 'modules/admin/clients/pages/CreateClientPage.tsx'),
          route('edit/:clientId', 'modules/admin/clients/pages/UpdateClientPage.tsx'),
        ]),
        ...prefix('labels', [
          index('modules/admin/labels/pages/ListLabelsPage.tsx'),
          route('create', 'modules/admin/labels/pages/CreateLabelPage.tsx'),
          route('edit/:labelId', 'modules/admin/labels/pages/UpdateLabelPage.tsx'),
        ]),
        ...prefix('users', [
          index('modules/admin/users/pages/ListUsersPage.tsx'),
          route('create', 'modules/admin/users/pages/CreateUserPage.tsx'),
          route('edit/:userId', 'modules/admin/users/pages/UpdateUserPage.tsx'),
        ]),
        ...prefix('reports', [route('unlinked', 'modules/admin/financial/reports/unlinked/pages/UnlinkedReportsPage.tsx')]),
      ]),
    ]),
  ]),
] satisfies RouteConfig;
