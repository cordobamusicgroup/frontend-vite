import React, { useState, useCallback, useEffect, type ReactNode } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router";
import { jwtDecode } from "jwt-decode";
import { AuthContext } from "./AuthContext";
import axios from "axios";
import { useApiRequest } from "../../../hooks/useApiRequest";
import { apiRoutes } from "../../../lib/api.routes";
import { useLoaderStore, useUserStore } from "../../../stores";
import { useErrorStore } from "../../../stores/error.store";
import routes from "@/lib/routes";

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

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Función auxiliar para manejar tokens inválidos
  const handleInvalidToken = useCallback(() => {
    Cookies.remove("access_token");
    Cookies.remove("refresh_token");
    setIsAuthenticated(false);
    navigate("/auth/login");
  }, [navigate]);

  // Validar el token utilizando jwt-decode
  const validateToken = useCallback(() => {
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
  }, [handleInvalidToken]);

  // Función para establecer las cookies de autenticación
  const setCookies = useCallback((access_token: string, refresh_token: string) => {
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
  }, []);

  // Función auxiliar para manejar errores de autenticación
  const handleAuthError = useCallback(
    (error: unknown) => {
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
    },
    [setGlobalError]
  );

  // Función de login: únicamente se encarga de autenticarse
  const login = useCallback(
    async (credentials: LoginCredentials): Promise<boolean> => {
      setLoading(true);
      try {
        const response = await apiRequest<{ access_token: string; refresh_token: string }>({
          url: apiRoutes.api.auth.login,
          method: "post",
          data: credentials,
          requiereAuth: false,
        });

        if (response && response.access_token && response.refresh_token) {
          setCookies(response.access_token, response.refresh_token);
          navigate(routes.web.backoffice.overview);
          return true;
        }
        return false;
      } catch (err) {
        console.error("Error en el login:", err); // Ensure this line logs the error
        handleAuthError(err);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [apiRequest, setCookies, setLoading, handleAuthError]
  );

  // Función de logout: cierra sesión y limpia las cookies
  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await apiRequest({
        url: apiRoutes.api.auth.logout,
        method: "post",
      });
    } catch (err) {
      console.error("Error durante el logout:", err);
    } finally {
      handleInvalidToken();
      setLoading(false);
    }
  }, [apiRequest, setLoading, handleInvalidToken]);

  // Función para obtener los datos del usuario a partir de auth.me y guardarlos en Zustand
  const fetchUserData = useCallback(async () => {
    try {
      const response = await apiRequest<any>({
        url: apiRoutes.api.auth.me,
        method: "get",
      });
      setUserData(response);
    } catch (error) {
      console.error("Error al obtener datos del usuario:", error);
    }
  }, [apiRequest, setUserData]);

  // Al montar el componente, validar el token y obtener datos del usuario si es necesario
  useEffect(() => {
    const isValid = validateToken();
    if (isValid && !userData) {
      fetchUserData();
    }
  }, [validateToken, fetchUserData, userData]);

  const contextValue = {
    isAuthenticated,
    login,
    logout,
    validateToken,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};
