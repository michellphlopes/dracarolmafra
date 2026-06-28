const https = require('https');

function post(url, data, headers) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(data);
    const u = new URL(url);
    const req = https.request({
      hostname: u.hostname,
      path: u.pathname,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body), ...headers }
    }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve({ status: res.statusCode, body: d }));
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

function sendEmail({ to, subject, html }) {
  return post('https://api.resend.com/emails', { from: 'Dra. Carol Mafra <noreply@dracarolmafra.com.br>', to, subject, html }, {
    Authorization: `Bearer ${process.env.RESEND_API_KEY}`
  });
}

const PLANO_NOMES = { essencial: 'Essencial (R$97)', completo: 'Completo (R$247)', premium: 'Premium (R$347)' };
const WHATS = '5533998514322';

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };

  let session;
  try {
    const payload = JSON.parse(event.body);
    if (payload.type !== 'checkout.session.completed') return { statusCode: 200, body: 'ok' };
    session = payload.data.object;
  } catch {
    return { statusCode: 400, body: 'Invalid payload' };
  }

  const email = session.customer_details?.email || '';
  const nome = session.customer_details?.name || 'cliente';
  const successUrl = session.success_url || '';
  const planoParam = (successUrl.match(/plano=([^&]+)/) || [])[1] || 'essencial';
  const planoNome = PLANO_NOMES[planoParam] || planoParam;
  const msgWA = encodeURIComponent(`Nova compra: ${planoNome}\nNome: ${nome}\nE-mail: ${email}`);
  const whatsLink = `https://wa.me/${WHATS}?text=${msgWA}`;

  // Email para Carol
  await sendEmail({
    to: 'caarolsousamafra@gmail.com',
    subject: `Nova compra — ${planoNome}`,
    html: `<h2>Nova compra recebida</h2>
<p><strong>Plano:</strong> ${planoNome}</p>
<p><strong>Nome:</strong> ${nome}</p>
<p><strong>E-mail:</strong> ${email}</p>
<p><a href="${whatsLink}" style="background:#25D366;color:#fff;padding:12px 24px;border-radius:4px;text-decoration:none;display:inline-block;margin-top:12px">Abrir WhatsApp com cliente</a></p>`
  });

  // Email para a compradora
  if (email) {
    await sendEmail({
      to: email,
      subject: 'Sua análise está confirmada — Dra. Carol Mafra',
      html: `<p>Olá, ${nome}!</p>
<p>Seu pagamento do plano <strong>${planoNome}</strong> foi confirmado. 🌸</p>
<p>Em breve você receberá as instruções para enviar suas fotos e iniciar sua análise personalizada.</p>
<p>Qualquer dúvida, entre em contato pelo WhatsApp:</p>
<p><a href="https://wa.me/${WHATS}" style="background:#25D366;color:#fff;padding:12px 24px;border-radius:4px;text-decoration:none;display:inline-block">Falar com a Dra. Carol</a></p>
<br><p style="color:#888;font-size:12px">Dra. Ana Carolina Sousa Mafra · CRO-MG 66417</p>`
    });
  }

  return { statusCode: 200, body: 'ok' };
};
