import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Relative base so the built site works from any GitHub Pages project path
// (https://<user>.github.io/<repo>/) without hardcoding the repo name.
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
  build: {
    assetsInlineLimit: 0,
    chunkSizeWarningLimit: 1600,
    rollupOptions: {
      output: {
        // The 3D scenes are already split out by `lazy()`; this separates the
        // remaining always-needed libraries from our own code so that editing
        // content.ts doesn't invalidate a megabyte of vendor JS in her browser
        // cache, and so the browser can parse them in parallel.
        manualChunks(id) {
          if (!id.includes('node_modules')) return;
          if (id.includes('/gsap/')) return 'gsap';
          if (id.includes('/framer-motion/') || id.includes('/motion-dom/') || id.includes('/motion-utils/')) {
            return 'motion';
          }
          if (id.includes('/react/') || id.includes('/react-dom/') || id.includes('/scheduler/')) {
            return 'react';
          }
        },
      },
    },
  },
});
