import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { apiRoutes } from "@/lib/api.routes";
import { useApiRequest } from "@/hooks/useApiRequest";

/**
 * Hook para gestionar la obtención y mutación de clientes.
 * Si se proporciona un `clientId`, se obtiene un único cliente;
 * de lo contrario, se obtienen todos los clientes.
 *
 * @param {string} [clientId] - ID del cliente a obtener (opcional).
 * @returns {object} Objeto con los datos, estados de carga/error y funciones de mutación.
 */
export const useClients = (clientId?: string) => {
  const { apiRequest } = useApiRequest();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  // Determinar la clave de la consulta según se requiera un cliente único o todos los clientes
  const queryKey = clientId ? ["client", clientId] : ["clients"];

  /**
   * Función para obtener clientes.
   * Si se proporciona `clientId`, obtiene el cliente por ID; de lo contrario, obtiene todos los clientes.
   */
  const fetchClients = async () => {
    if (clientId) {
      const response = await apiRequest({
        url: `${apiRoutes.clients.root}/${clientId}`,
        method: "get",
        requiereAuth: true,
      });
      return response;
    } else {
      const response = await apiRequest({
        url: apiRoutes.clients.root,
        method: "get",
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
    queryFn: fetchClients,
    retry: false,
    refetchOnWindowFocus: false,
  });

  // Manejo de errores en la consulta
  useEffect(() => {
    if (queryError) {
      const message = axios.isAxiosError(queryError) ? queryError.response?.data?.message || "Error al obtener los datos" : "Ocurrió un error desconocido";
      setError(message);
    }
  }, [queryError]);

  /**
   * Mutación para crear un nuevo cliente.
   */
  const createClient = useMutation({
    mutationFn: (newClient: any) =>
      apiRequest({
        url: apiRoutes.clients.root,
        method: "post",
        requiereAuth: true,
        data: newClient,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
    onError: (err: unknown) => {
      const message = axios.isAxiosError(err) ? err.response?.data?.message || "Error al crear el cliente" : "Ocurrió un error desconocido";
      setError(message);
    },
  });

  /**
   * Mutación para actualizar un cliente existente.
   */
  const updateClient = useMutation({
    mutationFn: ({ clientId, clientData }: { clientId: string; clientData: any }) =>
      apiRequest({
        url: `${apiRoutes.clients.root}/${clientId}`,
        method: "put",
        requiereAuth: true,
        data: clientData,
      }),
    onSuccess: (_, { clientId }) => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      queryClient.invalidateQueries({ queryKey: ["client", clientId] });
    },
    onError: (err: unknown) => {
      const message = axios.isAxiosError(err) ? err.response?.data?.message || "Error al actualizar el cliente" : "Ocurrió un error desconocido";
      setError(message);
    },
  });

  /**
   * Mutación para eliminar uno o varios clientes.
   */
  const deleteClients = useMutation({
    mutationFn: (ids: number[]) =>
      apiRequest({
        url: apiRoutes.clients.root,
        method: "delete",
        requiereAuth: true,
        data: { ids },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
    onError: (err: unknown) => {
      const message = axios.isAxiosError(err) ? err.response?.data?.message || "Error al eliminar clientes" : "Ocurrió un error desconocido";
      setError(message);
    },
  });

  // Computar un estado que indique si alguna mutación está en curso
  const isMutationPending = useMemo(() => {
    return createClient.isPending || updateClient.isPending || deleteClients.isPending;
  }, [createClient.isPending, updateClient.isPending, deleteClients.isPending]);

  return {
    // Si se consulta un único cliente, se retorna en "client"; de lo contrario, en "clients".
    client: clientId ? data : undefined,
    clients: clientId ? undefined : data,
    isFetching,
    fetchError: error,
    createClient,
    updateClient,
    deleteClients,
    isMutationPending,
  };
};
