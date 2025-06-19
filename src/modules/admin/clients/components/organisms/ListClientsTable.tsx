import React, { useRef } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useNavigate } from 'react-router';
import { AgGridReact } from 'ag-grid-react';
import webRoutes from '@/lib/web.routes';
import useQuickFilter from '@/hooks/useQuickFilter';
import ClientStatusChip from '../atoms/ClientStatusChip';
import GridTables from '@/components/ui/organisms/GridTables';
import SearchBoxTable from '@/components/ui/organisms/SearchBoxTable';
import DMBStatusChip from '../atoms/DMBStatusChip';
import { ColDef } from 'ag-grid-community';
import { useClientsAdmin } from '../../hooks/useClientsAdmin';
import ActionButtonsClient from '../atoms/ActionsButtonsClient';
import { useNotificationStore } from '@/stores';
import { formatError } from '@/lib/formatApiError.util';
interface ClientTableProps {
  setNotification: (notification: { message: string; type: 'success' | 'error' }) => void;
}

const formatCurrency = (currencySymbol: string, value: number): string => {
  const num = Number(value);
  const s = num.toString();
  if (!s.includes('.')) return `${currencySymbol}${s}.00`;
  const [intPart, fractionPart] = s.split('.');
  const fraction = (fractionPart ?? '').length === 1 ? (fractionPart ?? '') + '0' : fractionPart ?? '';
  return `${currencySymbol}${intPart}.${fraction}`;
};

const ListClientsTable: React.FC<ClientTableProps> = () => {
  const navigate = useNavigate();
  const { clientsData, loading, mutations, errors } = useClientsAdmin();
  const gridRef = useRef<AgGridReact>(null);
  const { setNotification } = useNotificationStore();

  const { searchTextRef, quickFilterText, applyFilter, resetFilter } = useQuickFilter();
  const handleEdit = (client: any): void => {
    navigate(`${webRoutes.admin.clients.edit}/${client.id}`);
  };

  if (errors.clientFetch) {
    return (
      <Box
        sx={{
          width: '100%',
          mx: 'auto',
          mt: 1,
          textAlign: 'center',
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: 5,
            borderRadius: 3,
            backgroundColor: (theme) => (theme.palette.mode === 'light' ? 'rgba(244, 67, 54, 0.05)' : 'rgba(244, 67, 54, 0.1)'),
          }}
        >
          <ErrorOutlineIcon sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />

          <Typography variant="h5" color="error.main" gutterBottom>
            Oops! Something went wrong
          </Typography>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {errors.clientFetch.message || 'Failed to load client data.'}
          </Typography>
        </Paper>
      </Box>
    );
  }

  const handleDelete = async (clientId: number): Promise<void> => {
    mutations.deleteClients.mutateAsync([clientId], {
      onSuccess: () => {
        setNotification({ message: `Client with ID ${clientId} deleted successfully`, type: 'success' });
      },
      onError: (error: any) => {
        setNotification({ message: formatError(error).message.join('\n'), type: 'error' });
      },
    });
  };

  const columns: ColDef[] = [
    {
      field: 'id',
      headerName: 'ID',
      filter: false,
      sortable: true,
      width: 80,
      sort: 'asc',
    },
    { field: 'clientName', headerName: 'Client Name', width: 200 },
    {
      headerName: 'Client Status',
      width: 200,
      field: 'status',
      valueGetter: (params: any) => params.data.status,
      cellRenderer: (params: any) => <ClientStatusChip status={params.data.status} />,
    },
    { field: 'firstName', headerName: 'First Name', width: 200 },
    { field: 'lastName', headerName: 'Last Name', width: 200 },
    { field: 'type', headerName: 'Type', width: 100 },
    // Se eliminó la columna "dmb" y se agregan nuevas columnas para cada propiedad
    {
      headerName: 'DMB Access Type',
      width: 200,
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
    {
      field: 'balanceUsd',
      headerName: 'Balance USD',
      width: 180,
      valueGetter: (params: any) => params.data.balanceUsd,
      valueFormatter: (params: any) => formatCurrency('$', params.value),
    },
    {
      field: 'balanceUsdRetain',
      headerName: 'Retained USD',
      width: 180,
      valueGetter: (params: any) => params.data.balanceUsdRetain,
      valueFormatter: (params: any) => formatCurrency('$', params.value),
    },
    {
      field: 'balanceEur',
      headerName: 'Balance EUR',
      width: 180,
      valueGetter: (params: any) => params.data.balanceEur,
      valueFormatter: (params: any) => formatCurrency('€', params.value),
    },
    {
      field: 'balanceEurRetain',
      headerName: 'Retained EUR',
      width: 180,
      valueGetter: (params: any) => params.data.balanceEurRetain,
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
      cellRenderer: (params: any) => <ActionButtonsClient onEdit={() => handleEdit(params.data)} onDelete={() => handleDelete(params.data.id)} />,
    },
  ];

  const rowData =
    clientsData?.map((apiData: any) => {
      const usd = apiData.balances?.find((b: any) => b.currency === 'USD') || {};
      const eur = apiData.balances?.find((b: any) => b.currency === 'EUR') || {};
      return {
        id: apiData.id,
        clientName: apiData.clientName,
        firstName: apiData.firstName,
        lastName: apiData.lastName,
        type: apiData.type,
        dmb: apiData.dmb, // objeto dmb con accessType, subclientName y status
        balanceUsd: usd.amount ?? 0,
        balanceUsdRetain: usd.amountRetain ?? 0,
        balanceEur: eur.amount ?? 0,
        balanceEurRetain: eur.amountRetain ?? 0,
        status: apiData.status, // nuevo campo desde la API
      };
    }) || [];

  const defaultColDef: ColDef = {
    wrapText: true,
    autoHeight: true,
    filter: true,
    sortable: true,
    resizable: false,
  };

  return (
    <Box sx={{ height: 600, width: '100%' }}>
      <SearchBoxTable searchTextRef={searchTextRef} applyFilter={applyFilter} resetFilter={resetFilter} />
      <GridTables ref={gridRef} defaultColDef={defaultColDef} columns={columns} rowData={rowData} loading={loading.clientFetch || loading.deleteClients} quickFilterText={quickFilterText} />
    </Box>
  );
};

export default ListClientsTable;
