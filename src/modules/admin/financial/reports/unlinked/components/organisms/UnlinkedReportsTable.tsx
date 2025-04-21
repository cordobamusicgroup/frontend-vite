import React, { useRef, useState } from 'react';
import { Box, Button } from '@mui/material';
import { Refresh } from '@mui/icons-material';
import '@/styles/ag-grid.css';
import SearchBoxTable from '@/components/ui/organisms/SearchBoxTable';
import GridTables from '@/components/ui/organisms/GridTables';
import LinkReportDialog from '../molecules/LinkReportDialog';
import useQuickFilter from '@/hooks/useQuickFilter';
import { useUnlinkedReportsAdmin } from '../../hooks/useLinkReportsAdmin';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';

const UnlinkedReportsTable: React.FC = () => {
  const { unlinkedReportsData, loading, refetch } = useUnlinkedReportsAdmin();
  const gridRef = useRef<AgGridReact>(null);
  const { searchTextRef, quickFilterText, applyFilter, resetFilter } = useQuickFilter();
  const [selectedReportId, setSelectedReportId] = useState<number | null>(null);
  const [openLinkDialog, setOpenLinkDialog] = useState(false);

  // Column definitions
  const columns: ColDef[] = [
    { field: 'id', headerName: 'ID', width: 80 },
    { field: 'labelName', headerName: 'Label Name', width: 400 },
    { field: 'distributor', headerName: 'Distributor', width: 200 },
    { field: 'reportingMonth', headerName: 'Reporting Month', width: 200 },
    { field: 'count', headerName: 'Count', width: 100 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      flex: 1,
      sortable: false,
      cellRenderer: (params: any) => <Button onClick={() => handleOpenLinkDialog(params.data.id)}>Link</Button>,
    },
  ];

  const rowData = unlinkedReportsData?.map((apiData: any) => ({
    id: apiData.id,
    labelName: apiData.labelName,
    distributor: apiData.distributor,
    reportingMonth: apiData.reportingMonth,
    count: apiData.count,
  }));
  // Dialog handlers
  const handleOpenLinkDialog = (reportId: number) => {
    setSelectedReportId(reportId);
    setOpenLinkDialog(true);
  };

  const handleCloseLinkDialog = () => {
    setOpenLinkDialog(false);
    setSelectedReportId(null);
  };

  // Refresh logic (to be implemented with React Query if needed)
  const handleRefresh = () => {
    refetch(); // Simple fallback, ideally usar React Query para refetch
  };

  const defaultColDef: ColDef = {
    wrapText: true,
    autoHeight: true,
    filter: false,
    sortable: true,
    resizable: false,
  };

  return (
    <>
      <Box sx={{ height: 600, width: '100%' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
          <Box sx={{ flexGrow: 1 }}>
            <SearchBoxTable searchTextRef={searchTextRef} applyFilter={applyFilter} resetFilter={resetFilter} />
          </Box>
          <Button onClick={handleRefresh} startIcon={<Refresh />} sx={{ marginLeft: 2 }}>
            Refresh
          </Button>
        </Box>
        <GridTables ref={gridRef} columns={columns} rowData={rowData} loading={loading.unlinkedReportsFetch} quickFilterText={quickFilterText} defaultColDef={defaultColDef} />
      </Box>
      {selectedReportId !== null && (
        <LinkReportDialog open={openLinkDialog} onClose={handleCloseLinkDialog} reportId={selectedReportId} />
      )}
    </>
  );
};

export default UnlinkedReportsTable;
