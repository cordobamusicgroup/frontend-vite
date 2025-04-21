import { useQuery } from '@tanstack/react-query';
import { useApiRequest } from './useApiRequest';
import { apiRoutes } from '@/lib/api.routes';

/**
 * Hook to get the list of countries from the API.
 * Returns: { countries, countriesLoading, countriesError }
 */
export const useCountries = () => {
  const { apiRequest } = useApiRequest();

  const fetchCountries = async () => {
    const response = await apiRequest({
      url: apiRoutes.countries,
      method: 'get',
      requireAuth: true,
    });
    return response;
  };

  const {
    data,
    error: countriesError,
    isLoading: countriesLoading,
  } = useQuery({
    queryKey: ['countries'],
    queryFn: fetchCountries,
    refetchOnWindowFocus: false, // similar a revalidateOnFocus: false
    retry: false, // similar a shouldRetryOnError: false
  });

  return {
    countries: data,
    countriesLoading, // Aquí se usa `loading` en lugar de `isLoading`
    countriesError,
  };
};
