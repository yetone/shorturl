/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts', './vitest.setup.ts'],
    css: true,
    exclude: ['**/node_modules/**', '**/e2e/**'],
  },
  server: {
    allowedHosts: ['ubuntu'],
    proxy: {
      '/api': {
        target: 'http://localhost:9999',
        changeOrigin: true,
      },
      '/r': {
        target: 'http://localhost:9999',
        changeOrigin: true,
      }
    }
  },
})
