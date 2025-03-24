import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import axios from "axios";
import { apiRoutes } from "@/lib/api.routes";
import { useApiRequest } from "@/hooks/useApiRequest";

type Client = any; // Reemplaza con el tipo real si lo tienes

const fetchAllClients = async (apiRequest: any) => {
  const response = await apiRequest({
    url: apiRoutes.clients.root,
    method: "get",
    requiereAuth: true,
  });
  return response;
};

const fetchClientById = async (apiRequest: any, clientId: string) => {
  const response = await apiRequest({
    url: `${apiRoutes.clients.root}/${clientId}`,
    method: "get",
    requiereAuth: true,
  });
  return response;
};

export const useClients = () => {
  const { apiRequest } = useApiRequest();
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const {
    data: clients,
    isLoading: isFetchingClients,
    isError: hasFetchError,
    error: queryError,
  } = useQuery({
    queryKey: ["clients"],
    queryFn: () => fetchAllClients(apiRequest),
    retry: false,
    refetchOnWindowFocus: false,
  });

  // Handle query error using useEffect
  useEffect(() => {
    if (queryError) {
      const message = axios.isAxiosError(queryError) ? queryError.response?.data?.message || "Error fetching clients" : "Unknown error occurred";
      setError(message);
    }
  }, [queryError]);

  const createClient = useMutation({
    mutationFn: (newClient: Client) =>
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
      const message = axios.isAxiosError(err) ? err.response?.data?.message || "Error creating client" : "Unknown error occurred";
      setError(message);
    },
  });

  const updateClient = useMutation({
    mutationFn: ({ clientId, clientData }: { clientId: string; clientData: Client }) =>
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
      const message = axios.isAxiosError(err) ? err.response?.data?.message || "Error updating client" : "Unknown error occurred";
      setError(message);
    },
  });

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
      const message = axios.isAxiosError(err) ? err.response?.data?.message || "Error deleting clients" : "Unknown error occurred";
      setError(message);
    },
  });

  return {
    clients,
    isFetchingClients,
    fetchError: error,
    createClient,
    updateClient,
    deleteClients,
  };
};

export const useClient = (clientId: string) => {
  const { apiRequest } = useApiRequest();
  const [error, setError] = useState<string | null>(null);

  const {
    data: client,
    isLoading: isFetchingClient,
    isError: hasFetchError,
    error: queryError,
  } = useQuery({
    queryKey: ["client", clientId],
    queryFn: () => fetchClientById(apiRequest, clientId),
    enabled: !!clientId,
    retry: false,
    refetchOnWindowFocus: false,
  });

  // Handle query error using useEffect
  useEffect(() => {
    if (queryError) {
      const message = axios.isAxiosError(queryError) ? queryError.response?.data?.message || "Error fetching client" : "Unknown error occurred";
      setError(message);
    }
  }, [queryError]);

  return {
    client,
    isFetchingClient,
    fetchError: error,
  };
};
