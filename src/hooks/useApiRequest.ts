import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/stores';
import { ApiErrorResponse } from '@/types/api';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  timeout: 30000,
});

interface ApiParams {
  url: string;
  method: 'get' | 'post' | 'put' | 'delete' | 'patch';
  data?: any;
  params?: any;
  headers?: Record<string, string>;
  isFormData?: boolean;
  requireAuth?: boolean;
  timeout?: number;
}

/**
 * useApiRequest
 *
 * Hook para realizar peticiones HTTP centralizadas usando Axios.
 *
 * Características:
 * - Añade automáticamente el token de autenticación (si requireAuth es true y existe token).
 * - Permite peticiones públicas (sin token) usando requireAuth: false.
 * - Soporta envío de datos como JSON o FormData.
 * - Permite personalizar headers y timeout por petición.
 *
 * Ejemplo de uso:
 *
 * const { apiRequest } = useApiRequest();
 *
 * Petición autenticada
 * await apiRequest({ url: '/user', method: 'get' });
 *
 * Petición pública
 * await apiRequest({ url: '/login', method: 'post', requireAuth: false });
 *
 * @returns { apiRequest } Función para realizar peticiones HTTP.
 */
export const useApiRequest = () => {
  /**
   * apiRequest
   *
   * Realiza una petición HTTP usando Axios.
   *
   * @param params Parámetros de la petición (url, method, data, etc).
   * @returns Respuesta de la API (data).
   * @throws AxiosError si la petición falla.
   */
  async function apiRequest<T = any, E = ApiErrorResponse>(params: ApiParams): Promise<T> {
    const { url, method, data, params: query, headers, isFormData = false, requireAuth = true, timeout = 30000 } = params;

    // Si requireAuth es true, intenta obtener el token del store
    const token = requireAuth ? useAuthStore.getState().token : null;

    const config: AxiosRequestConfig = {
      url,
      method,
      data,
      params: query,
      headers: {
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
      withCredentials: true,
      timeout,
    };

    try {
      const response = await api.request<T>(config);
      return response.data;
    } catch (err) {
      throw err as AxiosError<E>;
    }
  }

  return { apiRequest };
};
