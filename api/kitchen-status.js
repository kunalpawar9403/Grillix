import liveStore from '../src/data/liveStore.json';

let inMemoryKitchenStatus = liveStore.kitchenStatus || 'Online';

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json({ status: inMemoryKitchenStatus });
  }

  if (req.method === 'POST') {
    const payload = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    if (payload.status) {
      inMemoryKitchenStatus = payload.status;
    }
    return res.status(200).json({ success: true, status: inMemoryKitchenStatus });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
