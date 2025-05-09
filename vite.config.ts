/// <reference types="vitest/globals" />
import { defineConfig } from 'vite'
import path from "path"
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    environment: 'jsdom', // Necesario para pruebas de React
    setupFiles: './src/test/setupTests.ts', // Archivo para configuraciones globales
    globals: true, // Habilita globals como describe, it, expect
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
    testTimeout: 30000,
    include: ['src/test/**/*.{test,spec}.{js,ts,jsx,tsx}'], // Include test files
    
  },
  server: {
    port: 4000,
  }
})
