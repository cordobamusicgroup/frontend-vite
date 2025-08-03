import React, { useRef } from 'react';
import { Box, Tooltip, IconButton } from '@mui/material';
import FetchErrorBox from '@/components/ui/molecules/FetchErrorBox';
import DownloadIcon from '@mui/icons-material/Download';
import dayjs from 'dayjs';
import { royaltiesgrid } from '@/styles/grid-royalties';
import { FiberManualRecord as DotIcon } from '@mui/icons-material';
import GridTables from '@/components/ui/organisms/GridTables';
import { AgGridReact } from 'ag-grid-react';
import { useNotificationStore } from '@/stores';
import { useFetchReports, useDownloadReport } from '../../hooks';
import { formatError } from '@/lib/formatApiError.util';

interface ReportsTableProps {
  distributor: string;
}

const ReportsTable: React.FC<ReportsTableProps> = ({ distributor }) => {
  const { setNotification } = useNotificationStore();
  const { reportData, reportFetchLoading, reportFetchError } = useFetchReports(distributor);
  const { downloadReport } = useDownloadReport();
  const gridRef = useRef<AgGridReact>(null);

  const handleDownload = async (reportId: number): Promise<void> => {
    await downloadReport.mutateAsync(reportId.toString(), {
      onSuccess: (response) => {
        window.open(response, '_blank');
        setNotification({ message: 'Report downloaded successfully', type: 'success' });
      },
      onError: (error: any) => {
        setNotification({ message: formatError(error).message.join('\n'), type: 'error' });
      },
    });
  };

  const distributorFormatter = (distributor: string) => {
    switch (distributor) {
      case 'KONTOR':
        return 'Kontor New Media';
      case 'BELIEVE':
        return 'Believe Digital';
      default:
        return distributor;
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 80, filter: false },
    {
      field: 'reportingMonth',
      headerName: 'Reporting Month',
      sort: 'desc', // Change sorting to reportingMonth
      width: 200,
      valueFormatter: (params: any) => dayjs(params.value).format('YYYY.MM'),
    },
    { field: 'createdAt', headerName: 'Creation Date', width: 220, valueFormatter: (params: any) => dayjs(params.value).format('MMMM D, YYYY') },
    {
      field: 'distributor',
      headerName: 'Distributor',
      width: 200,
      valueFormatter: (params: any) => distributorFormatter(params.value),
    },
    { field: 'currency', headerName: 'Currency', width: 150, flex: 0 },

    {
      field: 'totalRoyalties',
      headerName: 'Total Royalties',
      width: 200,
      valueFormatter: (params: any) => {
        const currency = params.data.currency === 'EUR' ? 'EUR' : 'USD';
        const currencySymbol = currency === 'USD' ? '$' : '€';
        return `${currencySymbol}${params.value.toLocaleString('en-GB', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 20,
        })}`;
      },
    },
    {
      field: 'debitState',
      headerName: 'Debit State',
      width: 200,
      cellRenderer: (params: any) => {
        const isPaid = params.value === 'PAID';
        const color = isPaid ? '#b6c92f' : '#F5364D';
        const state = isPaid ? 'Paid' : 'Unpaid';
        const date = isPaid && params.data.paidOn ? ` (${dayjs(params.data.paidOn).format('YYYY-MM-DD')})` : '';
        return (
          <Box display="flex" gap={1} alignItems="center">
            <DotIcon sx={{ fontSize: '16px' }} style={{ color }} />
            <span>
              {state}
              {date}
            </span>
          </Box>
        );
      },
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      minWidth: 250,
      sortable: false,
      filter: false,
      resizable: false,
      cellRenderer: (params: any) => (
        <Tooltip title="Download Report">
          <IconButton onClick={() => handleDownload(params.data.id)}>
            <DownloadIcon />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  const rowData = reportData?.map((report: any) => ({
    id: report.id,
    createdAt: report.createdAt,
    updatedAt: report.updatedAt,
    currency: report.currency,
    distributor: report.distributor,
    reportingMonth: report.reportingMonth,
    totalRoyalties: report.totalRoyalties,
    debitState: report.debitState,
    paidOn: report.paidOn,
  }));

  const defaultColDef = {
    resizable: false,
    wrapText: true,
    autoHeight: true,
    filter: true,
    sortable: false,
  };

  if (reportFetchError) {
    return <FetchErrorBox message={reportFetchError.message} defaultMessage="Failed to load reports." />;
  }

  return (
    <GridTables
      theme={royaltiesgrid}
      ref={gridRef}
      columns={columns}
      rowData={rowData}
      loading={reportFetchLoading || downloadReport.isPending}
      defaultColDef={defaultColDef}
      overlayNoRowsTemplate="Reports not found"
    />
  );
};

export default ReportsTable;
