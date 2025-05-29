import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { packageConfig } from '../../config';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: packageConfig.EDITOR.libName,
      fileName: 'index',
    },
    rollupOptions: {
      external: [
        packageConfig.CORE.packageName,
        packageConfig.EXTENSION.packageName,
      ],
      output: {
        globals: {
          [packageConfig.CORE.packageName]: packageConfig.CORE.libName,
          [packageConfig.EXTENSION.packageName]:
            packageConfig.EXTENSION.libName,
        },
      },
    },
  },
  plugins: [
    dts({
      entryRoot: './src',
    }),
  ],
});
