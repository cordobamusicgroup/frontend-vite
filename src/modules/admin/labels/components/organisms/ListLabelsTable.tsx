import React, { useRef } from 'react';
import { Box } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { AgGridReact } from 'ag-grid-react';
import webRoutes from '@/lib/web.routes';
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
  const { clientsData, clientFetchLoading, clientFetchError } = useClientsAdmin();
  const { labelsData, labelFetchLoading, labelFetchError, deleteLabels } = useLabelsAdmin();
  const gridRef = useRef<AgGridReact>(null);

  const { searchTextRef, quickFilterText, applyFilter, resetFilter } = useQuickFilter(gridRef);

  const handleEdit = (label: any): void => {
    navigate(`${webRoutes.admin.labels.edit}/${label.id}`);
  };

  //TODO - implement labelFetchError return

  // TODO - refactor this
  const handleDelete = async (labelId: number): Promise<void> => {
    try {
      await deleteLabels.mutateAsync([labelId]);
      setNotification({ message: `Label with ID ${labelId} deleted`, type: 'success' });
    } catch (error) {
      const message = axios.isAxiosError(error) ? error.response?.data?.message || 'Error deleting labels' : 'Unknown error occurred';
      setNotification({ message: message, type: 'error' });
    }
  };
  const columns: ColDef[] = [
    {
      field: 'id',
      headerName: 'ID',
      width: 70,
      sortable: false,
      resizable: false,
    },
    { field: 'labelName', headerName: 'Label Name', width: 400 },
    {
      field: 'client',
      headerName: 'Client Name',
      width: 300,
      cellRenderer: (params: any) => {
        // Si el valor es "loading", renderiza el componente de React con el spinner
        if (clientFetchLoading) {
          return <TableSkeletonLoader />;
        }

        const client = clientsData?.find((c: any) => c.id === params.data.clientId);
        return client ? `${client.clientName} (${client.id})` : 'Unknown Client';
      },
    },

    {
      field: 'labelStatus',
      headerName: 'Status',
      width: 180,
      filter: false,
      cellRenderer: (params: any) => <LabelStatusChip status={params.value} />,
    },
    {
      field: 'beatportStatus',
      headerName: 'Beatport Status',
      width: 180,
      filter: false,
      cellRenderer: (params: any) => <LabelSpecialStoreStatus status={params.value} />,
    },
    {
      field: 'traxsourceStatus',
      headerName: 'Traxsource Status',
      width: 180,
      filter: false,
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

  return (
    <Box sx={{ height: 600, width: '100%' }}>
      <SearchBoxTable searchTextRef={searchTextRef} applyFilter={applyFilter} resetFilter={resetFilter} />
      <GridTables ref={gridRef} defaultColDef={{ sortable: false }} columns={columns} rowData={rowData} loading={labelFetchLoading || deleteLabels.isPending} quickFilterText={quickFilterText} />
    </Box>
  );
};

export default ListLabelsTable;
