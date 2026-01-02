// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   define: {
//     // Ensures process.env.API_KEY is available in the Vite environment
//     'process.env.API_KEY': JSON.stringify(process.env.API_KEY),
//   },
//   server: {
//     host: true, // Expose to all IPs
//   },
// });

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],

  define: {
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY),
  },

  server: {
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      },
    },
    allowedHosts: [
      "agritech-ycwe.onrender.com" // your Render domain
    ]
  },
  build: {
    chunkSizeWarningLimit: 1000, // Increase warning limit to 1000KB
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          charts: ['recharts'],
          ui: ['lucide-react', 'gsap'],
          ai: ['openai', 'react-markdown']
        }
      }
    }
  }
});
