import React, { useCallback, useEffect, useRef, useState } from "react";
import { Box, Button, IconButton, InputAdornment, Menu, MenuItem, Skeleton, TextField, Typography } from "@mui/material";
import axios from "axios";
import { Form } from "react-hook-form";
import { MoreVert, Search } from "@mui/icons-material";
import { useNavigate } from "react-router";
import { AgGridReact } from "ag-grid-react";
import webRoutes from "@/lib/web.routes";
import useQuickFilter from "@/hooks/useQuickFilter";
import { useClientsAdmin } from "../../hooks/useClientsAdmin";
import IsBlockedChip from "../atoms/IsBlockedChip";
import GridTables from "@/components/ui/organisms/GridTables";
import SearchBoxTable from "@/components/ui/organisms/SearchBoxTable";
import DMBStatusChip from "../atoms/DMBStatusChip";
import ActionButtonsClient from "../atoms/ActionsButtonsClient";

interface ClientTableProps {
  setNotification: (notification: { message: string; type: "success" | "error" }) => void;
}

const formatCurrency = (currencySymbol: string, value: number): string => {
  const num = Number(value);
  const s = num.toString();
  if (!s.includes(".")) return `${currencySymbol}${s}.00`;
  const [intPart, fractionPart] = s.split(".");
  const fraction = fractionPart.length === 1 ? fractionPart + "0" : fractionPart;
  return `${currencySymbol}${intPart}.${fraction}`;
};

const ClientTable: React.FC<ClientTableProps> = ({ setNotification }) => {
  const navigate = useNavigate();
  const { clientData = [], clientFetchLoading, deleteClients, clientError, clientLoading } = useClientsAdmin();
  const gridRef = useRef<AgGridReact>(null);

  const { searchTextRef, quickFilterText, applyFilter, resetFilter } = useQuickFilter(gridRef);
  const handleEdit = (client: any): void => {
    navigate(`${webRoutes.admin.clients.edit}/${client.id}`);
  };

  const handleDelete = async (clientId: number): Promise<void> => {
    if (await deleteClients([clientId])) {
      setNotification({ message: "Client deleted successfully", type: "success" });
    }
  };

  useEffect(() => {
    if (clientError) {
      setNotification({ message: clientError, type: "error" });
    }
  }, [clientError, setNotification]);

  const columns = [
    { field: "id", headerName: "ID", filter: "agNumberColumnFilter", width: 80, sortable: false, resizable: false },
    { field: "clientName", headerName: "Client Name", width: 200 },
    {
      headerName: "Client Status",
      width: 120,
      cellRenderer: (params: any) => <IsBlockedChip isBlocked={Boolean(params.data.isBlocked)} />,
    },
    { field: "firstName", headerName: "First Name", width: 150 },
    { field: "lastName", headerName: "Last Name", width: 150 },
    { field: "type", headerName: "Type", width: 100 },
    // Se eliminó la columna "dmb" y se agregan nuevas columnas para cada propiedad
    {
      headerName: "DMB Access Type",
      width: 150,
      valueGetter: (params: any) => params.data.dmb?.accessType || "",
    },
    {
      headerName: "DMB Subclient",
      width: 200,
      valueGetter: (params: any) => params.data.dmb?.subclientName ?? "-",
    },
    {
      headerName: "DMB Status",
      width: 150,
      cellRenderer: (params: any) => <DMBStatusChip status={params.data.dmb?.status || ""} />,
    },
    // Nueva columna para isBlocked

    {
      field: "balanceUsd",
      headerName: "Balance USD",
      width: 180,
      valueFormatter: (params: any) => formatCurrency("$", params.value),
    },
    {
      field: "balanceEur",
      headerName: "Balance EUR",
      width: 180,
      valueFormatter: (params: any) => formatCurrency("€", params.value),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      minWidth: 100,
      sortable: false,
      filter: false,
      resizable: false,
      flex: 1,
      cellRenderer: (params: any) => <ActionButtonsClient onEdit={() => handleEdit(params.data)} onDelete={() => handleDelete(params.data.id)} />,
    },
  ];

  const rowData = clientData.map((client: any) => ({
    id: client.id,
    clientName: client.clientName,
    firstName: client.firstName,
    lastName: client.lastName,
    type: client.type,
    dmb: client.dmb, // objeto dmb con accessType, subclientName y status
    balanceUsd: client.balances?.find((b: any) => b.currency === "USD")?.amount ?? 0,
    balanceEur: client.balances?.find((b: any) => b.currency === "EUR")?.amount ?? 0,
    isBlocked: client.isBlocked, // propiedad boolean isBlocked
  }));

  return (
    <Box sx={{ height: 600, width: "100%" }}>
      <SearchBoxTable searchTextRef={searchTextRef} applyFilter={applyFilter} resetFilter={resetFilter} />
      <GridTables ref={gridRef} columns={columns} rowData={rowData} loading={clientFetchLoading || clientLoading} quickFilterText={quickFilterText} />
    </Box>
  );
};

export default ClientTable;
