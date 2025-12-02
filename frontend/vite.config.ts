/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts', './src/setupTests.ts'],
    css: true,
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
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
