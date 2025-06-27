import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    proxy: {
      '/socket.io': {
        target: 'ws://localhost:3001',
        ws: true,
        changeOrigin: true,
        // Handle proxy errors gracefully when WebSocket server is unavailable
        configure: (proxy, options) => {
          let errorLogged = false;
          
          proxy.on('error', (err, req, res) => {
            // Only log the first error to avoid spam
            if (!errorLogged) {
              console.log('WebSocket server not available at localhost:3001 - application will run in mock mode');
              errorLogged = true;
            }
            
            // Send a proper response for HTTP requests to prevent hanging
            if (res && typeof res.writeHead === 'function' && !res.headersSent) {
              res.writeHead(503, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ 
                error: 'WebSocket server unavailable',
                mockMode: true 
              }));
            }
          });

          proxy.on('proxyReq', (proxyReq, req, res) => {
            // Set a shorter timeout to fail faster when server is unavailable
            proxyReq.setTimeout(1000, () => {
              proxyReq.destroy();
            });
          });
        },
      },
    },
  },
});