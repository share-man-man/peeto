import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { packageConfig } from '../../config';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: packageConfig.EXTENSION.libName,
      fileName: 'index',
      // formats: ['es', 'umd', 'cjs', 'iife'],
    },
    rollupOptions: {
      external: [packageConfig.CORE.packageName],
      output: {
        globals: {
          [packageConfig.CORE.packageName]: packageConfig.CORE.libName,
        },
      },
    },
  },
  plugins: [dts({ entryRoot: './src' })],
});
