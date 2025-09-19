import { forwardRef, memo } from 'react';
import {
  ClientSideRowModelModule,
  InfiniteRowModelModule,
  CsvExportModule,
  ModuleRegistry,
  QuickFilterModule,
  PaginationModule,
  ExternalFilterModule,
  ColumnAutoSizeModule,
  ValidationModule,
  NumberFilterModule,
  DateFilterModule,
} from 'ag-grid-community';
import { AgGridReact, AgGridReactProps } from 'ag-grid-react';
import { Box } from '@mui/material';
import LoadingSpinner from '../atoms/LoadingSpinner';
import { cmgThemeGrid } from '@/styles/grid-royalties';

// Lazy load CSS solo cuando se usa el componente
import('@/styles/ag-grid.css');

interface GridTablesProps extends AgGridReactProps {
  columns: any[];
  rowData: any[];
  height?: string;
  width?: string;
}

// Registrar solo los módulos necesarios en lugar de AllCommunityModule
ModuleRegistry.registerModules([
  ClientSideRowModelModule, // Para datos del lado del cliente
  InfiniteRowModelModule, // Para scroll infinito si se necesita
  QuickFilterModule, // Para filtrado rápido
  CsvExportModule, // Para exportar CSV si se necesita
  PaginationModule, // Para paginación
  ExternalFilterModule, // Para filtros externos si se necesita
  ColumnAutoSizeModule, // Para autoajustar columnas
  NumberFilterModule, // Filtro numérico
  DateFilterModule, // Filtro de fecha
  ValidationModule, // Para validaciones si se necesita
]);

const GridTables = memo(
  forwardRef<AgGridReact, GridTablesProps>(({ columns, rowData, height = '500px', width = '100%', ...props }, ref) => {
    return (
      <Box width={width} height={height}>
        <AgGridReact
          ref={ref}
          loadThemeGoogleFonts={false} // Evita cargar Google Fonts desde AG-Grid
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
          // Optimizaciones de rendimiento
          suppressColumnVirtualisation={false}
          suppressRowVirtualisation={false}
          rowBuffer={10}
          maxConcurrentDatasourceRequests={2}
        />
      </Box>
    );
  }),
);

GridTables.displayName = 'GridTables';

export default GridTables;
