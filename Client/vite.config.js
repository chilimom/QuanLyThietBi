import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const host = process.env.VITE_HOST || "127.0.0.1";
const port = Number(process.env.VITE_PORT || 3001);
 
export default defineConfig({
  plugins: [react()],
  server: {
    host,
    port,
    proxy: {
      "/api": {
        target: process.env.VITE_PROXY_TARGET || "http://localhost:5134",
        changeOrigin: true,
      },
    },
  },
  preview: {
    host,
    port,
  },
  build: {
    outDir: "dist", // Thư mục xuất ra khi build
    assetsDir: "assets", // Thư mục chứa JS/CSS/ảnh
    rollupOptions: {
      output: {
        entryFileNames: "assets/[name].[hash].js",
        chunkFileNames: "assets/[name].[hash].js",
        assetFileNames: "assets/[name].[hash].[ext]",
      },
    },
  },
});
