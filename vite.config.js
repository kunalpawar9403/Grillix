import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import fs from 'fs';
import path from 'path';

function sharedApiPlugin() {
  const storePath = path.resolve(import.meta.dirname || process.cwd(), 'src/data/liveStore.json');

  const getStore = () => {
    try {
      if (fs.existsSync(storePath)) {
        return JSON.parse(fs.readFileSync(storePath, 'utf8'));
      }
    } catch (e) {
      console.warn('Error reading store', e);
    }
    return { orders: [], kitchenStatus: 'Online' };
  };

  const saveStore = (data) => {
    try {
      fs.writeFileSync(storePath, JSON.stringify(data, null, 2));
    } catch (e) {
      console.warn('Error saving store', e);
    }
  };

  return {
    name: 'shared-api-sync',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        // Set full CORS headers for cross-port access (5174 <-> 5175)
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

        if (req.method === 'OPTIONS') {
          res.statusCode = 204;
          res.end();
          return;
        }

        const url = req.url ? req.url.split('?')[0] : '';

        // 1. GET /api/orders
        if (url === '/api/orders' && req.method === 'GET') {
          const store = getStore();
          res.setHeader('Content-Type', 'application/json');
          res.statusCode = 200;
          res.end(JSON.stringify(store.orders || []));
          return;
        }

        // 2. POST /api/orders (Add or Update an order)
        if (url === '/api/orders' && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', () => {
            try {
              const payload = JSON.parse(body);
              const store = getStore();
              let orders = store.orders || [];

              if (payload.id && orders.some(o => o.id === payload.id)) {
                orders = orders.map(o => o.id === payload.id ? { ...o, ...payload } : o);
              } else {
                orders = [payload, ...orders];
              }

              store.orders = orders;
              store.lastUpdated = new Date().toISOString();
              saveStore(store);

              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 200;
              res.end(JSON.stringify({ success: true, orders }));
            } catch (err) {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: err.message }));
            }
          });
          return;
        }

        // 3. GET /api/kitchen-status
        if (url === '/api/kitchen-status' && req.method === 'GET') {
          const store = getStore();
          res.setHeader('Content-Type', 'application/json');
          res.statusCode = 200;
          res.end(JSON.stringify({ status: store.kitchenStatus || 'Online' }));
          return;
        }

        // 4. POST /api/kitchen-status
        if (url === '/api/kitchen-status' && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', () => {
            try {
              const payload = JSON.parse(body);
              const store = getStore();
              store.kitchenStatus = payload.status || 'Online';
              saveStore(store);

              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 200;
              res.end(JSON.stringify({ success: true, status: store.kitchenStatus }));
            } catch (err) {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: err.message }));
            }
          });
          return;
        }

        // 5. GET /api/restaurant-settings
        if (url === '/api/restaurant-settings' && req.method === 'GET') {
          const store = getStore();
          res.setHeader('Content-Type', 'application/json');
          res.statusCode = 200;
          res.end(JSON.stringify(store.settings || {}));
          return;
        }

        // 6. POST /api/restaurant-settings (Update delivery fees, thresholds, hours, etc.)
        if (url === '/api/restaurant-settings' && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', () => {
            try {
              const payload = JSON.parse(body);
              const store = getStore();
              store.settings = { ...(store.settings || {}), ...payload };
              store.lastUpdated = new Date().toISOString();
              saveStore(store);

              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 200;
              res.end(JSON.stringify({ success: true, settings: store.settings }));
            } catch (err) {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: err.message }));
            }
          });
          return;
        }

        next();
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), sharedApiPlugin()],
  server: {
    host: '0.0.0.0',
    port: 5174,
    strictPort: true,
    cors: true,
    hmr: {
      clientPort: 5174,
      protocol: 'ws',
      host: 'localhost',
    },
  },
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'lucide-react', 'qrcode', 'canvas-confetti'],
  },
});
