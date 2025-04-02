import { AxiosError } from 'axios';

type ErrorResponse = {
  message?: string | string[];
  error?: string;
  statusCode?: number;
};

export type FormattedApiError = {
  messages: string[]; // siempre un array, aunque haya un solo mensaje
  statusCode?: number;
  error?: string;
};

export const formatApiError = (error: unknown): FormattedApiError => {
  const err = error as AxiosError<ErrorResponse>;

  const rawMessage = err.response?.data?.message;
  const messages: string[] = Array.isArray(rawMessage)
    ? rawMessage
    : rawMessage
    ? [rawMessage]
    : [err.message || 'An unexpected error occurred'];

  return {
    messages,
    statusCode: err.response?.data?.statusCode,
    error: err.response?.data?.error,
  };
};
