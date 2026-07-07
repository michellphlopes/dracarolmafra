const { getStore } = require('@netlify/blobs');

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS, body: '' };
  }

  const store = getStore('leads');

  if (event.httpMethod === 'POST') {
    const body = JSON.parse(event.body || '{}');
    const lead = {
      id: Date.now().toString(),
      name: body.name || '',
      wa: body.wa || '',
      source: body.source || 'desconhecido',
      ts: new Date().toISOString(),
    };

    // Carrega lista atual e adiciona
    let leads = [];
    try {
      const raw = await store.get('all', { type: 'json' });
      if (Array.isArray(raw)) leads = raw;
    } catch (_) {}

    leads.unshift(lead);
    if (leads.length > 500) leads = leads.slice(0, 500);
    await store.setJSON('all', leads);

    return { statusCode: 200, headers: CORS, body: JSON.stringify({ ok: true }) };
  }

  if (event.httpMethod === 'GET') {
    let leads = [];
    try {
      const raw = await store.get('all', { type: 'json' });
      if (Array.isArray(raw)) leads = raw;
    } catch (_) {}
    return {
      statusCode: 200,
      headers: { ...CORS, 'Content-Type': 'application/json' },
      body: JSON.stringify(leads),
    };
  }

  return { statusCode: 405, headers: CORS, body: 'Method not allowed' };
};
