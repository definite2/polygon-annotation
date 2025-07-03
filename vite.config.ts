import path from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import tsConfigPaths from 'vite-tsconfig-paths';
import * as packageJson from './package.json';

export default defineConfig(() => ({
  plugins: [
    dts({
      insertTypesEntry: true,
      include: ['src/lib/'],
    }),
    react(),
    tsConfigPaths(),
  ],
  build: {
    lib: {
      entry: path.join('src', 'lib/index.ts'),
      name: 'polygon-annotation',
      formats: ['es', 'umd'],
      fileName: (format) => `polygon-annotation.${format}.js`,
    },
    rollupOptions: {
      external: [...Object.keys(packageJson.peerDependencies)],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
  },
  test: {
    deps: {
      web: {
        transformAssets: true,
      },
    },
  },
}));
