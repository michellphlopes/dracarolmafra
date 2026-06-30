const PLANS = {
  essencial:      { title: 'Avaliação Labial Essencial — Dra. Carol Mafra',         price: 97  },
  completo:       { title: 'Avaliação Facial Completa — Dra. Carol Mafra',           price: 147 },
  premium:        { title: 'Avaliação + Videochamada Exclusiva — Dra. Carol Mafra',  price: 247 },
  plano_skincare: { title: 'Guia Inteligente de Skincare — Dra. Carol Mafra',        price: 47  },
};

const BASE_URL = 'https://dracarolmafra.com.br';

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  let plan, name, price, skinProfile;
  try {
    ({ plan, name, price, skinProfile } = JSON.parse(event.body));
  } catch {
    return { statusCode: 400, body: 'Invalid body' };
  }

  const base = PLANS[plan];
  if (!base) return { statusCode: 400, body: 'Invalid plan' };

  // Permite override de preço enviado pelo frontend (para testes A/B de preço)
  const finalPrice = typeof price === 'number' && price > 0 ? price : base.price;
  const finalTitle = base.title;

  const isLabios = plan.startsWith('essencial') || plan.startsWith('completo') || plan.startsWith('premium');
  const profileParam = skinProfile ? `&perfil=${skinProfile}` : '';
  const successUrl = isLabios
    ? `${BASE_URL}/sucesso-labios?plano=${plan}`
    : `${BASE_URL}/sucesso-skincare?plano=${plan}${profileParam}`;

  const preference = {
    items: [{
      title: finalTitle,
      quantity: 1,
      unit_price: finalPrice,
      currency_id: 'BRL',
    }],
    payer: name ? { name } : undefined,
    back_urls: {
      success: successUrl,
      failure: `${BASE_URL}/skincare?erro=pagamento`,
      pending: `${successUrl}&status=pendente`,
    },
    external_reference: skinProfile || 'geral',
    auto_return: 'approved',
    payment_methods: {
      excluded_payment_types: [],
      installments: 12,
    },
    notification_url: `${BASE_URL}/.netlify/functions/mp-webhook`,
    statement_descriptor: 'DRA CAROL MAFRA',
    expires: false,
  };

  try {
    const res = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.MP_ACCESS_TOKEN}`,
      },
      body: JSON.stringify(preference),
    });

    const data = await res.json();

    if (!data.id) {
      console.error('MP error:', JSON.stringify(data));
      return { statusCode: 502, body: 'MP preference creation failed' };
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        preferenceId: data.id,
        init_point: data.init_point,
      }),
    };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: 'Internal error' };
  }
};
