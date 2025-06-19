import axios from 'axios';
import { ApiErrorResponse } from '@/types/api';

export type FormattedApiError = {
  message: string[]; // always an array, even if only one message
  statusCode?: number;
  error?: string;
};

export const formatError = (error: any): FormattedApiError => {
  let messages: string[];
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    const data = error.response?.data;
    if (Array.isArray(data?.message)) {
      messages = data.message;
    } else if (typeof data?.message === 'string') {
      messages = [data.message];
    } else if (typeof error.message === 'string') {
      messages = [error.message];
    } else {
      messages = ['An unexpected error occurred'];
    }
    return {
      message: messages,
      statusCode: data?.statusCode,
      error: data?.error,
    };
  }
  if (Array.isArray(error?.message)) {
    messages = error.message;
  } else if (typeof error?.message === 'string') {
    messages = [error.message];
  } else if (typeof error === 'string') {
    messages = [error];
  } else {
    messages = ['An unexpected error occurred'];
  }
  return {
    message: messages,
    statusCode: error?.statusCode,
    error: error?.error,
  };
};
