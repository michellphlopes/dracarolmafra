const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

const SITE_ID = process.env.NETLIFY_SITE_ID || 'ea30e4bf-7066-46c7-b34e-6b7c24f7cd08';
const TOKEN   = process.env.NETLIFY_TOKEN;
const BLOB_API = `https://api.netlify.com/api/v1/sites/${SITE_ID}/blobs/leads/all`;

async function readLeads() {
  if (!TOKEN) return [];
  const r = await fetch(BLOB_API, { headers: { Authorization: `Bearer ${TOKEN}` } });
  if (!r.ok) return [];
  const { url } = await r.json();
  const r2 = await fetch(url);
  if (!r2.ok) return [];
  return r2.json();
}

async function writeLeads(leads) {
  if (!TOKEN) throw new Error('no token');
  const r1 = await fetch(BLOB_API, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
    body: '{}',
  });
  if (!r1.ok) throw new Error('blob presign ' + r1.status);
  const { url } = await r1.json();
  const r2 = await fetch(url, { method: 'PUT', body: JSON.stringify(leads) });
  if (!r2.ok) throw new Error('blob write ' + r2.status);
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS, body: '' };
  }

  if (event.httpMethod === 'POST') {
    const body = JSON.parse(event.body || '{}');
    const lead = {
      id: Date.now().toString(),
      name: body.name || '',
      wa: body.wa || '',
      source: body.source || 'desconhecido',
      ts: new Date().toISOString(),
    };

    let leads = [];
    try { leads = await readLeads(); } catch (_) {}
    leads.unshift(lead);
    if (leads.length > 500) leads = leads.slice(0, 500);
    await writeLeads(leads);

    return { statusCode: 200, headers: CORS, body: JSON.stringify({ ok: true }) };
  }

  if (event.httpMethod === 'GET') {
    let leads = [];
    try { leads = await readLeads(); } catch (_) {}
    return {
      statusCode: 200,
      headers: { ...CORS, 'Content-Type': 'application/json' },
      body: JSON.stringify(leads),
    };
  }

  return { statusCode: 405, headers: CORS, body: 'Method not allowed' };
};
