import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
 
export default defineConfig({
  plugins: [react()],
  server: {
    port: 8386,
    proxy: {
      "/api": {
        target: "http://localhost:5134",
        changeOrigin: true,
      },
    },
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
