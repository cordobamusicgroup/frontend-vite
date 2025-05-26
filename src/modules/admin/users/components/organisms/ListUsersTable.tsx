import { useRef } from 'react';
import { Box } from '@mui/material';
import { useNavigate } from 'react-router';
import { AgGridReact } from 'ag-grid-react';
import webRoutes from '@/lib/web.routes';
import useQuickFilter from '@/hooks/useQuickFilter';
import GridTables from '@/components/ui/organisms/GridTables';
import SearchBoxTable from '@/components/ui/organisms/SearchBoxTable';
import { ColDef } from 'ag-grid-community';
import { useClientsAdmin } from '@/modules/admin/clients/hooks/useClientsAdmin';
import { useUsersAdmin } from '../../hooks/useUsersAdmin';
import UserAdminActionButtons from '../molecules/UserAdminActionButtons';
import TableSkeletonLoader from '@/components/ui/atoms/TableSkeletonLoader';
import FailedToLoadData from '@/components/ui/molecules/FailedToLoadData';
import { useUsersQuery } from '../../hooks/useUsersQuery';

interface Props {
  setNotification: (notification: { message: string; type: 'success' | 'error' }) => void;
}

const ListUserTable: React.FC<Props> = ({ setNotification }) => {
  const navigate = useNavigate();
  const gridRef = useRef<AgGridReact>(null);
  const { mutations } = useUsersAdmin();
  const { data, error: fetchError, isPending: userFetchLoading } = useUsersQuery();
  const { clientsData, loading: clientLoading, errors: clientErrors } = useClientsAdmin();
  console.log('🟣 ListUserTable rendered');

  const { searchTextRef, quickFilterText, applyFilter, resetFilter } = useQuickFilter();

  const handleEdit = (user: any): void => {
    navigate(`${webRoutes.admin.users.edit}/${user.id}`);
  };

  if (fetchError || clientErrors.clientFetch) {
    return <FailedToLoadData secondaryText="Failed to load users data" />;
  }

  const handleDelete = async (id: number): Promise<void> => {
    await mutations.deleteUsers.mutateAsync([id], {
      onSuccess: () => {
        setNotification({ message: 'User deleted successfully', type: 'success' });
      },
      onError: (error: any) => {
        setNotification({ message: `Error deleting user: ${error.messages}`, type: 'error' });
      },
    });
  };

  const handleResendEmail = async (email: string): Promise<void> => {
    await mutations.resendWelcomeEmail.mutateAsync(email, {
      onSuccess: () => {
        setNotification({ message: 'Email sent successfully', type: 'success' });
      },
      onError: (error: any) => {
        setNotification({ message: `Error sending email: ${error.messages}`, type: 'error' });
      },
    });
  };

  const columns: ColDef[] = [
    { field: 'id', headerName: 'ID', width: 100, sortable: true, sort: 'desc' },
    { field: 'username', headerName: 'Username', width: 200 },
    { field: 'email', headerName: 'Email', width: 300 },
    { field: 'fullName', headerName: 'Full Name', width: 200 },
    {
      field: 'client',
      headerName: 'Client',
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
    { field: 'role', headerName: 'Role', width: 150 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      minWidth: 200,
      flex: 1,
      sortable: false,
      filter: false,
      resizable: false,
      cellRenderer: (params: any) => (
        <UserAdminActionButtons
          onEdit={() => handleEdit(params.data)}
          onDelete={() => handleDelete(params.data.id)}
          onResendEmail={() => {
            handleResendEmail(params.data.email);
          }}
        />
      ),
    },
  ];

  const rowData = data?.map((apiData: any) => {
    return {
      id: apiData.id,
      username: apiData.username,
      email: apiData.email,
      fullName: apiData.fullName,
      role: apiData.role,
      clientId: apiData.clientId,
    };
  });

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
      <GridTables
        ref={gridRef}
        defaultColDef={defaultColDef}
        columns={columns}
        rowData={rowData}
        loading={userFetchLoading || mutations.deleteUsers.isPending || mutations.resendWelcomeEmail.isPending}
        quickFilterText={quickFilterText}
      />
    </Box>
  );
};

export default ListUserTable;
