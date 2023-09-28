import { resolve } from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'PeetoRenderVue',
      fileName: 'index',
      formats: ['es', 'umd', 'cjs', 'iife'],
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'vue',
        },
      },
    },
  },
  plugins: [dts({ entryRoot: './src' }), vue()],
});
