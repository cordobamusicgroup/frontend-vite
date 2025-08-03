import { defineConfig } from 'vite';
import { reactRouter } from '@react-router/dev/vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [reactRouter(), tsconfigPaths()],
  build: {
    rollupOptions: {
      output: {
        // Aumentar límite de chunk para aplicaciones internas
        manualChunks: undefined,
      },
    },
    // Configurar límites para aplicaciones internas
    chunkSizeWarningLimit: 2000, // 2MB límite - apropiado para apps internas corporativas
    assetsInlineLimit: 8192, // 8KB límite para assets inline
  },
});
