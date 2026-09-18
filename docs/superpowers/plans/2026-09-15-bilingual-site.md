# Riego Central Bilingual Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish the complete Riego Central site in Spanish and English while preserving one React application, one contact endpoint, Turnstile, Resend, tracking IDs, complaint routing, and prelaunch noindex behavior.

**Architecture:** The React app derives `Locale = 'es' | 'en'` from `window.location.pathname` and renders all commercial/form/modal copy from a typed `src/content.ts` dictionary. Spanish remains `/`; English uses `/en/`. Legal pages remain static HTML with language-equivalent routes. The backend accepts a normalized `locale`, localizes validation responses and the customer receipt, while internal operational mail remains Spanish and records the request language.

**Tech Stack:** React 19, TypeScript, Vite 6, native CSS, Cloudflare Pages/Functions, Resend, Turnstile.

**Spec:** `docs/superpowers/specs/2026-09-15-bilingual-site-design.md`

## Global Constraints

- Do not add dependencies.
- Spanish remains canonical content at `/`; English uses `/en/`.
- Do not activate indexing: retain `noindex,nofollow` and `Disallow: /`.
- Do not invent commercial or legal claims.
- Preserve the existing Turnstile lifecycle, Resend batch flow, tracking ID format, complaint routing, CC behavior, and modal accessibility.
- English legal text must faithfully translate the current Spanish legal pages without expanding obligations.

---

### Task 1: Bilingual React content and language selector

**Files:**
- Create: `src/content.ts`
- Modify: `src/App.tsx`
- Modify: `src/styles.css`
- Test: `tests/compliance-seo.test.mjs`

**Interfaces:**
- Produces: `type Locale = 'es' | 'en'`, `contentByLocale`, `getLocaleFromPathname(pathname)`.
- App sends `locale` in the existing `/api/contact` JSON payload.

- [ ] Add failing tests for `/en/` detection, English content, `ES | EN`, English form options, localized modal/error copy, and `locale` payload.
- [ ] Run tests and confirm the new assertions fail because bilingual content is absent.
- [ ] Create typed bilingual content and refactor `App.tsx` to use it without duplicating business logic.
- [ ] Add compact accessible language-switch styles for desktop/mobile.
- [ ] Run tests and confirm Task 1 assertions pass.

### Task 2: Localize contact backend and client receipt

**Files:**
- Modify: `functions/api/contact.ts`
- Test: `tests/compliance-seo.test.mjs`

**Interfaces:**
- Consumes: payload `locale` as `es|en`.
- Produces: localized API validation errors and customer receipt; internal message includes `Idioma: Español|English`.

- [ ] Add failing tests for locale normalization, English receipt subject/body/disclaimer, Spanish receipt preservation, English complaint mapping, and internal language marker.
- [ ] Run tests and confirm expected failures.
- [ ] Implement normalized locale and localized text while preserving one batch request and existing routing.
- [ ] Run tests and confirm Task 2 assertions pass.

### Task 3: English entry document and international SEO metadata

**Files:**
- Modify: `index.html`
- Create: `en/index.html`
- Modify: `vite.config.ts`
- Test: `tests/compliance-seo.test.mjs`

**Interfaces:**
- `/` has Spanish metadata and hreflang to `/en/`.
- `/en/` has English metadata, English schema/FAQ, canonical `/en/`, and loads the same React entry module.

- [ ] Add failing tests for `lang`, canonical, hreflang, OG locale, schema language, and English entry existence.
- [ ] Run tests and confirm failures.
- [ ] Add Spanish alternate links to `index.html`, create English entry HTML using the same React app, and add dev-server rewrite for `/en/`.
- [ ] Run tests and confirm Task 3 assertions pass.

### Task 4: English legal pages and equivalent language navigation

**Files:**
- Create: `public/en/privacy/index.html`
- Create: `public/en/terms/index.html`
- Create: `public/en/complaints/index.html`
- Modify: `public/privacidad/index.html`
- Modify: `public/terminos/index.html`
- Modify: `public/reclamos/index.html`
- Modify: `vite.config.ts`
- Modify: `public/_headers`
- Test: `tests/compliance-seo.test.mjs`

**Interfaces:**
- Legal language switch always points to the equivalent page.
- Each legal page has canonical + `es-CR`, `en`, `x-default` alternates and retains `noindex,nofollow`.

- [ ] Add failing tests for all English legal pages, translated headings, equivalent selectors, canonical/hreflang, and direct dev routes.
- [ ] Run tests and confirm failures.
- [ ] Create faithful English translations and add language navigation/alternate metadata to both language sets.
- [ ] Add Vite direct-route rewrites and `no-transform` headers for English HTML routes.
- [ ] Run tests and confirm Task 4 assertions pass.

### Task 5: Sitemap, production build, deployment and route verification

**Files:**
- Modify: `public/sitemap.xml`
- Verify: `public/robots.txt`

**Interfaces:**
- Sitemap exposes exactly the eight approved URLs; robots remains prelaunch-blocking.

- [ ] Add failing tests for all eight sitemap URLs and unchanged `Disallow: /`.
- [ ] Run tests and confirm sitemap assertions fail before update.
- [ ] Update sitemap with all eight routes and current `lastmod`.
- [ ] Run full `npm run test` and require all tests green.
- [ ] Run `VITE_TURNSTILE_SITE_KEY=... npm run build` and require TypeScript/Vite success.
- [ ] Deploy `dist` to Cloudflare Pages `riego-central` production branch using protected credential wrapper and Wrangler 4.80.0.
- [ ] Verify HTTP 200 and expected language metadata/content for `/`, `/en/`, all six legal routes, sitemap and robots.
- [ ] Verify `/api/contact` still rejects a request without Turnstile token with HTTP 400.
