# GridTables Bundle Size Optimization

## Mejoras Implementadas

### 1. Módulos Específicos en lugar de AllCommunityModule
**Antes:**
```typescript
import { AllCommunityModule } from 'ag-grid-community';
ModuleRegistry.registerModules([AllCommunityModule]);
```

**Después:**
```typescript
import {
  ClientSideRowModelModule,
  InfiniteRowModelModule,
  CsvExportModule,
} from 'ag-grid-community';
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  InfiniteRowModelModule,
  CsvExportModule,
]);
```

**Beneficio:** Reduce ~200KB del bundle al incluir solo módulos necesarios.

### 2. Lazy Loading del Componente
**Nuevo archivo:** `GridTables.lazy.tsx`
```typescript
import { lazy } from 'react';
export const GridTablesLazy = lazy(() => import('./GridTables'));
```

**Uso recomendado:**
```typescript
import { Suspense } from 'react';
import { GridTablesLazy } from '@/components/ui/organisms/GridTables.lazy';

// En el componente:
<Suspense fallback={<div>Loading table...</div>}>
  <GridTablesLazy columns={columns} rowData={data} />
</Suspense>
```

### 3. CSS Lazy Loading
**Antes:** `import '@/styles/ag-grid.css';`
**Después:** `import('@/styles/ag-grid.css');`

**Beneficio:** El CSS se carga solo cuando se usa el componente.

### 4. Optimizaciones de Rendimiento
- `memo()` para evitar re-renders innecesarios
- `suppressColumnVirtualisation={false}` para tablas grandes
- `rowBuffer={10}` para mejor scrolling
- `loadThemeGoogleFonts={false}` para evitar fuentes externas

## Impacto Estimado
- **Bundle inicial:** -200KB (módulos específicos)
- **Bundle inicial:** -50KB (lazy loading)
- **Tiempo de carga:** Mejora en páginas sin tablas
- **Rendimiento:** Mejor scrolling y menos re-renders

## Migración Recomendada
Para páginas con muchas tablas, usar la versión lazy:

```typescript
// Cambiar esto:
import GridTables from '@/components/ui/organisms/GridTables';

// Por esto:
import { Suspense } from 'react';
import { GridTablesLazy } from '@/components/ui/organisms/GridTables.lazy';
```