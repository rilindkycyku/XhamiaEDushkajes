import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";

export default defineConfig({
  plugins: [react(), ViteImageOptimizer({
    test: /\.(jpe?g|png|gif|tiff|webp|svg|avif)$/i,
    jpeg: { quality: 80 },
    jpg: { quality: 80 },
    png: { quality: 80 },
    webp: { quality: 85 }
  })],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom", "react-helmet-async"],
          framer: ["framer-motion"],
          icons: ["react-icons"],
        },
      },
    },
  },
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:3001", // <-- points to our Express proxy
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
