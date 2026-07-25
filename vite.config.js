import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";
import { VitePWA } from "vite-plugin-pwa";
import legacy from "@vitejs/plugin-legacy";

export default defineConfig({
  plugins: [
    react(),
    legacy({
      targets: [
        'defaults', 
        'not IE 11', 
        'Chrome >= 49', 
        'Samsung >= 4', 
        'Safari >= 10'
      ]
    }),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      includeAssets: ['favicon.ico', 'logo.png', 'favicon.svg'],
      workbox: {
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true,
        navigateFallback: '/index.html',
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json,ttf,woff,woff2,webp,avif}'],
        maximumFileSizeToCacheInBytes: 15000000,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] }
            }
          },
          {
            // Never cache GA network calls — always send live. When a hit
            // fails anyway (dead wifi the browser still reports as online,
            // captive portal) Background Sync holds it and replays it once
            // the connection is back, instead of dropping it. Note GA stamps
            // a replayed hit at arrival time, so the app also tags its own
            // offline hits with offline_time (see src/lib/analytics.js).
            urlPattern: /^https:\/\/(?:www\.google-analytics\.com|analytics\.google\.com|region\d+\.google-analytics\.com|www\.googletagmanager\.com)\/.*/i,
            handler: 'NetworkOnly',
            options: {
              backgroundSync: {
                name: 'ga-hit-queue',
                options: { maxRetentionTime: 24 * 60 } // minutes; GA drops older hits anyway
              }
            }
          }
        ]
      },
      manifest: {
        name: 'Xhamia e Dushkajës',
        short_name: 'XH. Dushkajës',
        description: 'Faqja zyrtare e Xhamisë së Dushkajës',
        theme_color: '#064e3b',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: '/logo.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/logo.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    }),
    ViteImageOptimizer({
      test: /\.(jpe?g|png|gif|tiff|webp|svg|avif)$/i,
      jpeg: { quality: 80 },
      jpg: { quality: 80 },
      png: { quality: 80 },
      webp: { quality: 85 }
    })
  ],
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
