import { resolve } from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'PeetoEditorReact',
      fileName: 'index',
      formats: ['es', 'umd', 'cjs', 'iife'],
    },
    rollupOptions: {
      external: ['react', 'vue', 'react-dom', 'antd', '@ant-design/icons'],
      output: {
        globals: {
          react: 'react',
          vue: 'vue',
          'react-dom': 'ReactDOM',
          antd: 'antd',
          // '@ant-design/icons': 'icon',
        },
      },
    },
  },
  plugins: [dts({ entryRoot: './src' }), react(), vue()],
});
