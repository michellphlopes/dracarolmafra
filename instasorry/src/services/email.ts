import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: parseInt(process.env.EMAIL_SERVER_PORT ?? "587"),
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

export async function sendUnfollowNotification(
  toEmail: string,
  toName: string,
  unfollowedBy: string[]
) {
  const list = unfollowedBy
    .map((u) => `<li><a href="https://instagram.com/${u}">@${u}</a></li>`)
    .join("");

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: toEmail,
    subject: `😢 ${unfollowedBy.length} pessoa(s) deixou de te seguir no Instagram`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
        <h2 style="color:#e1306c">InstaSorry</h2>
        <p>Olá, <strong>${toName}</strong>!</p>
        <p>Detectamos que ${unfollowedBy.length} pessoa(s) deixou de te seguir:</p>
        <ul>${list}</ul>
        <p style="font-size:12px;color:#888">
          Para deixar de receber esses alertas, acesse as configurações do InstaSorry.
        </p>
      </div>
    `,
  });
}

export async function sendNewFollowerNotification(
  toEmail: string,
  toName: string,
  newFollowers: string[]
) {
  const list = newFollowers
    .map((u) => `<li><a href="https://instagram.com/${u}">@${u}</a></li>`)
    .join("");

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: toEmail,
    subject: `🎉 ${newFollowers.length} novo(s) seguidor(es) no Instagram`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
        <h2 style="color:#e1306c">InstaSorry</h2>
        <p>Olá, <strong>${toName}</strong>!</p>
        <p>${newFollowers.length} pessoa(s) começou a te seguir:</p>
        <ul>${list}</ul>
      </div>
    `,
  });
}

export async function sendWelcomeEmail(toEmail: string, toName: string) {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: toEmail,
    subject: "Bem-vindo ao InstaSorry! 🎉",
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
        <h2 style="color:#e1306c">Bem-vindo ao InstaSorry!</h2>
        <p>Olá, <strong>${toName}</strong>!</p>
        <p>Sua conta foi criada com sucesso. Agora você pode:</p>
        <ul>
          <li>Ver quem não te segue de volta</li>
          <li>Descobrir quem deixou de te seguir</li>
          <li>Receber alertas automáticos</li>
        </ul>
        <p>Para começar, faça o upload dos seus dados do Instagram em <strong>Dashboard → Importar</strong>.</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard"
           style="background:#e1306c;color:#fff;padding:12px 24px;text-decoration:none;border-radius:6px;display:inline-block;margin-top:16px">
          Acessar Dashboard
        </a>
      </div>
    `,
  });
}
