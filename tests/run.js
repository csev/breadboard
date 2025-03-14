import { defineConfig } from 'vitest/config';
import path from 'path';

// Import all test files
const testFiles = import.meta.glob([
  './unit/**/*.test.js',
  './integration/**/*.test.js',
  './activities/**/*.test.js',
  './circuit/**/*.test.js',
  './common/**/*.test.js',
  './reporting/**/*.test.js'
]);

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./setup/setup.js'],
    include: ['**/*.test.js'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json'],
      exclude: ['node_modules/']
    },
    globals: true
  }
}); 