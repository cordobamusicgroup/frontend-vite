import { forwardRef } from 'react';
import {
  AllCommunityModule,
  ModuleRegistry,
} from 'ag-grid-community';
import { AgGridReact, AgGridReactProps } from 'ag-grid-react';
import { Box } from '@mui/material';
import LoadingSpinner from '../atoms/LoadingSpinner';
import { cmgThemeGrid } from '@/styles/grid-royalties';
import '@/styles/ag-grid.css';

interface GridTablesProps extends AgGridReactProps {
  columns: any[];
  rowData: any[];
  height?: string;
  width?: string;
}

ModuleRegistry.registerModules([AllCommunityModule]);

const GridTables = forwardRef<AgGridReact, GridTablesProps>(({ columns, rowData, height = '500px', width = '100%', ...props }, ref) => {
  return (
    <Box width={width} height={height}>
      <AgGridReact
        ref={ref}
        loadThemeGoogleFonts={true}
        theme={cmgThemeGrid}
        columnDefs={columns}
        rowData={rowData}
        {...props}
        loadingOverlayComponent={LoadingSpinner}
        loadingOverlayComponentParams={{ size: 30 }}
        suppressMovableColumns={true}
        pagination={true}
        paginationPageSize={20}
        suppressCellFocus
        enableCellTextSelection
      />
    </Box>
  );
});

export default GridTables;
