import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  root: '.',
  server: {
    host: 'localhost',
    port: 5173,
    open: false,
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
