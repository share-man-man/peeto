import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { packageConfig } from '../../config';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: packageConfig.CORE.libName,
      fileName: 'index',
    },
  },
  plugins: [
    dts({
      entryRoot: './src',
    }),
  ],
});
