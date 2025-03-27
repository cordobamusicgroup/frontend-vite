import { defineConfig } from 'vite';
import { reactRouter } from '@react-router/dev/vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [reactRouter(), tsconfigPaths()],
  resolve: {
    conditions: ['mui-modern', 'module', 'browser', process.env.NODE_ENV === 'production' ? 'production' : 'development'],
  },
});
