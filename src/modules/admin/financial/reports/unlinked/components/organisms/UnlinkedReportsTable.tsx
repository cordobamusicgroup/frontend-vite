import React, { useRef, useState } from 'react';
import { Box, Button } from '@mui/material';
import { Refresh } from '@mui/icons-material';
import '@/styles/ag-grid.css'; // Add this line to import the CSS file
import SearchBoxTable from '@/components/ui/organisms/SearchBoxTable';
import GridTables from '@/components/ui/organisms/GridTables';
import LinkReportDialog from '../molecules/LinkReportDialog';
import useQuickFilter from '@/hooks/useQuickFilter';
import { useUnlinkedReportsAdmin } from '../../hooks/useLinkReportsAdmin';
import { AgGridReact } from 'ag-grid-react';

const UnlinkedReportsTable: React.FC = () => {
  const { unlinkedReportsData, loading } = useUnlinkedReportsAdmin();
  const gridRef = useRef<AgGridReact>(null);

  const { searchTextRef, quickFilterText, applyFilter, resetFilter } = useQuickFilter();
  const [selectedReportId, setSelectedReportId] = useState<number | null>(null);
  const [openLinkDialog, setOpenLinkDialog] = useState(false);
  const [selectedReportData, setSelectedReportData] = useState<any>(null);

  const handleOpenLinkDialog = (report: any) => {
    setSelectedReportId(report.id);
    setSelectedReportData(report);
    setOpenLinkDialog(true);
  };

  const handleCloseLinkDialog = () => {
    setOpenLinkDialog(false);
    setSelectedReportId(null);
    setSelectedReportData(null);
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 80, sortable: false, filter: false, resizable: false, cellStyle: { textAlign: 'center' }, headerClass: 'center-header' },
    { field: 'labelName', headerName: 'Label Name', width: 200, cellStyle: { textAlign: 'center' }, headerClass: 'center-header' },
    { field: 'distributor', headerName: 'Distributor', width: 150, cellStyle: { textAlign: 'center' }, headerClass: 'center-header' },
    { field: 'reportingMonth', headerName: 'Reporting Month', width: 150, cellStyle: { textAlign: 'center' }, headerClass: 'center-header' },
    { field: 'count', headerName: 'Count', width: 100, cellStyle: { textAlign: 'center' }, headerClass: 'center-header' },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      cellRenderer: (params: any) => <Button onClick={() => handleOpenLinkDialog(params.data)}>Link</Button>,
      cellStyle: { textAlign: 'center' },
      headerClass: 'center-header',
    },
  ];

  const rowData =
    unlinkedReportsData?.map((report: any) => ({
      id: report.id,
      labelName: report.labelName,
      distributor: report.distributor,
      reportingMonth: report.reportingMonth,
      count: report.count,
    })) || [];

  const handleRefresh = () => {
    // TODO : Implement refresh logic
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
        <GridTables
          ref={gridRef}
          columns={columns}
          rowData={rowData}
          loading={loading.unlinkedReportsFetch}
          quickFilterText={quickFilterText}
          defaultColDef={{ filter: true, headerClass: 'center-header', flex: 1 }}
        />
      </Box>
      <LinkReportDialog open={openLinkDialog} onClose={handleCloseLinkDialog} reportId={selectedReportId} reportData={selectedReportData} />
    </>
  );
};

export default UnlinkedReportsTable;
