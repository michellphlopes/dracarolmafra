const { Resend } = require('resend');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };

  let email, name, pdfBase64, profileLabel;
  try {
    ({ email, name, pdfBase64, profileLabel } = JSON.parse(event.body));
  } catch {
    return { statusCode: 400, body: 'Invalid body' };
  }

  if (!email || !pdfBase64) return { statusCode: 400, body: 'Missing email or pdf' };

  const resend = new Resend(process.env.RESEND_API_KEY);
  const firstName = (name || 'você').split(' ')[0];

  try {
    await resend.emails.send({
      from: 'Dra. Carol Mafra <carol@dracarolmafra.com.br>',
      to: email,
      subject: `${firstName}, seu Plano Inteligente de Skincare chegou ✦`,
      html: `
        <div style="max-width:560px;margin:0 auto;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;background:#0a0a0a;color:#f0ebe3;padding:48px 40px;">
          <p style="font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#C8A96E;margin-bottom:32px">Dra. Carol Mafra</p>
          <h1 style="font-family:Georgia,serif;font-weight:400;font-size:24px;line-height:1.3;margin-bottom:16px">${firstName}, seu guia chegou.</h1>
          <p style="font-size:14px;line-height:1.7;color:#aaa;margin-bottom:24px">
            Preparei seu Plano Inteligente de Skincare com base nas suas respostas.<br>
            Perfil identificado: <strong style="color:#C8A96E">${profileLabel || 'Pele personalizada'}</strong>
          </p>
          <p style="font-size:13px;line-height:1.7;color:#888;margin-bottom:32px">
            O PDF está em anexo. Guarde-o no seu celular ou computador — você pode consultá-lo sempre que precisar.
          </p>
          <hr style="border:none;border-top:1px solid #222;margin:32px 0">
          <p style="font-size:12px;color:#555;line-height:1.6">
            Tem dúvidas? Pode me chamar diretamente no WhatsApp.<br>
            <a href="https://wa.me/5533998514322" style="color:#C8A96E;text-decoration:none">wa.me/5533998514322</a>
          </p>
          <p style="font-size:11px;color:#333;margin-top:32px">
            Dra. Carol Mafra · dracarolmafra.com.br<br>
            Material educativo e orientativo. Não constitui diagnóstico médico ou prescrição.
          </p>
        </div>
      `,
      attachments: [{
        filename: `plano-skincare-${firstName.toLowerCase()}.pdf`,
        content: pdfBase64,
      }],
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok: true }),
    };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: 'Email send failed' };
  }
};
