import React, { useEffect, useRef, useState, useCallback, type ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { jwtDecode } from 'jwt-decode';
import { useApiRequest } from '@/hooks/useApiRequest';
import { apiRoutes } from '@/lib/api.routes';
import { useAuthStore, useUserStore } from '@/stores';
import webRoutes from '@/lib/web.routes';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Box, Typography } from '@mui/material';
import { AxiosError } from 'axios';
import { ApiErrorResponse } from '@/types/api';
import CenteredLoader from '@/components/ui/molecules/CenteredLoader';
import SessionTimeoutDialog from '@/components/ui/molecules/SessionTimeoutDialog';
import useAuthQueries from '../hooks/useAuthQueries';
import { logColor } from '@/lib/log.util';
import { formatError } from '@/lib/formatApiError.util';

interface JWTPayload {
  sub: string;
  email: string;
  iat: number;
  exp: number;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  useEffect(() => {
    logColor('info', 'AuthProvider', 'mounted');
    return () => logColor('info', 'AuthProvider', 'unmounted');
  }, []);

  const { apiRequest } = useApiRequest();
  const { setUserData } = useUserStore();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { setAuthenticated, isAuthenticated, clearAuthentication } = useAuthStore();

  const { refreshTokenMutation, logoutMutation } = useAuthQueries();
  const [tokenChecked, setTokenChecked] = useState(false);
  const [sessionExpiring, setSessionExpiring] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const token = useAuthStore((s) => s.token);
  const sessionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);
  const loggingOutRef = useRef(false);

  // Previene dobles ejecuciones en StrictMode
  const hasCheckedTokenRef = useRef(false);

  const isPublicRoute = (currentPath: string) => {
    return webRoutes.protected.find((route: any) => route.path === currentPath && route.public === true) !== undefined;
  };

  const checkToken = async () => {
    if (hasCheckedTokenRef.current) {
      logColor('warn', 'AuthProvider', 'Token check SKIPPED (already running)');
      return;
    }
    hasCheckedTokenRef.current = true;
    const currentPath = location.pathname;
    if (isPublicRoute(currentPath)) {
      setTokenChecked(true);
      hasCheckedTokenRef.current = false;
      logColor('info', 'AuthProvider', 'Public route, token check OK');
      return;
    }

    const currentToken = useAuthStore.getState().token;
    const currentTime = Date.now() / 1000;

    if (!currentToken) {
      try {
        logColor('info', 'AuthProvider', 'No token, refreshing...');
        await refreshTokenMutation.mutateAsync();
        setTokenChecked(true);
        logColor('success', 'AuthProvider', 'Token refreshed, auth ready');
      } catch {
        logColor('error', 'AuthProvider', 'Refresh failed, clearing auth');
        clearAuthentication();
        queryClient.clear();
        if (location.pathname !== webRoutes.login) {
          navigate(webRoutes.login, { replace: true });
        }
        setTokenChecked(true);
      } finally {
        hasCheckedTokenRef.current = false;
      }
      return;
    }

    // Token presente
    try {
      const decoded = jwtDecode<JWTPayload>(currentToken!);
      if (decoded.exp < currentTime) {
        logColor('warn', 'AuthProvider', 'Token expired, logging out');
        await logoutMutation.mutateAsync();
        setTokenChecked(true);
        hasCheckedTokenRef.current = false;
        return;
      }
      setTokenChecked(true);
      logColor('success', 'AuthProvider', 'Token válido, auth ready');
      hasCheckedTokenRef.current = false;
    } catch (err) {
      logColor('error', 'AuthProvider', 'Token decode failed, clearing auth');
      clearAuthentication();
      queryClient.clear();
      if (location.pathname !== webRoutes.login) {
        navigate(webRoutes.login, { replace: true });
      }
      setTokenChecked(true);
      hasCheckedTokenRef.current = false;
    }
  };

  const handleLogout = useCallback(async () => {
    if (loggingOutRef.current) return;
    loggingOutRef.current = true;
    try {
      await logoutMutation.mutateAsync();
    } catch (e) {
      logColor('error', 'AuthProvider', 'Auto logout failed', e);
    } finally {
      loggingOutRef.current = false;
      setSessionExpiring(false);
    }
  }, [logoutMutation]);

  const startSessionCountdown = useCallback(() => {
    setSessionExpiring(true);
    setCountdown(30);
    countdownRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (countdownRef.current) {
            clearInterval(countdownRef.current);
          }
          handleLogout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [handleLogout]);

  const handleStayLogged = async () => {
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
    }
    try {
      await refreshTokenMutation.mutateAsync();
    } catch (e) {
      logColor('error', 'AuthProvider', 'Refresh during countdown failed', e);
      await logoutMutation.mutateAsync();
    } finally {
      setSessionExpiring(false);
    }
  };

  useEffect(() => {
    setTokenChecked(false);
    hasCheckedTokenRef.current = false;
    checkToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  useEffect(() => {
    if (sessionTimeoutRef.current) {
      clearTimeout(sessionTimeoutRef.current);
    }
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
    }

    if (!token) {
      return;
    }

    try {
      const decoded = jwtDecode<JWTPayload>(token);
      const warningTime = decoded.exp * 1000 - 60 * 1000; // 1 min before expiry
      const delay = warningTime - Date.now();
      if (delay <= 0) {
        // Token already expired; checkToken will handle logout
        return;
      }
      sessionTimeoutRef.current = setTimeout(startSessionCountdown, delay);
    } catch (err) {
      logColor('error', 'AuthProvider', 'Failed to decode token for timeout', err);
    }

    return () => {
      if (sessionTimeoutRef.current) {
        clearTimeout(sessionTimeoutRef.current);
      }
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }
    };
  }, [token, handleLogout, startSessionCountdown]);

  const { isLoading: isLoadingUser, error: userError } = useQuery({
    queryKey: ['auth', 'user'],
    queryFn: async () => {
      logColor('info', 'AuthProvider', 'Loading user from API...');
      const response = await apiRequest<any>({
        url: apiRoutes.auth.me,
        method: 'get',
      });
      setUserData(response);
      setAuthenticated(true);
      logColor('success', 'AuthProvider', 'User loaded and authenticated');
      return response;
    },
    enabled: tokenChecked && !!useAuthStore.getState().token,
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });

  const showLoader =
    !tokenChecked || (refreshTokenMutation.isPending && !token) || isLoadingUser;

  if (showLoader) {
    logColor('info', 'AuthProvider', 'Loading...', { tokenChecked, isPending: refreshTokenMutation.isPending, isLoadingUser });
  }

  if (isAuthenticated && userError) {
    const is429Error = (userError as AxiosError<ApiErrorResponse>).response?.data.statusCode === 429;
    logColor('error', 'AuthProvider', 'Error loading user:', userError);
    let errorMessage = 'Failed to load user data.';
    if (is429Error) {
      errorMessage = 'Too many requests. Please wait 60 seconds before trying again.';
    } else {
      const formatted = formatError(userError);
      if (formatted.message && formatted.message.length > 0) {
        errorMessage = formatted.message.join(', ');
      } else if (userError instanceof Error && userError.message) {
        errorMessage = userError.message;
      }
    }
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          textAlign: 'center',
          padding: 2,
        }}
      >
        <Typography color="error" variant="h6">
          {errorMessage}
        </Typography>
      </Box>
    );
  }

  // Si todo OK, render hijos
  return (
    <>
      {showLoader && <CenteredLoader open={true} />}
      {children}
      <SessionTimeoutDialog
        open={sessionExpiring}
        countdown={countdown}
        onStayLoggedIn={handleStayLogged}
        onLogout={handleLogout}
      />
    </>
  );
};

// Move AuthContext and useAuthContext to a separate file to fix Fast Refresh warning
// src/modules/auth/context/AuthContextBase.tsx
// ---
// import { createContext, useContext } from 'react';
// export const AuthContext = createContext(null);
// export const useAuthContext = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuthContext debe usarse dentro de un AuthProvider');
//   }
//   return context;
// };
// ---
// Then import { AuthContext, useAuthContext } from './AuthContextBase';
