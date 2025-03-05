/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import { configDefaults } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    ...configDefaults,
    environment: 'jsdom',
    globals: true,
    setupFiles: "./src/setupTests.ts",
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})