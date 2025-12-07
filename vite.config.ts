import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Ensures process.env.API_KEY is available in the Vite environment
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY),
  },
  server: {
    host: true, // Expose to all IPs
  },
});