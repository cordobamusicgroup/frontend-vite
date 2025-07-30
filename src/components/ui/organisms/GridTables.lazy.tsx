import { lazy } from 'react';

// Lazy loading del componente GridTables para reducir el bundle inicial
export const GridTablesLazy = lazy(() => import('./GridTables'));

export default GridTablesLazy;