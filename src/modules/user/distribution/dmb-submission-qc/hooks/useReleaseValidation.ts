import { useState } from 'react';
import { useApiRequest } from '@/hooks/useApiRequest';
import { ValidationApiResponse, AlbumValidationResult } from '../types/validation.types';

export const useReleaseValidation = () => {
  const { apiRequest } = useApiRequest();
  const [isValidating, setIsValidating] = useState(false);
  const [validationData, setValidationData] = useState<AlbumValidationResult | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const validateRelease = async (productCode: string): Promise<AlbumValidationResult | null> => {
    setIsValidating(true);
    setValidationError(null);
    setValidationData(null);

    try {
      const response = await apiRequest<ValidationApiResponse>({
        url: '/external/dmb-api/albums/ready-for-qc',
        method: 'get',
        params: { productCode },
        requireAuth: true,
      });

      if (response.success && response.data) {
        setValidationData(response.data);
        return response.data;
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to validate release';
      setValidationError(errorMessage);
      return null;
    } finally {
      setIsValidating(false);
    }
  };

  const clearValidation = () => {
    setValidationData(null);
    setValidationError(null);
  };

  return {
    validateRelease,
    clearValidation,
    isValidating,
    validationData,
    validationError,
  };
};
