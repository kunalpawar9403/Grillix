import liveStore from '../src/data/liveStore.json';

let inMemoryOrders = Array.isArray(liveStore.orders) ? [...liveStore.orders] : [];

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json(inMemoryOrders);
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
    }
    return res.status(200).json({ success: true, orders: inMemoryOrders });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
