import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom', // Necesario para pruebas de React
    setupFiles: './src/setupTests.ts', // Opcional, para configuraciones globales
    include: ['src/**/*.{test,spec}.{js,ts,jsx,tsx}'], // Archivos de prueba
  },
});