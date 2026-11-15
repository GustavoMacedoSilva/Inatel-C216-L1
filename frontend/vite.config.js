import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    environment: "jsdom",
    setupFiles: "./tests/setup.js",
    globals: true,
    include: [
      "tests/unit/**/*.{test,spec}.{js,jsx}",
      "tests/integration/**/*.{test,spec}.{js,jsx}",
    ],
  },
});
