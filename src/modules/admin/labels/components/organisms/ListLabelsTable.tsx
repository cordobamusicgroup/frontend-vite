import React, { useRef } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { useNavigate } from 'react-router';
import { AgGridReact } from 'ag-grid-react';
import webRoutes from '@/routes/web.routes';
import useQuickFilter from '@/hooks/useQuickFilter';
import GridTables from '@/components/ui/organisms/GridTables';
import SearchBoxTable from '@/components/ui/organisms/SearchBoxTable';
import { ColDef } from 'ag-grid-community';
import { useClientsAdmin } from '@/modules/admin/clients/hooks/useClientsAdmin';
import TableSkeletonLoader from '@/components/ui/atoms/TableSkeletonLoader';
import { useLabelsAdmin } from '../../hooks/useLabelsAdmin';
import ActionButtonsLabels from '../atoms/ActionButtonsLabels';
import LabelStatusChip from '../atoms/LabelStatusChip';
import LabelSpecialStoreStatus from '../atoms/LabelSpecialStoreStatus';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { AxiosError } from 'axios';

interface Props {
  setNotification: (notification: { message: string; type: 'success' | 'error' }) => void;
}

// ! TODO - Implement missing features
// ! TODO - Implement missing features
// ! TODO - Implement missing features
// ! TODO - Implement missing features
// ! TODO - Implement missing features

const ListLabelsTable: React.FC<Props> = ({ setNotification }) => {
  const navigate = useNavigate();
  const { clientsData, loading: clientLoading, errors: clientErrors } = useClientsAdmin();
  const { labelsData, labelFetchLoading, labelFetchError, deleteLabels } = useLabelsAdmin();
  const gridRef = useRef<AgGridReact>(null);

  const { searchTextRef, quickFilterText, applyFilter, resetFilter } = useQuickFilter();

  const handleEdit = (label: any): void => {
    navigate(`${webRoutes.admin.labels.edit}/${label.id}`);
  };

  if (clientErrors.clientFetch || labelFetchError) {
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
            Failed to load data
          </Typography>
        </Paper>
      </Box>
    );
  }

  const handleDelete = async (labelId: number): Promise<void> => {
    await deleteLabels.mutateAsync([labelId], {
      onSuccess: () => {
        setNotification({ message: 'Label deleted successfully', type: 'success' });
      },
      onError: (e: unknown) => {
        const error = e as AxiosError<{ message?: string }>;

        setNotification({ message: error.response?.data.message ?? 'An error occurred', type: 'error' });
      },
    });
  };
  const columns: ColDef[] = [
    {
      field: 'id',
      headerName: 'ID',
      width: 70,
      resizable: false,
      filter: false,
    },
    { field: 'labelName', headerName: 'Label Name', width: 400 },
    {
      field: 'client',
      headerName: 'Client Name',
      width: 300,
      valueGetter: (params: any) => {
        // Si los datos están cargando, devuelve un texto temporal
        if (clientLoading.clientFetch) {
          return 'Loading...';
        }

        const client = clientsData?.find((c: any) => c.id === params.data.clientId);
        return client ? `${client.clientName} (${client.id})` : 'Unknown Client';
      },
      cellRenderer: (params: any) => {
        // Renderiza un spinner o el valor final en la celda
        if (clientLoading.clientFetch) {
          return <TableSkeletonLoader />;
        }

        return params.value; // Usa el valor calculado por valueGetter
      },
    },

    {
      field: 'labelStatus',
      headerName: 'Status',
      width: 180,
      cellRenderer: (params: any) => <LabelStatusChip status={params.value} />,
    },
    {
      field: 'beatportStatus',
      headerName: 'Beatport Status',
      width: 180,
      cellRenderer: (params: any) => <LabelSpecialStoreStatus status={params.value} />,
    },
    {
      field: 'traxsourceStatus',
      headerName: 'Traxsource Status',
      width: 180,
      cellRenderer: (params: any) => <LabelSpecialStoreStatus status={params.value} />,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      minWidth: 100,
      sortable: false,
      filter: false,
      resizable: false,
      flex: 1,
      cellRenderer: (params: any) => <ActionButtonsLabels onEdit={() => handleEdit(params.data)} onDelete={() => handleDelete(params.data.id)} />,
    },
  ];

  const rowData = labelsData?.map((apiData: any) => ({
    id: apiData.id,
    clientId: apiData.clientId,
    labelName: apiData.name,
    labelStatus: apiData.status,
    countryId: apiData.countryId,
    labelWebsite: apiData.website,
    beatportStatus: apiData.beatportStatus,
    traxsourceStatus: apiData.traxsourceStatus,
    beatportUrl: apiData.beatportUrl,
    traxsourceUrl: apiData.traxsourceUrl,
  }));

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
      <GridTables ref={gridRef} defaultColDef={defaultColDef} columns={columns} rowData={rowData} loading={labelFetchLoading || deleteLabels.isPending} quickFilterText={quickFilterText} />
    </Box>
  );
};

export default ListLabelsTable;
