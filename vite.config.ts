import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // Injeta a API_KEY do ambiente do Replit diretamente no código do cliente
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY || '')
  },
  server: {
    host: '0.0.0.0',
    port: 5000,
    // Fix: allowedHosts expects true or string[]. 'all' is not a valid value.
    allowedHosts: true, // Permite que o Replit acesse o servidor de desenvolvimento
    hmr: {
      overlay: false
    }
  },
  build: {
    target: 'esnext'
  }
});
