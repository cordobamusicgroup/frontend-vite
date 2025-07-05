import { useApiRequest } from '@/hooks/useApiRequest';
import { apiRoutes } from '@/routes/api.routes';
import webRoutes from '@/routes/web.routes';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useLocation } from 'react-router';
import { useErrorStore } from '@/stores';
import { AxiosError } from 'axios';
import { ApiErrorResponse } from '@/types/api';
import { logColor } from '@/lib/log.util';
import { setAccessTokenCookie, removeAccessTokenCookie } from '@/lib/cookies.util';
import { useAuthStore } from '@/stores/auth.store';

interface LoginCredentials {
  username: string;
  password: string;
}

/**
 * Hook to handle authentication-related mutations: login, logout, forgot password, and reset password.
 *
 * @returns Object with authentication mutation functions
 */
const useAuthQueries = () => {
  const queryClient = useQueryClient();
  const { apiRequest } = useApiRequest();
  const navigate = useNavigate();
  const location = useLocation();
  const { setError } = useErrorStore();

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      try {
        const response = await apiRequest({
          url: apiRoutes.auth.login,
          method: 'post',
          data: credentials,
          requireAuth: false,
        });
        // Set cookie manual si viene el token
        if (response && response.access_token) {
          setAccessTokenCookie(response.access_token);
          // Update auth store
          useAuthStore.getState().setAuthenticated(true); // Cambiado a setAuthenticated
        }
        return response;
      } catch (e) {
        const error = e as AxiosError<ApiErrorResponse>;
        throw error.response?.data.message || 'Login failed';
      }
    },
    onSuccess: () => {
      // Redirige a la ruta original si existe, si no al home
      queryClient.invalidateQueries({ queryKey: ['auth', 'user'] }).then(() => {
        const from = (location.state as any)?.from?.pathname || webRoutes.backoffice.overview;
        navigate(from, { replace: true });
      });
    },
    onError: (error: string | unknown) => {
      let errorMsg = 'Cannot connect to the server. Please try again later.';
      if (typeof error === 'string') {
        errorMsg = error;
      } else if (error && typeof error === 'object' && 'isAxiosError' in error && (error as any).isAxiosError) {
        const axiosError = error as AxiosError<ApiErrorResponse>;
        const rawMsg = axiosError.response?.data.message;
        if (Array.isArray(rawMsg)) errorMsg = rawMsg.join(', ');
        else if (rawMsg) errorMsg = rawMsg;
      }
      logColor('error', 'useAuthQueries', 'Login error:', errorMsg);
      setError(errorMsg);
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      try {
        return await apiRequest({
          url: apiRoutes.auth.logout,
          method: 'post',
        });
      } catch (e: unknown) {
        const error = e as AxiosError;
        throw error;
      }
    },
    onSuccess: () => {
      removeAccessTokenCookie(); // Usar importación estática para mayor claridad
      useAuthStore.getState().setAuthenticated(false); // Cambiado a setAuthenticated
      queryClient.clear();
      navigate(webRoutes.login, { replace: true }); // Asegura que la redirección no cause bucles
    },
  });
  // Forgot password mutation
  const forgotPasswordMutation = useMutation({
    mutationFn: async (email: string) => {
      try {
        return await apiRequest({
          url: apiRoutes.auth.forgotPassword,
          method: 'post',
          data: { email },
          requireAuth: false,
        });
      } catch (e: unknown) {
        const error = e as AxiosError;
        throw error;
      }
    },
  });

  // Reset password mutation
  const resetPasswordMutation = useMutation({
    mutationFn: async ({ token, newPassword }: { token: string; newPassword: string }) => {
      try {
        return await apiRequest({
          url: apiRoutes.auth.resetPassword,
          method: 'post',
          data: { token, newPassword },
          requireAuth: false,
        });
      } catch (e: unknown) {
        const error = e as AxiosError;
        throw error;
      }
    },
  });

  return { loginMutation, logoutMutation, forgotPasswordMutation, resetPasswordMutation };
};

export default useAuthQueries;
