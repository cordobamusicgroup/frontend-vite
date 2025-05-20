import { useCallback, useRef, useEffect } from 'react';
import axios, { AxiosError, AxiosRequestConfig, CancelTokenSource } from 'axios';
import { useAuthStore } from '@/stores';

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
 * Hook for making centralized HTTP requests using Axios, with support for cancellation, authentication, and token management.
 * Returns an apiRequest function for making HTTP requests.
 */
export const useApiRequest = () => {
  const cancelTokenRef = useRef<CancelTokenSource | null>(null);

  useEffect(() => {
    return () => {
      cancelTokenRef.current?.cancel('Request cancelled on unmount');
    };
  }, []);

  const apiRequest = useCallback(async <T = any, E = any>(params: ApiParams): Promise<T> => {
    const { url, method, data, params: query, headers, isFormData = false, requireAuth = true, timeout = 30000 } = params;

    const token = requireAuth ? useAuthStore.getState().token : null;
    cancelTokenRef.current = axios.CancelToken.source();

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
      cancelToken: cancelTokenRef.current.token,
      timeout,
    };

    try {
      const response = await api.request<T>(config);
      return response.data;
    } catch (err) {
      throw err as AxiosError<E>;
    } finally {
      cancelTokenRef.current = null;
    }
  }, []);

  return { apiRequest };
};
