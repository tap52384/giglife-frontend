import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import path from "path"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// This is the folder that contains the vite.config.js file
const __dirname = dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // https://vitejs.dev/config/#server-options
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@assets': path.resolve(__dirname, 'src/assets'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),
      '@pages': path.resolve(__dirname, 'src/pages'),
      '@utils': path.resolve(__dirname, 'src/utils'),
    }
  },
  build: {
    rollupOptions: {
        input: {
          // .html files are treated as entry points
          main: resolve(__dirname, 'index.html'),
          // Add other entry points if needed
          login: resolve(__dirname, 'src/pages/login/index.html'),
          register: resolve(__dirname, 'src/pages/register/index.html'),
          dashboard: resolve(__dirname, 'src/pages/dashboard/index.html'),
        },
    },
  },
})
