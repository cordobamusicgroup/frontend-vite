import axios, { AxiosError } from 'axios';

type ErrorResponse = {
  message?: string | string[];
  error?: string;
  statusCode?: number;
};

export type FormattedApiError = {
  message: string[]; // siempre un array, aunque haya un solo mensaje
  statusCode?: number;
  error?: string;
};

/**
 * @deprecated Use `formatError` instead.
 */
export const formatApiError = (error: any): FormattedApiError => {
  const err = error as AxiosError<ErrorResponse>;

  const rawMessage = err.response?.data?.message;
  const message: string[] = Array.isArray(rawMessage) ? rawMessage : rawMessage ? [rawMessage] : [err.message || 'An unexpected error occurred'];
  console.log('Formatted API Error:', err);

  return {
    message: message,
    statusCode: err.response?.data?.statusCode,
    error: err.response?.data?.error,
  };
};

export const formatError = (error: any) => {
  if (axios.isAxiosError(error)) {
    return error as AxiosError;
  }
  return {
    error: error.message || 'An unexpected error occurred',
  };
};
