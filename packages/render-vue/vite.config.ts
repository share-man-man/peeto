import { resolve } from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';
import { packageConfig } from '../../config';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: packageConfig.RENDER_VUE.libName,
      fileName: 'index',
      // formats: ['es', 'umd', 'cjs', 'iife'],
    },
    rollupOptions: {
      external: ['vue', packageConfig.CORE.packageName],
      output: {
        globals: {
          vue: 'vue',
          [packageConfig.CORE.packageName]: packageConfig.CORE.libName,
        },
      },
    },
  },
  plugins: [dts({ entryRoot: './src' }), vue()],
});
