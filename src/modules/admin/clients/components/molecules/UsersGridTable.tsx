import React from 'react';
import GridTables from '@/components/ui/organisms/GridTables';
import { Button } from '@mui/material';

interface UsersGridTableProps {
  users: any[];
  onEdit: (id: number) => void;
}

const UsersGridTable: React.FC<UsersGridTableProps> = ({ users, onEdit }) => {
  const columnDefs = [
    { headerName: 'Username', field: 'username', sortable: true, filter: true,  },
    { headerName: 'Email', field: 'email', sortable: true, filter: true },
    { headerName: 'Full Name', field: 'fullName', sortable: true, filter: true },
    { headerName: 'Role', field: 'role', sortable: true, filter: true },
    {
      headerName: 'Actions',
      field: 'id',
      flex: 1,
      cellRenderer: (params: any) => (
        <Button
          variant="outlined"
          size="small"
          onClick={() => onEdit(params.value)}
          sx={{ minWidth: 36, maxWidth: 60, px: 1, fontSize: 12, lineHeight: 1, height: 28, display: 'flex', justifyContent: 'center' }}
        >
          Edit
        </Button>
      ),
      sortable: false,
      filter: false,
      width: 100,
      minWidth: 100,
      maxWidth: 140,
    },
  ];

  return (
    <div style={{ width: '100%', minWidth: 0 }}>
      <GridTables columns={columnDefs} rowData={users} height="300px" width="100%" defaultColDef={{ resizable: false }} />
    </div>
  );
};

export default UsersGridTable;
