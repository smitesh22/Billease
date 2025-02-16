import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  build: {
    sourcemap: true, // Enables source maps for better debugging
    minify: 'terser', // Use terser for controlled minification
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue'] // Separates Vue into its own chunk for easier debugging
        }
      }
    }
  },
  server: {
    open: true, // Automatically opens the browser on `vite dev`
    port: 3000, // You can change this if you want a different port
    hmr: {
      overlay: true // Shows a full-screen overlay for errors during development
    }
  },
  optimizeDeps: {
    include: ['vue'] // Pre-bundle Vue to improve development performance
  }
});
