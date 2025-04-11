import React, { useRef } from 'react';
import { Box } from '@mui/material';
import dayjs from 'dayjs';
import { royaltiesgrid } from '@/styles/grid-royalties';
import { FiberManualRecord as DotIcon } from '@mui/icons-material';
import { AgGridReact } from 'ag-grid-react';
import { useTransactionsUser } from '../../hooks/useTransactionsUser';
import GridTables from '@/components/ui/organisms/GridTables';

interface TransactionsTableProps {
  setNotification: (notification: { message: string; type: 'success' | 'error' }) => void;
  currency: 'USD' | 'EUR';
}

const TransactionsTable: React.FC<TransactionsTableProps> = ({ currency }) => {
  const gridRef = useRef<AgGridReact>(null);
  const { transactionsData, transactionsFetchLoading } = useTransactionsUser(currency)

  const columns = [
    { field: 'id', headerName: 'ID', width: 80, filter: false },
    { field: 'createdAt', headerName: 'Created At', sort: 'desc', sortingOrder: ['desc'], width: 220, valueFormatter: (params: any) => dayjs(params.value).format('MMMM D, YYYY') },
    { field: 'type', headerName: 'Type', width: 150 },
    {
      field: 'debitState',
      headerName: 'Op. Type',
      width: 130,
      cellRenderer: (params: any) => {
        const isCredit = params.data.amount > 0;
        const state = isCredit ? 'Credit' : 'Debit';
        const color = isCredit ? '#4CAF50' : '#F44336';
        return (
          <Box display="flex" gap={1} alignItems="center">
            <DotIcon sx={{ fontSize: '16px' }} style={{ color }} />
            <span>{state}</span>
          </Box>
        );
      },
    },
    { field: 'description', headerName: 'Description', width: 350 },
    {
      field: 'amount',
      headerName: 'Operations',
      width: 250,
      valueFormatter: (params: any) => {
        const currencySymbol = currency === 'USD' ? '$' : '€';
        const value = params.value % 1 === 0 ? `${params.value}.00` : params.value;
        return `${currencySymbol} ${value}`;
      },
    },
    {
      field: 'balanceAmount',
      headerName: 'Balance',
      width: 250,
      valueFormatter: (params: any) => {
        const currencySymbol = currency === 'USD' ? '$' : '€';
        const value = params.value % 1 === 0 ? `${params.value}.00` : params.value;
        return `${currencySymbol} ${value}`;
      },
    },
  ];

  const defaultColDef = {
    flex: 0,
    autoHeight: true,
    resizable: false,
    wrapText: true,
    filter: true,
    sortable: false,
  };

  return (
    <GridTables
      theme={royaltiesgrid}
      height="400px"
      ref={gridRef}
      columns={columns}
      rowData={transactionsData ?? []}
      defaultColDef={defaultColDef}
      overlayNoRowsTemplate="Transactions not found"
      loading={transactionsFetchLoading}
    />
  );
};

export default TransactionsTable;
