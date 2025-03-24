import React, { useState, useEffect, type ReactNode } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router";
import { jwtDecode } from "jwt-decode";
import { AuthContext } from "./AuthContext";
import axios from "axios";
import { useApiRequest } from "../../../hooks/useApiRequest";
import { apiRoutes } from "../../../lib/api.routes";
import { useLoaderStore, useUserStore } from "../../../stores";
import { useErrorStore } from "../../../stores/error.store";
import webRoutes from "@/lib/web.routes";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Token expiration times in milliseconds
const TOKEN_EXPIRATION = {
  ACCESS: 15 * 60 * 1000, // 15 minutes
  REFRESH: 7 * 24 * 60 * 60 * 1000, // 7 days
};

/**
 * Login credentials interface
 */
interface LoginCredentials {
  username: string;
  password: string;
}

/**
 * JWT payload structure
 */
interface JWTPayload {
  sub: string;
  email: string;
  iat: number;
  exp: number;
}

/**
 * Auth API response for login
 */
interface AuthTokenResponse {
  access_token: string;
  refresh_token: string;
}

/**
 * Auth provider props
 */
interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Authentication provider component
 * Handles user authentication, token management, and related API calls
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { apiRequest } = useApiRequest();
  const { setLoading } = useLoaderStore();
  const { userData, setUserData } = useUserStore();
  const { setError: setGlobalError } = useErrorStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  /**
   * Handles invalid or expired tokens by clearing credentials and redirecting to login
   */
  const handleInvalidToken = () => {
    Cookies.remove("access_token");
    Cookies.remove("refresh_token");
    setIsAuthenticated(false);
    queryClient.clear(); // Clear all caches on logout
    navigate("/auth/login");
    setGlobalError("Your session has expired, please log in again");
  };

  /**
   * Attempts to refresh the access token using the refresh token
   * @returns {Promise<boolean>} Whether token refresh was successful
   *
   * NOTE: This function will be implemented in the future.
   */
  /* 
  const refreshToken = async (): Promise<boolean> => {
    const refreshTokenValue = Cookies.get("refresh_token");
    if (!refreshTokenValue) return false;

    try {
      const response = await apiRequest<AuthTokenResponse>({
        url: apiRoutes.auth.refreshToken,
        method: "post",
        data: { refresh_token: refreshTokenValue },
        requiereAuth: false,
      });
      
      if (response && response.access_token && response.refresh_token) {
        setCookies(response.access_token, response.refresh_token);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error refreshing token:", error);
      return false;
    }
  };
  */

  /**
   * Validates the current auth token
   * @returns {boolean} Whether the token is valid
   */
  const validateToken = () => {
    const token = Cookies.get("access_token");
    if (!token) {
      handleInvalidToken();
      return false;
    }

    try {
      const decoded = jwtDecode<JWTPayload>(token);
      const currentTime = Date.now() / 1000;

      // If token is expired
      if (decoded.exp < currentTime) {
        // Token refresh will be implemented in the future
        // For now, just handle invalid token
        handleInvalidToken();
        return false;
      }

      // Token refresh for near-expiration will be implemented later
      /* 
      if (decoded.exp - currentTime < 300) {
        refreshToken();
      }
      */

      setIsAuthenticated(true);
      return true;
    } catch (err) {
      console.error("Error decoding token:", err);
      handleInvalidToken();
      return false;
    }
  };

  /**
   * Sets authentication cookies with appropriate expiration
   * @param {string} access_token - JWT access token
   * @param {string} refresh_token - JWT refresh token
   */
  const setCookies = (access_token: string, refresh_token: string) => {
    Cookies.set("access_token", access_token, {
      expires: new Date(Date.now() + TOKEN_EXPIRATION.ACCESS),
      path: "/",
      sameSite: "strict",
    });
    Cookies.set("refresh_token", refresh_token, {
      expires: new Date(Date.now() + TOKEN_EXPIRATION.REFRESH),
      path: "/",
      sameSite: "strict",
    });
    setIsAuthenticated(true);
  };

  /**
   * Error codes for authentication errors
   */
  enum AuthErrorCode {
    USER_NOT_FOUND = 1001,
    INVALID_CREDENTIALS = 1002,
    WEAK_PASSWORD = 1012,
    INVALID_TOKEN = 1013,
    UNAUTHORIZED = 1015,
    VALIDATION_ERROR = 1016,
    CLIENT_BLOCKED = 1017,
  }

  /**
   * Handles authentication errors with appropriate user messages
   * @param {unknown} error - Error object from API call
   */
  const handleAuthError = (error: unknown) => {
    let errorMessage = "An unexpected error occurred";

    if (axios.isAxiosError(error) && error.response?.data?.code) {
      const errorCode: number = error.response.data.code;

      switch (errorCode) {
        case AuthErrorCode.USER_NOT_FOUND:
          errorMessage = "User not found";
          break;
        case AuthErrorCode.INVALID_CREDENTIALS:
          errorMessage = "Invalid username or password";
          break;
        case AuthErrorCode.WEAK_PASSWORD:
          errorMessage = "Password is too weak";
          break;
        case AuthErrorCode.INVALID_TOKEN:
          errorMessage = "Invalid or expired token";
          break;
        case AuthErrorCode.UNAUTHORIZED:
          errorMessage = "Unauthorized access";
          break;
        case AuthErrorCode.VALIDATION_ERROR:
          errorMessage = error.response?.data?.message || "Validation error";
          break;
        case AuthErrorCode.CLIENT_BLOCKED:
          errorMessage = "The client related to your user is blocked, contact us for more details.";
          break;
        default:
          errorMessage = "An unexpected error occurred";
      }
    }

    setGlobalError(errorMessage);
  };

  // Current user query with Tanstack Query
  const userQuery = useQuery({
    queryKey: ["auth", "user"],
    queryFn: async () => {
      try {
        const response = await apiRequest<any>({
          url: apiRoutes.auth.me,
          method: "get",
        });
        setUserData(response);
        return response;
      } catch (error) {
        console.error("Error fetching user data:", error);
        throw error;
      }
    },
    enabled: isAuthenticated && !userData,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      setLoading(true);
      try {
        return await apiRequest<AuthTokenResponse>({
          url: apiRoutes.auth.login,
          method: "post",
          data: credentials,
          requiereAuth: false,
        });
      } catch (err) {
        console.error("Login error:", err);
        handleAuthError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    onSuccess: (data) => {
      if (data && data.access_token && data.refresh_token) {
        setCookies(data.access_token, data.refresh_token);
        queryClient.invalidateQueries({ queryKey: ["auth", "user"] }).then(() => {
          navigate(webRoutes.backoffice.overview);
        });
      }
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      setLoading(true);
      try {
        return await apiRequest({
          url: apiRoutes.auth.logout,
          method: "post",
        });
      } catch (err) {
        console.error("Logout error:", err);
        throw err;
      } finally {
        setLoading(false);
        handleInvalidToken();
      }
    },
    onSuccess: () => {
      queryClient.clear();
    },
  });

  // Forgot password mutation
  const forgotPasswordMutation = useMutation({
    mutationFn: async (email: string) => {
      setLoading(true);
      try {
        return await apiRequest({
          url: apiRoutes.auth.forgotPassword,
          method: "post",
          data: { email },
          requiereAuth: false,
        });
      } catch (error) {
        handleAuthError(error);
        console.error("Error sending password recovery email:", error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
  });

  // Reset password mutation
  const resetPasswordMutation = useMutation({
    mutationFn: async ({ token, newPassword }: { token: string; newPassword: string }) => {
      setLoading(true);
      try {
        return await apiRequest({
          url: apiRoutes.auth.resetPassword,
          method: "post",
          data: { token, newPassword },
          requiereAuth: false,
        });
      } catch (error) {
        handleAuthError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
  });

  /**
   * Login with provided credentials
   * @param {LoginCredentials} credentials - User login credentials
   * @returns {Promise<boolean>} Success status
   */
  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      await loginMutation.mutateAsync(credentials);
      return true;
    } catch (error) {
      return false;
    }
  };

  /**
   * Logs out the current user
   */
  const logout = async () => {
    await logoutMutation.mutateAsync();
  };

  /**
   * Initiates password recovery process
   * @param {string} email - User's email
   */
  const forgotPassword = async (email: string) => {
    return forgotPasswordMutation.mutateAsync(email);
  };

  /**
   * Resets user's password with a token
   * @param {string} token - Password reset token
   * @param {string} newPassword - New password
   */
  const resetPassword = async (token: string, newPassword: string) => {
    return resetPasswordMutation.mutateAsync({ token, newPassword });
  };

  // Set up token validation check on component mount
  useEffect(() => {
    validateToken();

    // Set up periodic token validation
    const tokenCheckInterval = setInterval(() => {
      validateToken();
    }, 60000); // Check token every minute

    return () => clearInterval(tokenCheckInterval);
  }, []);

  const contextValue = {
    isAuthenticated,
    login,
    logout,
    forgotPassword,
    resetPassword,
    validateToken,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};
