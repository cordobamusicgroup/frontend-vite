import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Box } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { AgGridReact } from 'ag-grid-react';
import webRoutes from '@/lib/web.routes';
import useQuickFilter from '@/hooks/useQuickFilter';
import IsBlockedChip from '../atoms/IsBlockedChip';
import GridTables from '@/components/ui/organisms/GridTables';
import SearchBoxTable from '@/components/ui/organisms/SearchBoxTable';
import DMBStatusChip from '../atoms/DMBStatusChip';
import ActionButtonsClient from '../atoms/ActionsButtonsClient';
import { ColDef } from 'ag-grid-community';
import { useClients } from '../../hooks/useClientsAdmin';
interface ClientTableProps {
  setNotification: (notification: { message: string; type: 'success' | 'error' }) => void;
}

const formatCurrency = (currencySymbol: string, value: number): string => {
  const num = Number(value);
  const s = num.toString();
  if (!s.includes('.')) return `${currencySymbol}${s}.00`;
  const [intPart, fractionPart] = s.split('.');
  const fraction = fractionPart.length === 1 ? fractionPart + '0' : fractionPart;
  return `${currencySymbol}${intPart}.${fraction}`;
};

const ListClientsTable: React.FC<ClientTableProps> = ({ setNotification }) => {
  const navigate = useNavigate();
  const { clients, deleteClients, isFetching, isMutationPending, fetchError } = useClients();
  const gridRef = useRef<AgGridReact>(null);

  const { searchTextRef, quickFilterText, applyFilter, resetFilter } = useQuickFilter(gridRef);
  const handleEdit = (client: any): void => {
    navigate(`${webRoutes.admin.clients.edit}/${client.id}`);
  };

  const handleDelete = (clientId: number): void => {
    deleteClients.mutate([clientId], {
      onSuccess: () => {
        setNotification({ message: 'Client deleted successfully', type: 'success' });
      },
      onError: (error) => {
        const message = axios.isAxiosError(error)
          ? error.response?.data?.message || 'Error deleting clients'
          : 'Unknown error occurred';
        setNotification({ message: message, type: 'error' });
      },
    });
  };

  const columns: ColDef[] = [
    { field: 'id', headerName: 'ID', filter: 'agNumberColumnFilter', width: 80, sortable: false, resizable: false },
    { field: 'clientName', headerName: 'Client Name', width: 200 },
    {
      headerName: 'Client Status',
      width: 120,
      cellRenderer: (params: any) => <IsBlockedChip isBlocked={Boolean(params.data.isBlocked)} />,
    },
    { field: 'firstName', headerName: 'First Name', width: 150 },
    { field: 'lastName', headerName: 'Last Name', width: 150 },
    { field: 'type', headerName: 'Type', width: 100 },
    // Se eliminó la columna "dmb" y se agregan nuevas columnas para cada propiedad
    {
      headerName: 'DMB Access Type',
      width: 150,
      valueGetter: (params: any) => params.data.dmb?.accessType || '',
    },
    {
      headerName: 'DMB Subclient',
      width: 200,
      valueGetter: (params: any) => params.data.dmb?.subclientName ?? '-',
    },
    {
      headerName: 'DMB Status',
      width: 150,
      cellRenderer: (params: any) => <DMBStatusChip status={params.data.dmb?.status || ''} />,
    },
    // Nueva columna para isBlocked

    {
      field: 'balanceUsd',
      headerName: 'Balance USD',
      width: 180,
      valueFormatter: (params: any) => formatCurrency('$', params.value),
    },
    {
      field: 'balanceEur',
      headerName: 'Balance EUR',
      width: 180,
      valueFormatter: (params: any) => formatCurrency('€', params.value),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      minWidth: 100,
      filter: false,
      resizable: false,
      flex: 1,
      cellRenderer: (params: any) => (
        <ActionButtonsClient onEdit={() => handleEdit(params.data)} onDelete={() => handleDelete(params.data.id)} />
      ),
    },
  ];

  const rowData =
    clients.map((apiData: any) => ({
      id: apiData.id,
      clientName: apiData.clientName,
      firstName: apiData.firstName,
      lastName: apiData.lastName,
      type: apiData.type,
      dmb: apiData.dmb, // objeto dmb con accessType, subclientName y status
      balanceUsd: apiData.balances?.find((b: any) => b.currency === 'USD')?.amount ?? 0,
      balanceEur: apiData.balances?.find((b: any) => b.currency === 'EUR')?.amount ?? 0,
      isBlocked: apiData.isBlocked, // propiedad boolean isBlocked
    })) || [];

  return (
    <Box sx={{ height: 600, width: '100%' }}>
      <SearchBoxTable searchTextRef={searchTextRef} applyFilter={applyFilter} resetFilter={resetFilter} />
      <GridTables
        ref={gridRef}
        defaultColDef={{ sortable: false }}
        columns={columns}
        rowData={rowData}
        loading={isFetching || deleteClients.isPending}
        quickFilterText={quickFilterText}
      />
    </Box>
  );
};

export default ListClientsTable;
