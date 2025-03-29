import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { apiRoutes } from '@/lib/api.routes';
import { useApiRequest } from '@/hooks/useApiRequest';

/**
 * Hook para gestionar la obtención y mutación de clientes.
 * Si se proporciona un `clientId`, se obtiene un único cliente;
 * de lo contrario, se obtienen todos los clientes.
 *
 * @param {string} [labelId] - ID del cliente a obtener (opcional).
 * @returns {object} Objeto con los datos, estados de carga/error y funciones de mutación.
 */
export const useLabelsAdmin = (labelId?: string) => {
  const { apiRequest } = useApiRequest();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  // Determinar la clave de la consulta según se requiera un cliente único o todos los clientes
  const queryKey = labelId ? ['label', labelId] : ['labels'];

  /**
   * Función para obtener clientes.
   * Si se proporciona `clientId`, obtiene el cliente por ID; de lo contrario, obtiene todos los clientes.
   */
  const fetchLabels = async () => {
    if (labelId) {
      const response = await apiRequest({
        url: `${apiRoutes.labels.root}/${labelId}`,
        method: 'get',
        requiereAuth: true,
      });
      return response;
    } else {
      const response = await apiRequest({
        url: apiRoutes.labels.root,
        method: 'get',
        requiereAuth: true,
      });
      return response;
    }
  };

  // Hook de React Query para la consulta
  const {
    data,
    isLoading: isFetching,
    isError: hasFetchError,
    error: queryError,
  } = useQuery({
    queryKey,
    queryFn: fetchLabels,
    retry: false,
    refetchOnWindowFocus: false,
  });

  // Manejo de errores en la consulta
  useEffect(() => {
    if (queryError) {
      const message = axios.isAxiosError(queryError)
        ? queryError.response?.data?.message || 'Error on fetching labels'
        : 'Unknown error occurred';
      setError(message);
    }
  }, [queryError]);

  /**
   * Mutación para crear un nuevo cliente.
   */
  const createLabel = useMutation({
    mutationFn: (newLabel: any) =>
      apiRequest({
        url: apiRoutes.labels.root,
        method: 'post',
        requiereAuth: true,
        data: newLabel,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['labels'] });
    },
    onError: (err: unknown) => {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.message || 'Error on creating label'
        : 'Unknown error occurred';
      setError(message);
    },
  });

  /**
   * Mutación para actualizar un cliente existente.
   */
  const updateLabel = useMutation({
    mutationFn: (labelData: any) =>
      apiRequest({
        url: `${apiRoutes.labels.root}/${labelId}`,
        method: 'put',
        requiereAuth: true,
        data: labelData,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['labels'] });
      queryClient.invalidateQueries({ queryKey: ['label', labelId] });
    },
    onError: (err: unknown) => {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.message || 'Error updating label'
        : 'Unknown error occurred';
      setError(message);
    },
  });

  /**
   * Mutación para eliminar uno o varios clientes.
   */
  const deleteLabels = useMutation({
    mutationFn: (ids: number[]) =>
      apiRequest({
        url: apiRoutes.labels.root,
        method: 'delete',
        requiereAuth: true,
        data: { ids },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['labels'] });
    },
    onError: (err: unknown) => {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.message || 'Error deleting labels'
        : 'Unknown error occurred';
      setError(message);
    },
  });

  // Computar un estado que indique si alguna mutación está en curso
  const isMutationPending = useMemo(() => {
    return createLabel.isPending || updateLabel.isPending || deleteLabels.isPending;
  }, [createLabel.isPending, updateLabel.isPending, deleteLabels.isPending]);

  return {
    // Si se consulta un único cliente, se retorna en "client"; de lo contrario, en "clients".
    label: labelId ? data : undefined,
    labels: labelId ? undefined : data,
    isFetching,
    fetchError: error,
    createLabel: createLabel,
    updateLabel: updateLabel,
    deleteLabels: deleteLabels,
    isMutationPending,
  };
};
