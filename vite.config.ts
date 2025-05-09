/// <reference types="vitest/globals" />
import { defineConfig } from 'vite'
import path from 'path'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setupTests.ts',
    include: ['src/**/*.{test,spec}.{js,ts,jsx,tsx}'],
    globals: true, // Necesario para que 'expect' esté disponible globalmente
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
  server: {
    port: 4000,
  },
})
