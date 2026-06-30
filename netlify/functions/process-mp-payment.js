const PLANS = {
  essencial:      { title: 'Avaliação Labial Essencial — Dra. Carol Mafra',        price: 97  },
  completo:       { title: 'Avaliação Facial Completa — Dra. Carol Mafra',          price: 147 },
  premium:        { title: 'Avaliação + Videochamada Exclusiva — Dra. Carol Mafra', price: 247 },
  plano_skincare: { title: 'Guia Inteligente de Skincare — Dra. Carol Mafra',       price: 47  },
};

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };

  let plan, formData, price;
  try {
    ({ plan, formData, price } = JSON.parse(event.body));
  } catch {
    return { statusCode: 400, body: 'Invalid body' };
  }

  const p = PLANS[plan];
  if (!p) return { statusCode: 400, body: 'Invalid plan' };

  // Permite override de preço (cupom de desconto)
  const finalPrice = typeof price === 'number' && price > 0 ? price : p.price;

  const payment = {
    transaction_amount: finalPrice,
    description: p.title,
    statement_descriptor: 'DRA CAROL MAFRA',
    notification_url: 'https://dracarolmafra.com.br/.netlify/functions/mp-webhook',
    payer: {
      email: formData.payer?.email || '',
      identification: formData.payer?.identification,
    },
  };

  if (formData.token) {
    // Cartão de crédito/débito
    payment.token = formData.token;
    payment.installments = formData.installments || 1;
    payment.payment_method_id = formData.payment_method_id;
    if (formData.issuer_id) payment.issuer_id = formData.issuer_id;
  } else {
    // Pix / boleto
    payment.payment_method_id = formData.payment_method_id;
  }

  try {
    const res = await fetch('https://api.mercadopago.com/v1/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.MP_ACCESS_TOKEN}`,
        'X-Idempotency-Key': `${plan}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      },
      body: JSON.stringify(payment),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error('MP API error', res.status, JSON.stringify(data));
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'error',
          status_detail: data.message || data.error || 'mp_error',
          mp_status: res.status,
          mp_cause: data.cause,
        }),
      };
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: data.status,
        status_detail: data.status_detail,
        id: data.id,
        point_of_interaction: data.point_of_interaction,
      }),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'error', status_detail: err.message }),
    };
  }
};
