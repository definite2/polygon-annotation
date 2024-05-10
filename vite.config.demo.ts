import { resolve } from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
// config for demo
export default defineConfig({
  plugins: [react()],
  root: resolve(__dirname, 'demo'),
  build: {
    outDir: resolve(__dirname, 'demo-dist'),
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'demo/index.html'),
      },
    },
  },
  server: {
    port: 3001,
  },
});
