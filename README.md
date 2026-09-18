# Riego Central — web

Sitio comercial de Riego Central para captar solicitudes de cotización de servicios de riego, agua y servicios técnicos en Costa Rica.

## Stack

- React 19
- Vite 6
- TypeScript
- CSS nativo
- Cloudflare Pages
- Cloudflare Pages Functions
- Cloudflare Turnstile
- Resend vía REST API, sin SDK adicional

## Desarrollo

```bash
npm install
npm run dev
npm run test
npm run build
```

## Formulario / correo

Endpoint: `POST /api/contact`

Variables requeridas en Cloudflare Pages / build:

- `VITE_TURNSTILE_SITE_KEY` — pública, disponible durante el build de Vite.
- `TURNSTILE_SECRET_KEY` — secreta, solo backend.
- `TURNSTILE_ALLOWED_HOSTNAMES` — producción: `riegocentral.com,www.riegocentral.com`.
- `TURNSTILE_EXPECTED_ACTION` — producción: `contact-form`.
- `RESEND_API_KEY`
- `CONTACT_TO_EMAIL` — previsto: `info@riegocentral.com`.
- `CONTACT_FROM_EMAIL` — previsto: `Riego Central <formularios@riegocentral.com>`.

`CONTACT_FROM_EMAIL` debe usar un dominio/remitente verificado en Resend.

El formulario valida los campos en cliente y servidor, escapa el contenido incorporado al correo, usa un honeypot, exige aceptación de privacidad y valida Cloudflare Turnstile mediante Siteverify en el backend. El backend también verifica el `hostname` y el `action` devueltos por Turnstile.

## Estado previo a producción

Implementado y probado localmente con Cloudflare Pages Runtime:

- formulario y validación de servidor;
- privacidad obligatoria;
- Turnstile, incluidos casos de validación válida e inválida con claves oficiales de prueba de Cloudflare;
- comunicación de la Function con la API de Resend (probada con una credencial ficticia para verificar manejo de rechazo).

Pendiente antes de declarar el formulario operativo en producción:

1. Comprar/activar `riegocentral.com`.
2. Crear/configurar el widget real de Turnstile para `riegocentral.com` y `www.riegocentral.com`.
3. Configurar `VITE_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`, `TURNSTILE_ALLOWED_HOSTNAMES` y `TURNSTILE_EXPECTED_ACTION` en Cloudflare.
4. Verificar `riegocentral.com` en Resend.
5. Crear/configurar `info@riegocentral.com`, `formularios@riegocentral.com` y el canal `reclamos@riegocentral.com` según corresponda.
6. Configurar `RESEND_API_KEY`, `CONTACT_TO_EMAIL` y `CONTACT_FROM_EMAIL` en Cloudflare Pages.
7. Hacer una prueba E2E y comprobar recepción real del correo.
8. Solo al lanzar producción, cambiar `robots.txt` y la meta robots para permitir indexación.

## SEO / legal

El proyecto ya contiene metadata social, canonical previsto para `https://riegocentral.com/`, JSON-LD, FAQ, sitemap y páginas de privacidad, términos y reclamos. Mientras el sitio siga en preview, la indexación permanece bloqueada intencionalmente.

## Filosofía técnica

Se priorizan capacidades nativas de React, navegador y Cloudflare. No se agregó un router, framework UI ni SDK de correo porque no son necesarios para este alcance.
