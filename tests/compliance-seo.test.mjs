import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = (path) => fs.readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

const app = read('src/App.tsx');
const index = read('index.html');
const contact = read('functions/api/contact.ts');
const content = read('src/content.ts');
const envExample = read('.env.example');

test('legal pages exist and identify Riego Central', () => {
  for (const path of ['public/privacidad/index.html', 'public/terminos/index.html', 'public/reclamos/index.html']) {
    assert.equal(fs.existsSync(new URL(`../${path}`, import.meta.url)), true, `${path} should exist`);
    assert.match(read(path), /Riego Central/);
  }
});

test('home links to legal pages and requires privacy consent', () => {
  assert.match(app, /privacyHref = locale === 'en' \? '\/en\/privacy\/' : '\/privacidad\/'/);
  assert.match(app, /termsHref = locale === 'en' \? '\/en\/terms\/' : '\/terminos\/'/);
  assert.match(app, /complaintsHref = locale === 'en' \? '\/en\/complaints\/' : '\/reclamos\/'/);
  assert.match(app, /name="privacyConsent"/);
  assert.match(app, /required/);
  assert.match(content, /Política de Privacidad/);
  assert.match(content, /Privacy Policy/);
});

test('server validates privacy consent', () => {
  assert.match(contact, /privacyConsent/);
  assert.match(contact, /aceptar la Pol[ií]tica de Privacidad/i);
});

test('contact form includes Cloudflare Turnstile with explicit lifecycle management', () => {
  assert.match(index, /challenges\.cloudflare\.com\/turnstile\/v0\/api\.js\?render=explicit/);
  assert.match(app, /VITE_TURNSTILE_SITE_KEY/);
  assert.match(app, /turnstile\.render/);
  assert.match(app, /action:\s*'contact-form'/);
  assert.match(app, /turnstile\.reset\(widgetId\)/);
});

test('server requires and validates Turnstile tokens', () => {
  assert.match(contact, /TURNSTILE_SECRET_KEY/);
  assert.match(contact, /TURNSTILE_ALLOWED_HOSTNAMES/);
  assert.match(contact, /TURNSTILE_EXPECTED_ACTION/);
  assert.match(contact, /cf-turnstile-response/);
  assert.match(contact, /challenges\.cloudflare\.com\/turnstile\/v0\/siteverify/);
  assert.match(envExample, /TURNSTILE_EXPECTED_ACTION=contact-form/);
});


test('contact API creates and returns a tracking id', () => {
  assert.match(contact, /RC-/);
  assert.match(contact, /crypto\.randomUUID/);
  assert.match(contact, /trackingId/);
  assert.match(contact, /json\(\{ ok: true, trackingId \}\)/);
});

test('contact API sends the business notification and client receipt with the same tracking id', () => {
  assert.match(contact, /api\.resend\.com\/emails\/batch/);
  assert.match(contact, /to: \[email\]/);
  assert.match(contact, /Recibimos su solicitud/);
  assert.match(contact, /no constituye una cotizaci[oó]n/i);
  assert.match(contact, /reclamos@riegocentral\.com/);
});

test('site exposes the tracking id after submission and explains how to use it', () => {
  const terms = read('public/terminos/index.html');
  const claims = read('public/reclamos/index.html');
  assert.match(app, /trackingId/);
  assert.match(content, /ID de seguimiento/);
  assert.match(content, /Tracking ID/);
  assert.match(terms, /ID de seguimiento/);
  assert.match(claims, /ID de seguimiento/);
});


test('contact emails use a branded HTML email layout', () => {
  assert.match(contact, /role=\"presentation\"/);
  assert.match(contact, /max-width:\s*640px/);
  assert.match(contact, /Riego Central/);
  assert.match(contact, /background:\s*#143d35/i);
  assert.match(contact, /text:/);
});

test('form shows API errors prominently while successful submissions use the tracking modal', () => {
  const styles = read('src/styles.css');
  assert.match(app, /errorMessage/);
  assert.match(app, /form-feedback error/);
  assert.match(content, /No pudimos enviar la solicitud/);
  assert.match(content, /We could not send your request/);
  assert.match(app, /role="alert"/);
  assert.match(styles, /\.form-feedback\.error/);
});

test('contact form includes general inquiry and complaint options and routes complaints to the complaint inbox', () => {
  assert.match(content, /Consulta general/);
  assert.match(content, /General inquiry/);
  assert.match(content, /Queja \/ reclamo/);
  assert.match(content, /Complaint \/ claim/);
  assert.match(contact, /CONTACT_COMPLAINT_EMAIL/);
  assert.match(contact, /service === 'Queja \/ reclamo'/);
  assert.match(envExample, /CONTACT_COMPLAINT_EMAIL=reclamos@riegocentral\.com/);
});

test('successful submission opens an accessible tracking modal with copy and close actions', () => {
  const styles = read('src/styles.css');
  assert.match(app, /role="dialog"/);
  assert.match(app, /aria-modal="true"/);
  assert.match(content, /Solicitud recibida/);
  assert.match(content, /Request received/);
  assert.match(content, /Copiar ID/);
  assert.match(content, /Copy ID/);
  assert.match(app, /navigator\.clipboard\.writeText/);
  assert.match(app, /event\.key === 'Escape'/);
  assert.match(app, /success-modal-backdrop/);
  assert.match(styles, /\.success-modal-backdrop/);
  assert.match(styles, /\.success-modal-card/);
});

test('home includes FAQ content for answer engines', () => {
  assert.match(app, /id="preguntas-frecuentes"/);
  assert.match(content, /¿En qué zonas de Costa Rica atienden\?/);
  assert.match(content, /¿Cómo solicito una cotización\?/);
  assert.match(content, /What areas of Costa Rica do you serve\?/);
  assert.match(content, /How do I request a quote\?/);
});

test('Spanish commercial metadata is ready for production indexing', () => {
  assert.match(index, /<html lang="es-CR">/);
  assert.match(index, /<link rel="canonical" href="https:\/\/riegocentral\.com\/"/);
  assert.match(index, /property="og:title"/);
  assert.match(index, /property="og:locale" content="es_CR"/);
  assert.match(index, /name="geo.region" content="CR"/);
  assert.match(index, /application\/ld\+json/);
  assert.match(index, /FAQPage/);
  assert.match(index, /<meta name="robots" content="index,follow" \/>/);
  assert.doesNotMatch(index, /noindex,nofollow/);
});

test('production robots allows crawling and advertises the sitemap', () => {
  const robots = read('public/robots.txt');
  assert.match(robots, /User-agent:\s*\*/);
  assert.match(robots, /Allow:\s*\//);
  assert.doesNotMatch(robots, /Disallow:\s*\//);
  assert.match(robots, /Sitemap:\s*https:\/\/riegocentral\.com\/sitemap\.xml/);
});

test('React app detects English pathname and exposes a bilingual language switch', () => {
  const content = read('src/content.ts');
  assert.match(content, /export type Locale = 'es' \| 'en'/);
  assert.match(content, /getLocaleFromPathname/);
  assert.match(content, /pathname\.startsWith\('\/en\/'\)/);
  assert.match(app, /language-switch/);
  assert.match(app, />ES</);
  assert.match(app, />EN</);
  assert.match(app, /locale,?/);
});

test('English commercial content includes navigation, services, form, modal and FAQ copy', () => {
  const content = read('src/content.ts');
  assert.match(content, /Request a quote/);
  assert.match(content, /Sprinkler irrigation/);
  assert.match(content, /General inquiry/);
  assert.match(content, /Complaint \/ claim/);
  assert.match(content, /Request received/);
  assert.match(content, /Copy ID/);
  assert.match(content, /What areas of Costa Rica do you serve\?/);
});

test('contact backend normalizes locale and has English receipt while preserving Spanish receipt', () => {
  assert.match(contact, /locale\?: unknown/);
  assert.match(contact, /requestedLocale === 'en' \? 'en' : 'es'/);
  assert.match(contact, /We received your request/);
  assert.match(contact, /We received your complaint/);
  assert.match(contact, /does not constitute a quote/i);
  assert.match(contact, /Recibimos su solicitud/);
  assert.match(contact, /Idioma/);
  assert.match(contact, /English/);
});

test('Spanish and English entry documents contain canonical and hreflang metadata', () => {
  const englishIndex = read('en/index.html');
  assert.match(index, /hreflang="es-CR" href="https:\/\/riegocentral\.com\/"/);
  assert.match(index, /hreflang="en" href="https:\/\/riegocentral\.com\/en\/"/);
  assert.match(index, /hreflang="x-default" href="https:\/\/riegocentral\.com\/"/);
  assert.match(englishIndex, /<html lang="en">/);
  assert.match(englishIndex, /canonical" href="https:\/\/riegocentral\.com\/en\/"/);
  assert.match(englishIndex, /hreflang="es-CR" href="https:\/\/riegocentral\.com\/"/);
  assert.match(englishIndex, /hreflang="en" href="https:\/\/riegocentral\.com\/en\/"/);
  assert.match(englishIndex, /property="og:locale" content="en_US"/);
  assert.match(englishIndex, /"inLanguage": "en"/);
  assert.match(englishIndex, /FAQPage/);
  assert.match(englishIndex, /<meta name="robots" content="index,follow" \/>/);
  assert.doesNotMatch(englishIndex, /noindex,nofollow/);
});

test('English legal pages exist, preserve prelaunch noindex, and link to Spanish equivalents', () => {
  const pairs = [
    ['public/en/privacy/index.html', '/privacidad/', 'Privacy Policy'],
    ['public/en/terms/index.html', '/terminos/', 'Terms of Use'],
    ['public/en/complaints/index.html', '/reclamos/', 'Complaints and Claims'],
  ];
  for (const [path, spanishPath, heading] of pairs) {
    assert.equal(fs.existsSync(new URL(`../${path}`, import.meta.url)), true, `${path} should exist`);
    const page = read(path);
    assert.match(page, /<html lang="en">/);
    assert.match(page, /noindex,nofollow/);
    assert.match(page, new RegExp(heading));
    assert.match(page, new RegExp(`href="${spanishPath.replaceAll('/', '\\/')}"`));
    assert.match(page, /hreflang="en"/);
    assert.match(page, /hreflang="es-CR"/);
  }
});

test('Spanish legal pages expose equivalent English hreflang and language switch routes', () => {
  const pairs = [
    ['public/privacidad/index.html', '/en/privacy/'],
    ['public/terminos/index.html', '/en/terms/'],
    ['public/reclamos/index.html', '/en/complaints/'],
  ];
  for (const [path, englishPath] of pairs) {
    const page = read(path);
    assert.match(page, /hreflang="es-CR"/);
    assert.match(page, /hreflang="en"/);
    assert.match(page, new RegExp(`href="${englishPath.replaceAll('/', '\\/')}"`));
  }
});

test('Vite supports direct English app and legal routes without React Router', () => {
  const vite = read('vite.config.ts');
  assert.match(vite, /'\/en\/': '\/en\/index\.html'/);
  assert.match(vite, /'\/en\/privacy\/': '\/en\/privacy\/index\.html'/);
  assert.match(vite, /'\/en\/terms\/': '\/en\/terms\/index\.html'/);
  assert.match(vite, /'\/en\/complaints\/': '\/en\/complaints\/index\.html'/);
  assert.match(vite, /rollupOptions/);
  assert.match(vite, /en\/index\.html/);
});

test('sitemap contains only the two indexable commercial URLs with bilingual alternates', () => {
  const sitemap = read('public/sitemap.xml');
  for (const url of [
    'https://riegocentral.com/',
    'https://riegocentral.com/en/',
  ]) assert.match(sitemap, new RegExp(url.replaceAll('/', '\\/')));
  for (const url of [
    'https://riegocentral.com/privacidad/',
    'https://riegocentral.com/terminos/',
    'https://riegocentral.com/reclamos/',
    'https://riegocentral.com/en/privacy/',
    'https://riegocentral.com/en/terms/',
    'https://riegocentral.com/en/complaints/',
  ]) assert.doesNotMatch(sitemap, new RegExp(url.replaceAll('/', '\\/')));
  assert.match(sitemap, /hreflang="es-CR"/);
  assert.match(sitemap, /hreflang="en"/);
});

test('brand uses the supplied PNG logo and dedicated square SVG favicon', () => {
  assert.equal(fs.existsSync(new URL('../public/media/riego-central-logo.png', import.meta.url)), true, 'PNG logo should exist');
  assert.equal(fs.existsSync(new URL('../public/favicon.svg', import.meta.url)), true, 'favicon.svg should exist');
  const favicon = read('public/favicon.svg');
  assert.match(favicon, /width="158"/);
  assert.match(favicon, /height="158"/);
  assert.match(favicon, /viewBox="0 0 118\.5 118\.499997"/);
  for (const path of ['index.html', 'en/index.html', 'public/404.html', 'public/en/404.html', 'public/privacidad/index.html', 'public/terminos/index.html', 'public/reclamos/index.html', 'public/en/privacy/index.html', 'public/en/terms/index.html', 'public/en/complaints/index.html']) {
    const page = read(path);
    assert.match(page, /rel="icon" href="\/favicon\.svg" type="image\/svg\+xml"/);
  }
  assert.match(app, /src="\/media\/riego-central-logo\.png"/);
  assert.doesNotMatch(index, /riego-central-logo\.webp/);
  assert.doesNotMatch(read('en/index.html'), /riego-central-logo\.webp/);
});

test('search favicon has a square PNG fallback and mobile language switch remains visible', () => {
  assert.equal(fs.existsSync(new URL('../public/favicon-96x96.png', import.meta.url)), true, 'favicon-96x96.png should exist');
  for (const path of ['index.html', 'en/index.html', 'public/404.html', 'public/en/404.html', 'public/privacidad/index.html', 'public/terminos/index.html', 'public/reclamos/index.html', 'public/en/privacy/index.html', 'public/en/terms/index.html', 'public/en/complaints/index.html']) {
    const page = read(path);
    assert.match(page, /rel="icon" type="image\/png" sizes="96x96" href="\/favicon-96x96\.png"/);
    assert.match(page, /rel="icon" href="\/favicon\.svg" type="image\/svg\+xml"/);
  }
  const styles = read('src/styles.css');
  assert.match(styles, /nav\s*>\s*a:not\(\.nav-whatsapp\)\s*\{\s*display:\s*none;\s*\}/);
  assert.doesNotMatch(styles, /nav\s+a:not\(\.nav-whatsapp\)\s*\{\s*display:\s*none;\s*\}/);
});

test('real project media keeps the original gallery layout, adds recent work, and places video in the open grid cell', () => {
  for (const path of [
    'public/media/trabajo-reciente-1.webp',
    'public/media/trabajo-reciente-2.webp',
    'public/media/trabajo-reciente-video.mp4',
  ]) assert.equal(fs.existsSync(new URL(`../${path}`, import.meta.url)), true, `${path} should exist`);

  assert.doesNotMatch(app, /service-media-strip/);
  assert.doesNotMatch(app, /process-gallery/);
  assert.match(app, /gallery-lightbox/);
  assert.match(app, /role="dialog"/);
  assert.match(app, /loading="lazy"/);
  assert.match(app, /preload="none"/);
  assert.match(app, /trabajo-reciente-video\.mp4/);
  assert.match(app, /trabajo-reciente-1\.webp/);
  assert.match(app, /trabajo-reciente-2\.webp/);
  assert.match(app, /cls: 'work-item work-video'/);
  assert.doesNotMatch(app, /cls: 'work-item work-wide work-video'/);

  const styles = read('src/styles.css');
  assert.doesNotMatch(styles, /\.service-media-strip/);
  assert.doesNotMatch(styles, /\.process-gallery/);
  assert.match(styles, /\.gallery-lightbox/);
  assert.match(styles, /\.work-video\s+figcaption\s*\{[\s\S]*?top:\s*0;[\s\S]*?bottom:\s*auto;[\s\S]*?pointer-events:\s*none;/);
});

test('Cloudflare Pages has localized custom 404 documents instead of SPA soft-404 fallback', () => {
  const spanish404Path = 'public/404.html';
  const english404Path = 'public/en/404.html';
  assert.equal(fs.existsSync(new URL(`../${spanish404Path}`, import.meta.url)), true, `${spanish404Path} should exist`);
  assert.equal(fs.existsSync(new URL(`../${english404Path}`, import.meta.url)), true, `${english404Path} should exist`);

  const spanish404 = read(spanish404Path);
  const english404 = read(english404Path);
  assert.match(spanish404, /<html lang="es-CR">/);
  assert.match(spanish404, /noindex,follow/);
  assert.match(spanish404, /Página no encontrada/);
  assert.match(spanish404, /href="\/"/);
  assert.match(spanish404, /href="\/en\/"/);

  assert.match(english404, /<html lang="en">/);
  assert.match(english404, /noindex,follow/);
  assert.match(english404, /Page not found/);
  assert.match(english404, /href="\/en\/"/);
  assert.match(english404, /href="\/"/);
});
