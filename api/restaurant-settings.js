import liveStore from '../src/data/liveStore.json';

let inMemorySettings = { ...(liveStore.settings || {}) };

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json(inMemorySettings);
  }

  if (req.method === 'POST') {
    const payload = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    inMemorySettings = { ...inMemorySettings, ...payload };
    return res.status(200).json({ success: true, settings: inMemorySettings });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
