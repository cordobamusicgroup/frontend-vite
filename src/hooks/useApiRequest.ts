import { useState, useCallback, useRef, useEffect } from "react";
import axios, { AxiosRequestConfig, AxiosError, CancelTokenSource } from "axios";
import Cookies from "js-cookie";

// Configuración global de Axios
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  timeout: 30000, // 30 segundos de timeout por defecto
});

// Configuramos interceptores para manejar errores comunes
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Token inválido o expirado
          Cookies.remove("access_token");
          window.location.href = "/login";
          break;
      }
    }
    return Promise.reject(error);
  }
);

// Eliminamos la cache y sus constantes relacionadas

interface ApiParams {
  url: string;
  method: "get" | "post" | "put" | "delete" | "patch";
  data?: any;
  params?: any;
  headers?: any;
  isFormData?: boolean;
  requiereAuth?: boolean;
  // Eliminamos la opción de caché
  retries?: number; // Número de reintentos para peticiones fallidas
  timeout?: number; // Timeout personalizado
}

// Eliminamos la interfaz ApiError que no se usa o utilizamos para tipar las respuestas de error
interface ErrorResponse {
  message: string;
  statusCode?: number;
}

/**
 * Custom hook to make an API request using Axios with improved error handling,
 * request cancellation and automatic retries.
 *
 * @returns An object containing apiRequest function, loading state, error state, and cancel function.
 */
export const useApiRequest = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cancelTokenSourceRef = useRef<CancelTokenSource | null>(null);

  // Limpiar el cancelTokenSource cuando el componente se desmonta
  useEffect(() => {
    return () => {
      if (cancelTokenSourceRef.current) {
        cancelTokenSourceRef.current.cancel("Request cancelled due to component unmount");
      }
    };
  }, []);

  // Función para cancelar la petición actual
  const cancelRequest = useCallback(() => {
    if (cancelTokenSourceRef.current) {
      cancelTokenSourceRef.current.cancel("Request cancelled by user");
    }
  }, []);

  const apiRequest = useCallback(async <T = any>({ url, method, data, params, headers, isFormData = false, requiereAuth = true, retries = 0, timeout }: ApiParams): Promise<T> => {
    setLoading(true);
    setError(null);

    // Eliminamos toda la lógica de caché

    const token = requiereAuth ? Cookies.get("access_token") : null;
    cancelTokenSourceRef.current = axios.CancelToken.source();

    const config: AxiosRequestConfig = {
      url,
      method,
      data,
      params,
      headers: {
        "Content-Type": isFormData ? undefined : "application/json",
        ...headers,
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      withCredentials: true,
      cancelToken: cancelTokenSourceRef.current.token,
      timeout: timeout || 30000, // Timeout personalizado o por defecto
    };

    let attempts = 0;
    const executeRequest = async (): Promise<T> => {
      try {
        const response = await api.request<T>(config);

        // Eliminamos el código relacionado con el almacenamiento en caché

        return response.data;
      } catch (err) {
        if (axios.isCancel(err as any)) {
          const cancelError = "Request was cancelled";
          setError(cancelError);
          throw new Error(cancelError);
        }

        if (axios.isAxiosError(err)) {
          const axiosErr = err as AxiosError<ErrorResponse>;
          // Corregimos el acceso a message asegurándonos de que data se trate como ErrorResponse
          const errorMessage = axiosErr.response?.data?.message || (axiosErr.response?.data as any)?.message || axiosErr.message || "An error occurred";

          // Reintentar si no se han agotado los intentos y es un error del servidor
          if (retries && attempts < retries && (!axiosErr.response || axiosErr.response.status >= 500)) {
            attempts++;
            await new Promise((resolve) => setTimeout(resolve, 1000 * attempts)); // Backoff exponencial
            return executeRequest();
          }

          setError(errorMessage);
          throw err;
        }
        throw err;
      }
    };

    try {
      return await executeRequest();
    } finally {
      setLoading(false);
      cancelTokenSourceRef.current = null;
    }
  }, []);

  return { apiRequest, loading, error, cancelRequest };
};
