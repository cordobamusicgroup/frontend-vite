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

interface LoginCredentials {
  username: string;
  password: string;
}

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
  const { apiRequest } = useApiRequest();
  const { setLoading } = useLoaderStore();
  const { userData, setUserData } = useUserStore();
  const { setError: setGlobalError } = useErrorStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Función auxiliar para manejar tokens inválidos
  const handleInvalidToken = () => {
    Cookies.remove("access_token");
    Cookies.remove("refresh_token");
    setIsAuthenticated(false);
    queryClient.clear(); // Limpiar todas las cachés al cerrar sesión
    navigate("/auth/login");
  };

  // Validar el token utilizando jwt-decode
  const validateToken = () => {
    const token = Cookies.get("access_token");
    if (!token) {
      handleInvalidToken();
      return false;
    }

    try {
      const decoded = jwtDecode<JWTPayload>(token);
      const currentTime = Date.now() / 1000;
      if (decoded.exp < currentTime) {
        // Token expirado
        handleInvalidToken();
        return false;
      }
      setIsAuthenticated(true);
      return true;
    } catch (err) {
      console.error("Error al decodificar el token:", err);
      handleInvalidToken();
      return false;
    }
  };

  // Función para establecer las cookies de autenticación
  const setCookies = (access_token: string, refresh_token: string) => {
    Cookies.set("access_token", access_token, {
      expires: new Date(Date.now() + 15 * 60 * 1000), // 15 minutos
      path: "/",
      sameSite: "strict",
    });
    Cookies.set("refresh_token", refresh_token, {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 días
      path: "/",
      sameSite: "strict",
    });
    setIsAuthenticated(true);
  };

  // Función auxiliar para manejar errores de autenticación
  const handleAuthError = (error: unknown) => {
    let errorMessage = "An unexpected error occurred";
    if (axios.isAxiosError(error)) {
      const errorCode = error.response?.data?.code;
      switch (errorCode) {
        case 1001:
          errorMessage = "User not found";
          break;
        case 1002:
          errorMessage = "Invalid username or password";
          break;
        case 1012:
          errorMessage = "Password is too weak";
          break;
        case 1013:
          errorMessage = "Invalid or expired token";
          break;
        case 1015:
          errorMessage = "Unauthorized access";
          break;
        case 1016:
          errorMessage = error.response?.data?.message || "Validation error";
          break;
        case 1017:
          errorMessage = "The client related to your user is blocked, contact us for more details.";
          break;
        default:
          errorMessage = "An unexpected error occurred";
      }
    }
    setGlobalError(errorMessage);
  };

  // Usuario actual con Tanstack Query
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
        console.error("Error al obtener datos del usuario:", error);
        throw error;
      }
    },
    enabled: isAuthenticated && !userData,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  // Mutación para login
  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      setLoading(true);
      try {
        return await apiRequest<{ access_token: string; refresh_token: string }>({
          url: apiRoutes.auth.login,
          method: "post",
          data: credentials,
          requiereAuth: false,
        });
      } catch (err) {
        console.error("Error en el login:", err);
        handleAuthError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    onSuccess: (data) => {
      if (data && data.access_token && data.refresh_token) {
        setCookies(data.access_token, data.refresh_token);
        queryClient.invalidateQueries({ queryKey: ["auth", "user"] });
        navigate(webRoutes.backoffice.overview);
      }
    },
  });

  // Mutación para logout
  const logoutMutation = useMutation({
    mutationFn: async () => {
      setLoading(true);
      try {
        return await apiRequest({
          url: apiRoutes.auth.logout,
          method: "post",
        });
      } catch (err) {
        console.error("Error durante el logout:", err);
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

  // Mutación para recuperar contraseña
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
        console.error("Error al enviar el correo de recuperación de contraseña:", error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
  });

  // Mutación para restablecer contraseña
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

  // Funciones wrapper para exponer en el contexto
  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      await loginMutation.mutateAsync(credentials);
      return true;
    } catch (error) {
      return false;
    }
  };

  const logout = async () => {
    await logoutMutation.mutateAsync();
  };

  const forgotPassword = async (email: string) => {
    return forgotPasswordMutation.mutateAsync(email);
  };

  const resetPassword = async (token: string, newPassword: string) => {
    return resetPasswordMutation.mutateAsync({ token, newPassword });
  };

  // Al montar el componente, validar el token
  useEffect(() => {
    validateToken();
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
