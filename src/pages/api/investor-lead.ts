import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  const cors = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: cors });
  }

  if (request.method !== 'POST') {
    return new Response(
      JSON.stringify({ success: false, error: 'Method not allowed' }),
      { status: 405, headers: { ...cors, 'Content-Type': 'application/json' } }
    );
  }

  let payload: { name?: unknown; email?: unknown; investmentAmount?: unknown };
  try {
    payload = await request.json();
  } catch {
    return new Response(
      JSON.stringify({ success: false, error: 'Invalid JSON' }),
      { status: 400, headers: { ...cors, 'Content-Type': 'application/json' } }
    );
  }

  const { name, email, investmentAmount } = payload;
  const fields: string[] = [];

  if (typeof name !== 'string' || !name.trim()) fields.push('name');
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (typeof email !== 'string' || !emailRe.test(email)) fields.push('email');
  const amount = Number(investmentAmount);
  if (!Number.isFinite(amount) || amount < 10000) fields.push('investmentAmount');

  if (fields.length) {
    return new Response(
      JSON.stringify({ success: false, error: 'Validation failed', fields }),
      { status: 400, headers: { ...cors, 'Content-Type': 'application/json' } }
    );
  }

  const lead = { name: name.trim(), email: email.trim(), investmentAmount: amount, receivedAt: new Date().toISOString() };
  const hasSmtp = Boolean(process.env.SMTP_HOST || process.env.SENDGRID_API_KEY || process.env.RESEND_API_KEY);
  if (hasSmtp) {
    console.log('[investor-lead] would send email:', lead);
  } else {
    console.log('[investor-lead] lead received (SMTP not configured):', lead);
  }

  return new Response(
    JSON.stringify({ success: true, message: 'Заявка принята. Мы свяжемся с вами в течение 24 часов.' }),
    { status: 200, headers: { ...cors, 'Content-Type': 'application/json' } }
  );
};
