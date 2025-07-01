import { useApiRequest } from '@/hooks/useApiRequest';
import { apiRoutes } from '@/routes/api.routes';
import webRoutes from '@/routes/web.routes';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { useErrorStore } from '@/stores';
import { AxiosError } from 'axios';
import { ApiErrorResponse } from '@/types/api';
import { logColor } from '@/lib/log.util';
import { setAccessTokenCookie } from '@/lib/cookies.util';

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

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      try {
        const response = await apiRequest({
          url: apiRoutes.auth.login,
          method: 'post',
          data: credentials,
          requireAuth: false,
        });
        // Set cookie manually si viene el token
        if (response && response.access_token) {
          setAccessTokenCookie(response.access_token);
        }
        return response;
      } catch (e) {
        const error = e as AxiosError<ApiErrorResponse>;
        throw error.response?.data.message || 'Login failed';
      }
    },
    onSuccess: () => {
      // El token ya está en la cookie, solo redirigir y refrescar usuario
      queryClient.invalidateQueries({ queryKey: ['auth', 'user'] }).then(() => {
        navigate(webRoutes.backoffice.overview);
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
      logColor('info', 'useAuthQueries', 'Nuevo access_token seteado:', data.access_token);
      // NO setees setAuthenticated acá, SOLO en /auth/me!
    },
    onError: (error) => {
      logColor('error', 'useAuthQueries', '[Auth] ERROR en refresh mutation', error);
      // Elimina la cookie si el refresh falla
      import('@/lib/cookies.util').then((mod) => mod.removeAccessTokenCookie());
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
      import('@/lib/cookies.util').then((mod) => mod.removeAccessTokenCookie());
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
