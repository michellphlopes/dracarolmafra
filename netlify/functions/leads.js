const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

const SITE_ID = process.env.NETLIFY_SITE_ID || 'ea30e4bf-7066-46c7-b34e-6b7c24f7cd08';
const TOKEN   = process.env.NETLIFY_TOKEN;
const BLOB_URL = `https://blobs.netlify.com/api/v1/sites/${SITE_ID}/blobs/leads/all`;

async function readLeads() {
  if (!TOKEN) return [];
  const r = await fetch(BLOB_URL + '?fresh=1', {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });
  if (r.status === 404) return [];
  if (!r.ok) throw new Error('blob read ' + r.status);
  return r.json();
}

async function writeLeads(leads) {
  if (!TOKEN) throw new Error('no token');
  const r = await fetch(BLOB_URL, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(leads),
  });
  if (!r.ok) throw new Error('blob write ' + r.status);
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
