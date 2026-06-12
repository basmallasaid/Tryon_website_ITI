import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/kie-image": {
        target: "https://tempfile.aiquickdraw.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/kie-image/, ""),
      },
    },
  },
})
