import { resolve } from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';
import { packageConfig } from '../../config';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: packageConfig.EDITOR_REACT.libName,
      fileName: 'index',
      // formats: ['es', 'umd', 'cjs', 'iife'],
    },
    rollupOptions: {
      // TODO 确定具体需要external的包
      external: ['react', 'vue', 'react-dom'],
      output: {
        globals: {
          react: 'react',
          vue: 'vue',
          'react-dom': 'ReactDOM',
        },
      },
    },
  },
  plugins: [dts({ entryRoot: './src' }), react(), vue()],
});
