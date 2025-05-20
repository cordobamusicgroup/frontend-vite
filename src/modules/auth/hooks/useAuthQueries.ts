import { useApiRequest } from '@/hooks/useApiRequest';
import { apiRoutes } from '@/lib/api.routes';
import webRoutes from '@/lib/web.routes';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AuthErrorMessages, AuthErrorCode } from '../utils/auth.utils';
import { useNavigate } from 'react-router';
import { useAuthStore, useErrorStore } from '@/stores';
import { AxiosError } from 'axios';

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
  const { setError } = useErrorStore();
  const { clearAuthentication, setToken, setAuthenticated } = useAuthStore(); // Assuming this is a function to set authentication state

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      try {
        return await apiRequest({
          url: apiRoutes.auth.login,
          method: 'post',
          data: credentials,
          requireAuth: false,
        });
      } catch (e) {
        const error = e as AxiosError;
        const errorData = error.response?.data as { code: AuthErrorCode };
        throw AuthErrorMessages[errorData.code];
      }
    },
    onSuccess: (data) => {
      setToken(data.access_token);
      queryClient.invalidateQueries({ queryKey: ['auth', 'user'] }).then(() => {
        navigate(webRoutes.backoffice.overview);
      });

      setAuthenticated(true);
    },
    onError: (error: string) => {
      console.log('Login error:', error);
      setError(error);
    },
  });

  const refreshTokenMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest<{ access_token: string; expires_in: number }>({
        url: apiRoutes.auth.refresh,
        method: 'post',
        requireAuth: false,
      });
      return response;
    },
    onSuccess: (data) => {
      setToken(data.access_token);
      console.log('[Auth] Nuevo access_token seteado:', data.access_token);
      // NO setees setAuthenticated acá, SOLO en /auth/me!
    },
    onError: (error) => {
      console.error('[Auth] ERROR en refresh mutation', error);
      clearAuthentication();
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
      queryClient.clear();
      clearAuthentication();
      navigate(webRoutes.login);
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

  return { loginMutation, refreshTokenMutation, logoutMutation, forgotPasswordMutation, resetPasswordMutation };
};

export default useAuthQueries;
