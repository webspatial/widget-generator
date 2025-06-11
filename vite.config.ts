import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, Plugin } from "vite";
import WebSpatial from "@webspatial/vite-plugin";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), WebSpatial({ outputDir: "" }) as Plugin[]],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  build: {
    sourcemap: true,
    minify: false,
    rollupOptions: {
     
      input: {
        main: path.resolve(__dirname, "index.html"),
        clock: path.resolve(__dirname, "src/pages/clock/index.html"),
        weather: path.resolve(__dirname, "src/pages/weather/index.html"),
        whiteboard: path.resolve(__dirname, "src/pages/whiteboard/index.html"),
      },
    },
  },
});
