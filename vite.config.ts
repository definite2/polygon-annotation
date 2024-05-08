import path from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import EsLint from 'vite-plugin-linter';
import tsConfigPaths from 'vite-tsconfig-paths';
const { EsLinter, linterPlugin } = EsLint;
import * as packageJson from './package.json';

export default defineConfig((configEnv) => ({
  plugins: [
    dts({
      insertTypesEntry: true,
      include: ['src/lib/'],
    }),
    react(),
    tsConfigPaths(),
    linterPlugin({
      include: ['./src/**/*.{ts,tsx}'],
      linters: [new EsLinter({ configEnv })],
    }),
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
}));
