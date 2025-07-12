import React from 'react';
import GridTables from '@/components/ui/organisms/GridTables';
import { Button } from '@mui/material';
import { ColDef } from 'ag-grid-community';

interface UsersGridTableProps {
  users: any[];
  onEdit: (id: number) => void;
}

const UsersGridTable: React.FC<UsersGridTableProps> = ({ users, onEdit }) => {
  const columnDefs: ColDef[] = [
    { headerName: 'Username', field: 'username', width: 200 },
    { headerName: 'Email', field: 'email', width: 300 },
    { headerName: 'Full Name', field: 'fullName', width: 300 },
    { headerName: 'Role', field: 'role', width: 150 },
    {
      headerName: 'Actions',
      field: 'id',
      flex: 1,
      cellRenderer: (params: any) => (
        <Button variant="outlined" size="small" onClick={() => onEdit(params.value)} sx={{ px: 1, py: 0.2, my: 0.5 }}>
          Edit
        </Button>
      ),
      sortable: false,
      filter: false,
    },
  ];

  return (
    <div style={{ width: '100%', minWidth: 0 }}>
      <GridTables columns={columnDefs} rowData={users} height="300px" width="100%" defaultColDef={{ resizable: false, filter: true, sortable: true }} />
    </div>
  );
};

export default UsersGridTable;
