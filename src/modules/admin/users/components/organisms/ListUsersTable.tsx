import React, { useRef } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { useNavigate } from 'react-router';
import { AgGridReact } from 'ag-grid-react';
import webRoutes from '@/lib/web.routes';
import useQuickFilter from '@/hooks/useQuickFilter';
import GridTables from '@/components/ui/organisms/GridTables';
import SearchBoxTable from '@/components/ui/organisms/SearchBoxTable';
import { ColDef } from 'ag-grid-community';
import { useClientsAdmin } from '@/modules/admin/clients/hooks/useClientsAdmin';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useUsersAdmin } from '../../hooks/useUsersAdmin';
import UserAdminActionButtons from '../molecules/UserAdminActionButtons';

interface Props {
  setNotification: (notification: { message: string; type: 'success' | 'error' }) => void;
}

const ListUserTable: React.FC<Props> = ({ setNotification }) => {
  const navigate = useNavigate();
  const gridRef = useRef<AgGridReact>(null);
  const { usersData, loading, errors, mutations } = useUsersAdmin();
  const { clientsData } = useClientsAdmin();

  const { searchTextRef, quickFilterText, applyFilter, resetFilter } = useQuickFilter(gridRef);

  const handleEdit = (user: any): void => {
    navigate(`${webRoutes.admin.users.edit}/${user.id}`);
  };

  if (errors.userFetch) {
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
    { field: 'id', headerName: 'ID', width: 100, flex: 0, sortable: true, sort: 'desc' },
    { field: 'username', headerName: 'Username', width: 200 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'fullName', headerName: 'Full Name', width: 200 },
    {
      field: 'client',
      headerName: 'Client',
      width: 300,
      valueGetter: (params: any) => params.data.clientName,
    },
    { field: 'role', headerName: 'Role', width: 150 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
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

  const rowData = usersData?.map((apiData: any) => {
    const client = clientsData.find((client: any) => client.id === apiData.clientId);

    return {
      id: apiData.id,
      username: apiData.username,
      email: apiData.email,
      fullName: apiData.fullName,
      role: apiData.role,
      clientId: apiData.clientId,
      clientName: client ? `${client.clientName} (${client.id})` : 'No client found',
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
        loading={loading.userFetch || loading.deleteUsers || loading.resendWelcomeEmail}
        quickFilterText={quickFilterText}
      />
    </Box>
  );
};

export default ListUserTable;
