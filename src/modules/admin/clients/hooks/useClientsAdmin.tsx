import { useState } from "react";
import axios from "axios";
import { useApiRequest } from "@/hooks/useApiRequest";
import { apiRoutes } from "@/lib/api.routes";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

type Client = any;

export const useClientsAdmin = (clientId?: string) => {
  const { apiRequest } = useApiRequest();
  const queryClient = useQueryClient();

  const [error, setError] = useState<string | null>(null);

  const clientsQueryKey = ["admin", "clients"];
  const clientQueryKey = clientId ? ["admin", "client", clientId] : null;

  const fetchClient = async () => {
    setError(null);
    try {
      const url = clientId ? `${apiRoutes.clients.root}/${clientId}` : apiRoutes.clients.root;
      return await apiRequest({ url, method: "get", requiereAuth: true });
    } catch (err) {
      const errorMessage = axios.isAxiosError(err) ? err.response?.data?.message || "Error fetching clients" : "Unknown error occurred";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const {
    data: clientData,
    refetch,
    isLoading: clientFetchLoading,
  } = useQuery({
    queryKey: clientQueryKey || clientsQueryKey,
    queryFn: fetchClient,
    enabled: !!(clientQueryKey || clientsQueryKey),
    refetchOnWindowFocus: false,
    retry: false,
  });

  const mutationHandler = async (method: "post" | "put" | "delete", url: string, data?: any) => {
    setError(null);
    try {
      return await apiRequest({ url, method, data, requiereAuth: true });
    } catch (err) {
      const errorMessage = axios.isAxiosError(err) ? err.response?.data?.message || "An error occurred" : "Unknown error occurred";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const createClientMutation = useMutation({
    mutationFn: (clientData: Client) => mutationHandler("post", apiRoutes.clients.root, clientData),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: clientsQueryKey }),
  });

  const updateClientMutation = useMutation({
    mutationFn: (clientData: Client) => {
      if (!clientId) throw new Error("Client ID is required to update client");
      return mutationHandler("put", `${apiRoutes.clients.root}/${clientId}`, clientData);
    },
    onSuccess: () => {
      if (clientQueryKey) queryClient.invalidateQueries({ queryKey: clientQueryKey });
      queryClient.invalidateQueries({ queryKey: clientsQueryKey });
    },
  });

  const deleteClientsMutation = useMutation({
    mutationFn: (ids: number[]) => mutationHandler("delete", apiRoutes.clients.root, { ids }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: clientsQueryKey }),
  });

  const clientLoading = createClientMutation.isPending || updateClientMutation.isPending || deleteClientsMutation.isPending;

  return {
    clientData,
    clientError: error,
    clientFetchLoading,
    clientLoading,
    createClient: createClientMutation.mutateAsync,
    updateClient: updateClientMutation.mutateAsync,
    deleteClients: deleteClientsMutation.mutateAsync,
    refetch,
  };
};
