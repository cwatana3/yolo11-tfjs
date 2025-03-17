import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 3000, // handle warning on vendor.js bundle size
  },
  base: "/yolo11-tfjs/",
});
