import liveStore from '../src/data/liveStore.json';

const CLOUD_SYNC_URL = 'https://api.restful-api.dev/objects/ff808181a09d98f701a149e59fe27fea';

let inMemoryOrders = Array.isArray(liveStore.orders) ? [...liveStore.orders] : [];
let lastCloudFetchTime = 0;

async function syncFromCloud() {
  const now = Date.now();
  // Don't hammer cloud store more than once every 1.5 seconds
  if (now - lastCloudFetchTime < 1500 && inMemoryOrders.length > 0) {
    return inMemoryOrders;
  }
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    const res = await fetch(CLOUD_SYNC_URL, { signal: controller.signal });
    clearTimeout(timeoutId);
    if (res.ok) {
      const data = await res.json();
      if (data?.data?.orders && Array.isArray(data.data.orders)) {
        const cloudOrders = data.data.orders;
        // Merge cloud orders with in-memory orders
        const orderMap = new Map();
        // In-memory first (holds recent local updates)
        inMemoryOrders.forEach(o => { if (o && o.id) orderMap.set(o.id, o); });
        // Then cloud orders (prioritizing existing unless cloud is newer)
        cloudOrders.forEach(o => {
          if (o && o.id && !orderMap.has(o.id)) {
            orderMap.set(o.id, o);
          }
        });
        inMemoryOrders = Array.from(orderMap.values());
        lastCloudFetchTime = now;
      }
    }
  } catch (err) {
    // Fail silently and return in-memory orders
  }
  return inMemoryOrders;
}

async function saveToCloud(orders) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);
    await fetch(CLOUD_SYNC_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'grillix_orders',
        data: { orders: orders.slice(0, 50) } // Keep up to 50 recent orders
      }),
      signal: controller.signal
    });
    clearTimeout(timeoutId);
  } catch (err) {
    // Fail silently
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method === 'GET') {
    const orders = await syncFromCloud();
    return res.status(200).json(orders);
  }

  if (req.method === 'POST') {
    const payload = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    if (payload.id) {
      const idx = inMemoryOrders.findIndex(o => o.id === payload.id);
      if (idx !== -1) {
        inMemoryOrders[idx] = { ...inMemoryOrders[idx], ...payload };
      } else {
        inMemoryOrders.unshift(payload);
      }
      // Asynchronously update cloud store without blocking client response
      saveToCloud(inMemoryOrders);
    }
    return res.status(200).json({ success: true, orders: inMemoryOrders });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
