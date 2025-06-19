import axios, { AxiosError } from 'axios';
import { logColor } from '@/lib/log.util';
import { ApiErrorResponse } from '@/types/api';

export type FormattedApiError = {
  message: string[]; // siempre un array, aunque haya un solo mensaje
  statusCode?: number;
  error?: string;
};

/**
 * @deprecated Use `formatError` instead.
 */
export const formatApiError = (error: any): FormattedApiError => {
  const err = error as AxiosError<ApiErrorResponse>;

  const rawMessage = err.response?.data?.message;
  const message: string[] = Array.isArray(rawMessage) ? rawMessage : rawMessage ? [rawMessage] : [err.message || 'An unexpected error occurred'];
  logColor('error', 'formatApiError', err);

  return {
    message: message,
    statusCode: err.response?.data?.statusCode,
    error: err.response?.data?.error,
  };
};

export const formatError = (error: any): AxiosError<ApiErrorResponse> | { error: string } => {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    return error;
  }
  return {
    error: error?.message || 'An unexpected error occurred',
  };
};

export const getErrorMessages = (error: any): string[] => {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    const raw = error.response?.data?.message;
    if (Array.isArray(raw)) return raw;
    if (raw) return [raw];
    return [error.message];
  }
  if (typeof error?.message === 'string') return [error.message];
  if (typeof error === 'string') return [error];
  return ['An unexpected error occurred'];
};
