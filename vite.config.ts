import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig(({ mode }) => {
  console.log(`Running Vite in ${mode} mode`);

  const isDev = mode === 'development';

  return {
    plugins: [vue()],
    build: {
      sourcemap: isDev, // Enable source maps only for dev builds
      minify: isDev ? false : 'terser', // Skip minification in dev builds
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['vue']
          }
        }
      }
    },
    server: {
      open: true,
      port: 5173,
      hmr: {
        overlay: true
      }
    },
    optimizeDeps: {
      include: ['vue']
    }
  };
});
