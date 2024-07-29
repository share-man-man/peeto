import { resolve } from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { packageConfig } from '../../config';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: packageConfig.RENDER_REACT.libName,
      fileName: 'index',
      // formats: ['es', 'umd', 'cjs', 'iife'],
    },
    rollupOptions: {
      external: ['react', packageConfig.CORE.packageName],
      output: {
        globals: {
          react: 'react',
          [packageConfig.CORE.packageName]: packageConfig.CORE.libName,
        },
      },
    },
  },
  plugins: [dts({ entryRoot: './src' }), react()],
});
