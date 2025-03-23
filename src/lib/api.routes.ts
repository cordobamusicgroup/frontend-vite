export const apiRoutes = {
    auth: {
      login: "/auth/login",
      me: "/auth/me",
      forgotPassword: "/auth/forgot-password",
      resetPassword: "/auth/reset-password",
      refresh: "/auth/refresh",
      logout: "/auth/logout",
    },
    users: {
      editProfile: "/users/edit-profile",
      getCurrent: "/users/current",
      admin: {
        root: "/users/admin",
        register: "/users/admin/register",
        getAll: "/users/admin/all",
        viewAs: "/users/admin/view-as-client",
        getById: (id: number) => `/users/admin/${id}`,
        resendAccountInfo: "/users/admin/resend-account-info",
      },
    },
    clients: {
      root: "/clients",
    },
    labels: {
      root: "/labels",
    },
    financial: {
      balances: {
        root: "/financial/balances",
        transactions: "/financial/balances/transactions",
      },
      payments: {
        root: "/financial/payments",
        withdrawalAuthorized: "/financial/payments/withdrawal-authorized",
      },
      reports: {
        user: {
          currentReports: "/financial/reports/user-reports/current",
          downloadReport: "/financial/reports/user-reports/download",
        },
        admin: {
          unlinked: {
            get: "/financial/reports/admin/unlinked",
            linkMissing: "/financial/reports/admin/link-missing",
          },
        },
      },
    },
    countries: "/countries",
  };
