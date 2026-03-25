import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  server: {
    // HMR is disabled in AI Studio via DISABLE_HMR env var.
    // Do not modify—file watching is disabled to prevent flickering during agent edits.
    hmr: process.env.DISABLE_HMR !== 'true',
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Vendor React — cache de longo prazo
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'vendor-react';
          }
          // Lucide icons — chunk separado (biblioteca grande, muda raramente)
          if (id.includes('node_modules/lucide-react')) {
            return 'vendor-icons';
          }
          // Tailwind e utilitários CSS
          if (id.includes('node_modules/@tailwindcss')) {
            return 'vendor-css';
          }
        }
      }
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.warn', 'console.info'],
      },
      mangle: {
        safari10: true, // compatibilidade iOS
      }
    },
    // Reportar chunks > 200kb como warning
    chunkSizeWarningLimit: 200,
  }
});
