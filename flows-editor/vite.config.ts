import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'FlowsEditor',
      fileName: 'index',
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'reactflow', '@fluentui/react-components'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          reactflow: 'ReactFlow',
          '@fluentui/react-components': 'FluentUI',
        },
      },
    },
  },
  server: {
    port: 3001,
  },
}) 