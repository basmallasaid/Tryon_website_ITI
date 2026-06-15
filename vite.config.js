import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.png', 'favicon.svg', 'logo-dark.svg', 'logo-light.svg', 'pwa-192x192-v2.png', 'pwa-512x512-v2.png'],
      devOptions: {
        enabled: true,
        type: 'module',
      },
      manifest: {
        name: 'ReDolapy',
        short_name: 'ReDolapy',
        description: 'Virtual Try-On & Fashion Recycling Platform',
        theme_color: '#8B5CF6',
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/pwa-192x192-v2.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/pwa-512x512-v2.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/pwa-512x512-v2.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg,webp,gif,woff,woff2}'],
        maximumFileSizeToCacheInBytes: 20 * 1024 * 1024,
        navigateFallback: 'index.html',
        navigateFallbackAllowlist: [/^\//],
        runtimeCaching: [
          {
            // Cache all dynamic/external images using CacheFirst strategy
            urlPattern: ({ request }) => request.destination === 'image',
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              },
            },
          },
          {
            urlPattern: /^https?:\/\/.*\/api\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24,
              },
            },
          },
        ],
      },
    }),
  ],
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
