/// <reference types="vitest" />

import { defineConfig } from 'vitest/config';
import angular from '@analogjs/vite-plugin-angular';

export default defineConfig({
  plugins: [angular()],
  optimizeDeps: {
    entries: ['src/main.ts', 'src/**/*.spec.ts'],
  },
  test: {
    globals: true,
    setupFiles: ['src/test-setup.ts'],
    environment: 'jsdom',
    include: ['src/**/*.spec.ts'],
    exclude: ['**/node_modules/**', '**/dist/**'],
    reporters: ['default'],
  },
});
