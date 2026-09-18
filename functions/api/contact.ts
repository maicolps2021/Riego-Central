interface Env {
  RESEND_API_KEY: string;
  CONTACT_TO_EMAIL: string;
  CONTACT_CC_EMAIL?: string;
  CONTACT_COMPLAINT_EMAIL?: string;
  CONTACT_FROM_EMAIL: string;
  TURNSTILE_SECRET_KEY: string;
  TURNSTILE_ALLOWED_HOSTNAMES: string;
  TURNSTILE_EXPECTED_ACTION: string;
}

type ContactPayload = {
  name?: unknown;
  phone?: unknown;
  email?: unknown;
  service?: unknown;
  location?: unknown;
  message?: unknown;
  privacyConsent?: unknown;
  locale?: unknown;
  'cf-turnstile-response'?: unknown;
  company?: unknown;
};

const json = (body: Record<string, unknown>, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });

const clean = (value: unknown, max: number) =>
  typeof value === 'string' ? value.trim().slice(0, max) : '';

const escapeHtml = (value: string) =>
  value.replace(/[&<>'"]/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;',
  })[char] ?? char);

const createTrackingId = () => {
  const date = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Costa_Rica',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date()).replace(/-/g, '');
  const random = crypto.randomUUID().replace(/-/g, '').slice(0, 8).toUpperCase();
  return `RC-${date}-${random}`;
};

const formatReceivedAt = (locale: 'es' | 'en') => new Intl.DateTimeFormat(locale === 'en' ? 'en-US' : 'es-CR', {
  timeZone: 'America/Costa_Rica',
  dateStyle: 'long',
  timeStyle: 'short',
}).format(new Date());

const emailShell = (
  title: string,
  preheader: string,
  body: string,
  trackingId: string,
  locale: 'es' | 'en' = 'es',
) => {
  const isEnglish = locale === 'en';
  const tagline = isEnglish
    ? 'Irrigation, water and technical services · Costa Rica'
    : 'Riego, agua y servicios técnicos · Costa Rica';
  const trackingLabel = isEnglish ? 'Tracking ID' : 'ID de seguimiento';
  const homeUrl = isEnglish ? 'https://riegocentral.com/en/' : 'https://riegocentral.com/';
  const privacyUrl = isEnglish ? 'https://riegocentral.com/en/privacy/' : 'https://riegocentral.com/privacidad/';
  const termsUrl = isEnglish ? 'https://riegocentral.com/en/terms/' : 'https://riegocentral.com/terminos/';
  const complaintsUrl = isEnglish ? 'https://riegocentral.com/en/complaints/' : 'https://riegocentral.com/reclamos/';
  const privacyLabel = isEnglish ? 'Privacy' : 'Privacidad';
  const termsLabel = isEnglish ? 'Terms' : 'Términos';
  const complaintsLabel = isEnglish ? 'Complaints' : 'Reclamos';

  return `
<!doctype html>
<html lang="${locale}">
  <body style="margin:0;padding:0;background:#f3f1e8;font-family:Arial,Helvetica,sans-serif;color:#20312d;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${escapeHtml(preheader)}</div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;background:#f3f1e8;">
      <tr>
        <td align="center" style="padding:32px 14px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;max-width:640px;background:#ffffff;border:1px solid #dfe5e1;border-radius:18px;overflow:hidden;">
            <tr>
              <td style="padding:30px 34px;background:#143d35;color:#ffffff;">
                <div style="font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#b9d4c9;font-weight:700;">Riego Central</div>
                <h1 style="margin:10px 0 8px;font-size:26px;line-height:1.2;color:#ffffff;">${escapeHtml(title)}</h1>
                <div style="font-size:14px;line-height:1.5;color:#d8e8e2;">${escapeHtml(tagline)}</div>
              </td>
            </tr>
            <tr>
              <td style="padding:28px 34px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;margin:0 0 24px;background:#eef5f1;border:1px solid #d7e7df;border-radius:12px;">
                  <tr>
                    <td style="padding:16px 18px;">
                      <div style="font-size:11px;letter-spacing:1.4px;text-transform:uppercase;color:#58756b;font-weight:700;">${trackingLabel}</div>
                      <div style="margin-top:5px;font-size:20px;line-height:1.2;color:#143d35;font-weight:800;letter-spacing:.3px;">${escapeHtml(trackingId)}</div>
                    </td>
                  </tr>
                </table>
                ${body}
              </td>
            </tr>
            <tr>
              <td style="padding:20px 34px;background:#f7f8f5;border-top:1px solid #e4e8e5;color:#697773;font-size:12px;line-height:1.6;">
                Riego Central · Costa Rica · <a href="${homeUrl}" style="color:#245f4f;">riegocentral.com</a><br>
                <a href="${privacyUrl}" style="color:#245f4f;">${privacyLabel}</a> · <a href="${termsUrl}" style="color:#245f4f;">${termsLabel}</a> · <a href="${complaintsUrl}" style="color:#245f4f;">${complaintsLabel}</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
};

const detailRow = (label: string, value: string) => `
<tr>
  <td style="padding:9px 0;width:145px;color:#65756f;font-size:13px;vertical-align:top;">${escapeHtml(label)}</td>
  <td style="padding:9px 0;color:#20312d;font-size:14px;font-weight:600;vertical-align:top;">${escapeHtml(value)}</td>
</tr>`;

export const onRequestPost = async (context: { request: Request; env: Env }) => {
  let payload: ContactPayload;

  try {
    payload = (await context.request.json()) as ContactPayload;
  } catch {
    return json({ ok: false, error: 'Solicitud inválida.' }, 400);
  }

  if (clean(payload.company, 200)) {
    return json({ ok: true });
  }

  const name = clean(payload.name, 100);
  const phone = clean(payload.phone, 30);
  const email = clean(payload.email, 160).toLowerCase();
  const service = clean(payload.service, 100);
  const location = clean(payload.location, 160);
  const message = clean(payload.message, 2000);
  const privacyConsent = clean(payload.privacyConsent, 20).toLowerCase();
  const requestedLocale = clean(payload.locale, 8).toLowerCase();
  const locale = requestedLocale === 'en' ? 'en' : 'es';
  const turnstileToken = clean(payload['cf-turnstile-response'], 2048);

  const errorText = {
    invalidFields: locale === 'en' ? 'Please complete all fields correctly.' : 'Complete correctamente todos los campos.',
    privacy: locale === 'en' ? 'You must accept the Privacy Policy to send the request.' : 'Debe aceptar la Política de Privacidad para enviar la solicitud.',
    turnstileConfig: locale === 'en' ? 'Anti-spam verification is not configured yet.' : 'La verificación anti-spam aún no está configurada.',
    turnstileMissing: locale === 'en' ? 'Complete the anti-spam verification.' : 'Complete la verificación anti-spam.',
    turnstileUnavailable: locale === 'en' ? 'We could not verify the form.' : 'No fue posible verificar el formulario.',
    turnstileInvalid: locale === 'en' ? 'The anti-spam verification was not valid. Please try again.' : 'La verificación anti-spam no fue válida. Intente nuevamente.',
    emailConfig: locale === 'en' ? 'Site email is not configured yet.' : 'El correo del sitio aún no está configurado.',
    emailSend: locale === 'en' ? 'We could not send the email. Please try again or use WhatsApp.' : 'No fue posible enviar el correo. Intente nuevamente o utilice WhatsApp.',
  };

  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const acceptedPrivacy = ['on', 'true', 'accepted', 'acepto'].includes(privacyConsent);

  if (!name || !phone || !validEmail || !service || !location || !message) {
    return json({ ok: false, error: errorText.invalidFields }, 400);
  }

  if (!acceptedPrivacy) {
    return json({ ok: false, error: errorText.privacy }, 400);
  }

  if (!context.env.TURNSTILE_SECRET_KEY || !context.env.TURNSTILE_ALLOWED_HOSTNAMES || !context.env.TURNSTILE_EXPECTED_ACTION) {
    return json({ ok: false, error: errorText.turnstileConfig }, 503);
  }

  if (!turnstileToken) {
    return json({ ok: false, error: errorText.turnstileMissing }, 400);
  }

  const remoteip = context.request.headers.get('CF-Connecting-IP') || undefined;
  const allowedHostnames = context.env.TURNSTILE_ALLOWED_HOSTNAMES
    .split(',')
    .map((hostname) => hostname.trim().toLowerCase())
    .filter(Boolean);

  let turnstileResult: {
    success?: boolean;
    hostname?: string;
    action?: string;
    'error-codes'?: string[];
  };

  try {
    const verificationResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        secret: context.env.TURNSTILE_SECRET_KEY,
        response: turnstileToken,
        remoteip,
      }),
    });

    if (!verificationResponse.ok) {
      console.error('Turnstile Siteverify rejected request', verificationResponse.status);
      return json({ ok: false, error: errorText.turnstileUnavailable }, 502);
    }

    turnstileResult = await verificationResponse.json() as typeof turnstileResult;
  } catch {
    return json({ ok: false, error: errorText.turnstileUnavailable }, 502);
  }

  const verifiedHostname = turnstileResult.hostname?.toLowerCase() ?? '';
  const expectedAction = context.env.TURNSTILE_EXPECTED_ACTION.trim();
  const verifiedAction = turnstileResult.action ?? '';
  const validTurnstile =
    turnstileResult.success === true &&
    verifiedAction === expectedAction &&
    allowedHostnames.includes(verifiedHostname);

  if (!validTurnstile) {
    console.error('Turnstile validation failed', turnstileResult['error-codes'] ?? []);
    return json({ ok: false, error: errorText.turnstileInvalid }, 400);
  }

  if (!context.env.RESEND_API_KEY || !context.env.CONTACT_TO_EMAIL || !context.env.CONTACT_FROM_EMAIL) {
    return json({ ok: false, error: errorText.emailConfig }, 503);
  }

  const trackingId = createTrackingId();
  const receivedAt = formatReceivedAt(locale);
  const isComplaint = service === 'Queja / reclamo';
  const isGeneralInquiry = service === 'Consulta general';
  const internalRecipient = isComplaint
    ? (context.env.CONTACT_COMPLAINT_EMAIL || 'reclamos@riegocentral.com')
    : context.env.CONTACT_TO_EMAIL;
  const requestLabel = isComplaint ? 'queja o reclamo' : isGeneralInquiry ? 'consulta' : 'solicitud';
  const languageLabel = locale === 'en' ? 'English' : 'Español';
  const englishServiceLabels: Record<string, string> = {
    'Riego por aspersión': 'Sprinkler irrigation',
    'Riego por goteo': 'Drip irrigation',
    'Controles y sensores de riego': 'Irrigation controls and sensors',
    'Mantenimiento de riego': 'Irrigation maintenance',
    'Tanques y bombeo': 'Water tanks and pumping',
    'Fontanería': 'Plumbing',
    'Canchas / proyecto especial': 'Fields / special project',
    'Consulta general': 'General inquiry',
    'Queja / reclamo': 'Complaint / claim',
    'Otro': 'Other',
  };
  const customerService = locale === 'en' ? (englishServiceLabels[service] || service) : service;
  const receiptTitle = locale === 'en'
    ? (isComplaint ? 'We received your complaint' : isGeneralInquiry ? 'We received your inquiry' : 'We received your request')
    : (isComplaint ? 'Recibimos su queja o reclamo' : isGeneralInquiry ? 'Recibimos su consulta' : 'Recibimos su solicitud');
  const receiptDisclaimer = locale === 'en'
    ? (isComplaint
      ? 'This receipt only confirms that we received your complaint. It does not imply acceptance of responsibility or a favorable resolution of the case.'
      : 'This receipt only confirms that we received your request. It does not constitute a quote, acceptance of the work, contract, reservation, warranty, price, or commitment to a date.')
    : (isComplaint
      ? 'Este acuse confirma únicamente la recepción del reclamo. No implica aceptación de responsabilidad ni una resolución favorable del caso.'
      : 'Este acuse confirma únicamente la recepción de su solicitud. No constituye una cotización, aceptación del trabajo, contrato, reserva, garantía, precio ni compromiso de fecha.');

  const businessBody = `
    <p style="margin:0 0 18px;color:#42544e;font-size:14px;line-height:1.7;">Se recibió una nueva ${requestLabel} desde el sitio web.</p>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;border-top:1px solid #e6ebe8;border-bottom:1px solid #e6ebe8;">
      ${detailRow('Fecha de recepción', receivedAt)}
      ${detailRow('Nombre', name)}
      ${detailRow('Teléfono', phone)}
      ${detailRow('Correo', email)}
      ${detailRow('Servicio / motivo', service)}
      ${detailRow('Zona', location)}
      ${detailRow('Idioma', languageLabel)}
    </table>
    <div style="margin-top:22px;">
      <div style="margin-bottom:8px;color:#65756f;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Mensaje</div>
      <div style="padding:16px 18px;background:#f7f8f5;border-left:4px solid #2f7559;border-radius:8px;color:#20312d;font-size:14px;line-height:1.7;">${escapeHtml(message).replace(/\n/g, '<br>')}</div>
    </div>
    <p style="margin:22px 0 0;color:#65756f;font-size:12px;line-height:1.6;">Responda a este correo para contestar directamente a ${escapeHtml(email)}.</p>`;

  const clientBody = locale === 'en' ? `
    <p style="margin:0 0 12px;color:#20312d;font-size:16px;line-height:1.7;">Hello ${escapeHtml(name)},</p>
    <p style="margin:0 0 22px;color:#42544e;font-size:14px;line-height:1.7;">Riego Central received your ${isComplaint ? 'complaint' : isGeneralInquiry ? 'inquiry' : 'request'} successfully. Keep the tracking ID for any future follow-up.</p>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;border-top:1px solid #e6ebe8;border-bottom:1px solid #e6ebe8;">
      ${detailRow('Date received', receivedAt)}
      ${detailRow('Service / reason', customerService)}
      ${detailRow('Location', location)}
    </table>
    <div style="margin-top:22px;">
      <div style="margin-bottom:8px;color:#65756f;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Details submitted</div>
      <div style="padding:16px 18px;background:#f7f8f5;border-radius:8px;color:#20312d;font-size:14px;line-height:1.7;">${escapeHtml(message).replace(/\n/g, '<br>')}</div>
    </div>
    <div style="margin:24px 0 0;padding:16px 18px;background:#fff8e8;border:1px solid #ead9aa;border-radius:10px;color:#66552c;font-size:13px;line-height:1.65;"><strong>Important:</strong> ${escapeHtml(receiptDisclaimer)}</div>
    <p style="margin:24px 0 8px;color:#42544e;font-size:14px;line-height:1.7;">For follow-up, reply to this email, write to <a href="mailto:${escapeHtml(internalRecipient)}" style="color:#245f4f;font-weight:700;">${escapeHtml(internalRecipient)}</a>, or contact us on WhatsApp at <a href="https://wa.me/50686310650" style="color:#245f4f;font-weight:700;">+506 8631-0650</a>.</p>
    <p style="margin:0;color:#65756f;font-size:12px;line-height:1.6;">For complaints or claims: <a href="mailto:reclamos@riegocentral.com" style="color:#245f4f;">reclamos@riegocentral.com</a>.</p>` : `
    <p style="margin:0 0 12px;color:#20312d;font-size:16px;line-height:1.7;">Hola ${escapeHtml(name)},</p>
    <p style="margin:0 0 22px;color:#42544e;font-size:14px;line-height:1.7;">Riego Central recibió correctamente su ${requestLabel}. Conserve el ID de seguimiento para cualquier consulta posterior.</p>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;border-top:1px solid #e6ebe8;border-bottom:1px solid #e6ebe8;">
      ${detailRow('Fecha de recepción', receivedAt)}
      ${detailRow('Servicio / motivo', service)}
      ${detailRow('Zona', location)}
    </table>
    <div style="margin-top:22px;">
      <div style="margin-bottom:8px;color:#65756f;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Detalle enviado</div>
      <div style="padding:16px 18px;background:#f7f8f5;border-radius:8px;color:#20312d;font-size:14px;line-height:1.7;">${escapeHtml(message).replace(/\n/g, '<br>')}</div>
    </div>
    <div style="margin:24px 0 0;padding:16px 18px;background:#fff8e8;border:1px solid #ead9aa;border-radius:10px;color:#66552c;font-size:13px;line-height:1.65;"><strong>Importante:</strong> ${escapeHtml(receiptDisclaimer)}</div>
    <p style="margin:24px 0 8px;color:#42544e;font-size:14px;line-height:1.7;">Para seguimiento puede responder este correo, escribir a <a href="mailto:${escapeHtml(internalRecipient)}" style="color:#245f4f;font-weight:700;">${escapeHtml(internalRecipient)}</a> o contactar por WhatsApp al <a href="https://wa.me/50686310650" style="color:#245f4f;font-weight:700;">+506 8631-0650</a>.</p>
    <p style="margin:0;color:#65756f;font-size:12px;line-height:1.6;">Para reclamos o quejas: <a href="mailto:reclamos@riegocentral.com" style="color:#245f4f;">reclamos@riegocentral.com</a>.</p>`;

  const businessText = [
    `Riego Central — Nueva ${requestLabel}`,
    `ID de seguimiento: ${trackingId}`,
    `Fecha de recepción: ${receivedAt}`,
    `Nombre: ${name}`,
    `Teléfono: ${phone}`,
    `Correo: ${email}`,
    `Servicio / motivo: ${service}`,
    `Zona: ${location}`,
    `Idioma: ${languageLabel}`,
    `Mensaje: ${message}`,
  ].join('\n');

  const clientText = locale === 'en' ? [
    receiptTitle,
    `Tracking ID: ${trackingId}`,
    `Date received: ${receivedAt}`,
    `Service / reason: ${customerService}`,
    `Location: ${location}`,
    `Details submitted: ${message}`,
    receiptDisclaimer,
    `Follow-up: ${internalRecipient} · WhatsApp +506 8631-0650`,
    'Complaints: reclamos@riegocentral.com',
  ].join('\n') : [
    receiptTitle,
    `ID de seguimiento: ${trackingId}`,
    `Fecha de recepción: ${receivedAt}`,
    `Servicio / motivo: ${service}`,
    `Zona: ${location}`,
    `Detalle enviado: ${message}`,
    receiptDisclaimer,
    `Seguimiento: ${internalRecipient} · WhatsApp +506 8631-0650`,
    'Reclamos: reclamos@riegocentral.com',
  ].join('\n');

  const response = await fetch('https://api.resend.com/emails/batch', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${context.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
      'Idempotency-Key': `riego-central-contact/${trackingId}`,
    },
    body: JSON.stringify([
      {
        from: context.env.CONTACT_FROM_EMAIL,
        to: [internalRecipient],
        ...(context.env.CONTACT_CC_EMAIL ? { cc: [context.env.CONTACT_CC_EMAIL] } : {}),
        reply_to: email,
        subject: `[${trackingId}] ${service} — ${name}`,
        tags: [{ name: 'request_id', value: trackingId }],
        html: emailShell(`Nueva ${requestLabel}`, `${service} · ${name}`, businessBody, trackingId, 'es'),
        text: businessText,
      },
      {
        from: context.env.CONTACT_FROM_EMAIL,
        to: [email],
        reply_to: internalRecipient,
        subject: `${receiptTitle} — ${trackingId}`,
        tags: [{ name: 'request_id', value: trackingId }],
        html: emailShell(receiptTitle, `ID ${trackingId}`, clientBody, trackingId, locale),
        text: clientText,
      },
    ]),
  });

  if (!response.ok) {
    console.error('Resend rejected contact request batch', response.status);
    return json({ ok: false, error: errorText.emailSend }, 502);
  }

  return json({ ok: true, trackingId });
};
