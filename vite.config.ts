
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // Injeta a API_KEY do ambiente do Replit diretamente no código do cliente
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY || '')
  },
  server: {
    host: true,
    port: 3000,
    hmr: {
      overlay: false
    }
  },
  build: {
    target: 'esnext'
  }
});
