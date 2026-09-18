import { FormEvent, useEffect, useRef, useState } from 'react';
import { contentByLocale, getLocaleFromPathname } from './content';

type FormStatus = 'idle' | 'sending' | 'sent' | 'error';
type ContactApiResponse = { ok?: boolean; trackingId?: string; error?: string };
type LightboxItem = { src: string; alt: string; title: string; meta: string };
type TurnstileApi = {
  render: (container: HTMLElement, options: { sitekey: string; action: string; theme: 'light'; size: 'flexible' }) => string;
  reset: (widgetId: string) => void;
  remove: (widgetId: string) => void;
};
type TurnstileWindow = Window & { turnstile?: TurnstileApi };

const whatsappHrefs = {
  es: 'https://wa.me/50686310650?text=Hola%2C%20quisiera%20solicitar%20una%20cotizaci%C3%B3n.',
  en: 'https://wa.me/50686310650?text=Hello%2C%20I%20would%20like%20to%20request%20a%20quote.',
} as const;
const turnstileSiteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY;

function ServiceIcon({ type }: { type: string }) {
  const common = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true };
  if (type === 'sprinkler') return <svg {...common}><path d="M5 18h14"/><path d="M12 18v-5"/><path d="M9 13h6"/><path d="M8 9c-1.8.4-3.1 1.2-4 2.3"/><path d="M16 9c1.8.4 3.1 1.2 4 2.3"/><path d="M10 7.5c-.9.2-1.7.6-2.4 1.2"/><path d="M14 7.5c.9.2 1.7.6 2.4 1.2"/></svg>;
  if (type === 'drop') return <svg {...common}><path d="M12 3s5 5.4 5 9.2A5 5 0 0 1 7 12.2C7 8.4 12 3 12 3Z"/><path d="M9.4 13.2c.5 1.4 1.5 2.1 3 2.2"/></svg>;
  if (type === 'sensor') return <svg {...common}><rect x="7" y="6" width="10" height="12" rx="2"/><path d="M10 10h4"/><path d="M12 13v2"/><path d="M4 9c-1.1 1.9-1.1 4.1 0 6"/><path d="M20 9c1.1 1.9 1.1 4.1 0 6"/></svg>;
  if (type === 'tools') return <svg {...common}><path d="M14.5 5.5a4 4 0 0 0-4.8 5.1L4.4 16a1.7 1.7 0 1 0 2.4 2.4l5.4-5.3a4 4 0 0 0 5.1-4.8l-2.4 2.4-2.2-.6-.6-2.2 2.4-2.4Z"/></svg>;
  if (type === 'pump') return <svg {...common}><path d="M6 19V9h9v10"/><path d="M9 9V6h4v3"/><path d="M15 12h3a2 2 0 0 1 2 2v2"/><path d="M4 19h14"/><circle cx="10.5" cy="14" r="2.2"/></svg>;
  return <svg {...common}><path d="M5 6v5a3 3 0 0 0 3 3h8a3 3 0 0 1 3 3v1"/><path d="M5 6h5"/><path d="M14 14v-4"/><path d="M12 10h4"/></svg>;
}

function App() {
  const locale = getLocaleFromPathname(window.location.pathname);
  const t = contentByLocale[locale];
  const whatsappHref = whatsappHrefs[locale];
  const [status, setStatus] = useState<FormStatus>('idle');
  const [trackingId, setTrackingId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedTrackingId, setCopiedTrackingId] = useState(false);
  const [lightbox, setLightbox] = useState<LightboxItem | null>(null);
  const turnstileContainerRef = useRef<HTMLDivElement>(null);
  const turnstileWidgetIdRef = useRef<string | null>(null);
  const submitButtonRef = useRef<HTMLButtonElement>(null);
  const modalCloseButtonRef = useRef<HTMLButtonElement>(null);
  const galleryCloseButtonRef = useRef<HTMLButtonElement>(null);
  const galleryTriggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    document.documentElement.lang = locale === 'en' ? 'en' : 'es-CR';
  }, [locale]);

  useEffect(() => {
    if (!turnstileSiteKey) return;
    let cancelled = false;
    let retryTimer: number | undefined;
    const renderTurnstile = () => {
      if (cancelled || turnstileWidgetIdRef.current) return;
      const turnstile = (window as TurnstileWindow).turnstile;
      const container = turnstileContainerRef.current;
      if (!turnstile || !container) {
        retryTimer = window.setTimeout(renderTurnstile, 100);
        return;
      }
      if (cancelled || turnstileWidgetIdRef.current || !turnstileContainerRef.current) return;
      turnstileWidgetIdRef.current = turnstile.render(turnstileContainerRef.current, { sitekey: turnstileSiteKey, action: 'contact-form', theme: 'light', size: 'flexible' });
    };
    renderTurnstile();
    return () => {
      cancelled = true;
      if (retryTimer !== undefined) window.clearTimeout(retryTimer);
      const turnstile = (window as TurnstileWindow).turnstile;
      const widgetId = turnstileWidgetIdRef.current;
      if (turnstile && widgetId) turnstile.remove(widgetId);
      turnstileWidgetIdRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (status !== 'sent' || !trackingId) return;
    modalCloseButtonRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') closeSuccessModal(); };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [status, trackingId]);

  useEffect(() => {
    if (!lightbox) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    galleryCloseButtonRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') closeLightbox(); };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [lightbox]);

  function openLightbox(item: LightboxItem) {
    galleryTriggerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setLightbox(item);
  }

  function closeLightbox() {
    setLightbox(null);
    window.requestAnimationFrame(() => galleryTriggerRef.current?.focus());
  }

  function closeSuccessModal() {
    setStatus('idle');
    setTrackingId(null);
    setCopiedTrackingId(false);
    window.requestAnimationFrame(() => submitButtonRef.current?.focus());
  }

  async function copyTrackingId() {
    if (!trackingId) return;
    try { await navigator.clipboard.writeText(trackingId); setCopiedTrackingId(true); } catch { setCopiedTrackingId(false); }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('sending');
    setTrackingId(null);
    setErrorMessage(null);
    setCopiedTrackingId(false);
    const form = event.currentTarget;
    const payload = { ...Object.fromEntries(new FormData(form).entries()), locale };
    try {
      const response = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const result = await response.json().catch(() => ({})) as ContactApiResponse;
      if (!response.ok || !result.trackingId) throw new Error(result.error || t.contact.errorFallback);
      form.reset();
      setTrackingId(result.trackingId);
      setErrorMessage(null);
      setStatus('sent');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : t.contact.errorFallback);
      setStatus('error');
    } finally {
      const turnstile = (window as TurnstileWindow).turnstile;
      const widgetId = turnstileWidgetIdRef.current;
      if (turnstile && widgetId) turnstile.reset(widgetId);
    }
  }

  const privacyHref = locale === 'en' ? '/en/privacy/' : '/privacidad/';
  const termsHref = locale === 'en' ? '/en/terms/' : '/terminos/';
  const complaintsHref = locale === 'en' ? '/en/complaints/' : '/reclamos/';

  return (
    <main id="top">
      <header className="site-header">
        <a className="brand" href={locale === 'en' ? '/en/#top' : '/#top'} aria-label="Riego Central — home">
          <span className="brand-logo-frame"><img className="brand-logo" src="/media/riego-central-logo.png" alt="Riego Central" /></span>
        </a>
        <nav aria-label={locale === 'en' ? 'Main navigation' : 'Navegación principal'}>
          <a href="#servicios">{t.nav.services}</a><a href="#trabajos">{t.nav.work}</a><a href="#proceso">{t.nav.process}</a>
          <div className="language-switch" aria-label={t.languageLabel}>
            <a href="/" className={locale === 'es' ? 'active' : ''} aria-current={locale === 'es' ? 'page' : undefined}>ES</a><span aria-hidden="true">|</span><a href="/en/" className={locale === 'en' ? 'active' : ''} aria-current={locale === 'en' ? 'page' : undefined}>EN</a>
          </div>
          <a className="nav-whatsapp" href={whatsappHref} target="_blank" rel="noreferrer">{t.nav.whatsapp}</a>
        </nav>
      </header>

      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-media" aria-hidden="true"><video autoPlay muted loop playsInline preload="metadata" poster="/media/riego-aspersion-1.jpg"><source src="/media/hero-riego.mp4" type="video/mp4" /></video><div className="hero-overlay" /></div>
        <div className="hero-content"><span className="eyebrow light">{t.hero.eyebrow}</span><h1 id="hero-title">{t.hero.title}</h1><p>{t.hero.text}</p><div className="hero-actions"><a className="button button-primary" href="#contacto">{t.hero.quote}</a><a className="button button-ghost" href={whatsappHref} target="_blank" rel="noreferrer">{t.hero.whatsapp}</a></div></div>
        <div className="hero-facts" aria-label={locale === 'en' ? 'Main information' : 'Información principal'}>{t.facts.map((fact) => <div key={fact.number}><span>{fact.number}</span><strong>{fact.title}</strong><small>{fact.text}</small></div>)}</div>
      </section>

      <section className="intro-strip" aria-label={locale === 'en' ? 'Coverage and quotes' : 'Cobertura y cotización'}><p>{t.intro.coverage} <strong>Costa Rica</strong></p><span aria-hidden="true">•</span><p><strong>{t.intro.quote}</strong></p><span aria-hidden="true">•</span><p>{t.intro.whatsapp} <strong>8631-0650</strong></p></section>

      <section className="section services-section" id="servicios">
        <div className="section-heading split-heading"><div><span className="eyebrow">{t.servicesHeading.eyebrow}</span><h2>{t.servicesHeading.title}</h2></div><p>{t.servicesHeading.text}</p></div>
        <div className="services-grid">{t.services.map((service) => <article className="service-card" key={service.title}><div className="service-meta"><span className="service-icon"><ServiceIcon type={service.icon} /></span><span className="service-number">{service.number}</span></div><div><h3>{service.title}</h3><p>{service.text}</p></div><a href="#contacto">{t.servicesHeading.link} <span aria-hidden="true">↗</span></a></article>)}</div>
      </section>

      <section className="audience-section"><div className="section-heading audience-heading"><span className="eyebrow light">{t.audienceHeading.eyebrow}</span><h2>{t.audienceHeading.title}</h2></div><div className="audience-grid">{t.audiences.map((audience, index) => <article className={`audience-card ${index === 0 ? 'featured' : ''}`} key={audience.title}><span>{audience.tag}</span><h3>{audience.title}</h3><p>{audience.text}</p></article>)}</div></section>

      <section className="section work-section" id="trabajos">
        <div className="section-heading work-heading"><div><span className="eyebrow">{t.work.eyebrow}</span><h2>{t.work.title}</h2></div><p>{t.work.text}</p></div>
        <div className="work-grid">{[
          { kind: 'image', src: '/media/riego-aspersion-1.jpg', cls: 'work-item work-wide', width: 960, height: 1280 },
          { kind: 'image', src: '/media/riego-goteo-1.jpg', cls: 'work-item work-tall', width: 960, height: 1280 },
          { kind: 'image', src: '/media/control-riego-1.jpg', cls: 'work-item', width: 1280, height: 960 },
          { kind: 'image', src: '/media/instalacion-riego-1.jpg', cls: 'work-item', width: 960, height: 1280 },
          { kind: 'image', src: '/media/riego-aspersion-2.jpg', cls: 'work-item work-wide secondary-wide', width: 960, height: 1280 },
          { kind: 'image', src: '/media/trabajo-reciente-1.webp', cls: 'work-item', width: 960, height: 1280 },
          { kind: 'image', src: '/media/trabajo-reciente-2.webp', cls: 'work-item', width: 960, height: 1280 },
          { kind: 'video', src: '/media/trabajo-reciente-video.mp4', cls: 'work-item work-video', width: 1024, height: 576 },
        ].map((item, i) => {
          const [strong, span] = t.work.captions[i].split('|');
          if (item.kind === 'video') return <figure className={item.cls} key={item.src}><video controls muted playsInline preload="none" poster="/media/trabajo-reciente-1.webp" width={item.width} height={item.height}><source src={item.src} type="video/mp4" /></video><figcaption><strong>{strong}</strong><span>{span}</span></figcaption></figure>;
          return <figure className={item.cls} key={item.src}><button className="work-media-button" type="button" onClick={() => openLightbox({ src: item.src, alt: `${strong} — ${span}`, title: strong, meta: span })}><img src={item.src} alt={`${strong} — ${span}`} loading="lazy" width={item.width} height={item.height} /></button><figcaption><strong>{strong}</strong><span>{span}</span></figcaption></figure>;
        })}</div>
      </section>

      <section className="process-section" id="proceso">
        <div className="process-visual"><video controls muted playsInline preload="metadata" poster="/media/instalacion-riego-1.jpg"><source src="/media/proceso-instalacion.mp4" type="video/mp4" /></video><span>{t.process.media}</span></div>
        <div className="process-content"><span className="eyebrow light">{t.process.eyebrow}</span><h2>{t.process.title}</h2><div className="process-list">{t.process.steps.map((step) => <article key={step.number}><span>{step.number}</span><div><h3>{step.title}</h3><p>{step.text}</p></div></article>)}</div>
        </div>
      </section>

      <section className="quote-banner"><div><span className="eyebrow light">{t.banner.eyebrow}</span><h2>{t.banner.title}</h2></div><a className="button button-white" href={whatsappHref} target="_blank" rel="noreferrer">{t.banner.button}</a></section>

      <section className="faq-section" id="preguntas-frecuentes" aria-labelledby="faq-title"><div className="section-heading faq-heading"><span className="eyebrow">{t.faq.eyebrow}</span><h2 id="faq-title">{t.faq.title}</h2></div><div className="faq-list">{t.faq.items.map((item) => <details key={item.q}><summary>{item.q}</summary><p>{item.a}</p></details>)}</div></section>

      <section className="contact-section" id="contacto"><div className="contact-copy"><span className="eyebrow">{t.contact.eyebrow}</span><h2>{t.contact.title}</h2><p>{t.contact.text}</p><div className="contact-channels"><a className="direct-contact" href={whatsappHref} target="_blank" rel="noreferrer"><span>{t.contact.direct}</span><strong>WhatsApp 8631-0650</strong></a><a className="direct-contact" href="mailto:info@riegocentral.com"><span>{t.contact.emailLabel}</span><strong>info@riegocentral.com</strong></a></div></div>
        <form className="contact-form" onSubmit={handleSubmit}><div className="form-grid"><label>{t.contact.name}<input name="name" type="text" autoComplete="name" required maxLength={100} /></label><label>{t.contact.phone}<input name="phone" type="tel" autoComplete="tel" required maxLength={30} /></label><label>{t.contact.email}<input name="email" type="email" autoComplete="email" required maxLength={160} /></label><label>{t.contact.service}<select name="service" required defaultValue=""><option value="" disabled>{t.contact.select}</option>{t.contact.options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label></div>
          <label>{t.contact.location}<input name="location" type="text" required maxLength={160} placeholder={t.contact.locationPlaceholder} /></label><label>{t.contact.message}<textarea name="message" rows={5} required maxLength={2000} /></label>
          <div className="turnstile-wrap" aria-label="Anti-spam verification">{turnstileSiteKey ? <div ref={turnstileContainerRef} /> : <p className="turnstile-config-error">{t.contact.turnstileMissing}</p>}</div>
          <label className="privacy-consent"><input name="privacyConsent" type="checkbox" required /><span>{t.contact.privacyPrefix} <a href={privacyHref} target="_blank" rel="noreferrer">{t.contact.privacyLink}</a> {t.contact.privacySuffix}</span></label>
          <label className="honeypot" aria-hidden="true">Company<input name="company" type="text" tabIndex={-1} autoComplete="off" /></label><button ref={submitButtonRef} className="button button-primary submit-button" type="submit" disabled={status === 'sending'}>{status === 'sending' ? t.contact.sending : t.contact.submit}</button>
          {status === 'error' && <div className="form-feedback error" role="alert" aria-live="assertive"><span className="form-feedback-icon" aria-hidden="true">!</span><div><strong>{t.contact.errorTitle}</strong><p>{errorMessage || t.contact.errorFallback}</p><a href={whatsappHref} target="_blank" rel="noreferrer">{t.contact.whatsappError}</a></div></div>}
        </form></section>

      {status === 'sent' && trackingId && <div className="success-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) closeSuccessModal(); }}><section className="success-modal-card" role="dialog" aria-modal="true" aria-labelledby="success-modal-title" aria-describedby="success-modal-description"><button ref={modalCloseButtonRef} className="success-modal-close" type="button" onClick={closeSuccessModal} aria-label={t.modal.closeAria}>×</button><div className="success-modal-mark" aria-hidden="true">✓</div><span className="success-modal-eyebrow">{t.modal.eyebrow}</span><h2 id="success-modal-title">{t.modal.title}</h2><p id="success-modal-description">{t.modal.description}</p><div className="success-modal-tracking"><span>{t.modal.idLabel}</span><strong>{trackingId}</strong><button type="button" onClick={copyTrackingId}>{copiedTrackingId ? t.modal.copied : t.modal.copy}</button></div><p className="success-modal-note">{t.modal.note}</p><div className="success-modal-actions"><button className="button button-primary" type="button" onClick={closeSuccessModal}>{t.modal.close}</button><a href={whatsappHref} target="_blank" rel="noreferrer">{t.modal.whatsapp}</a></div></section></div>}

      {lightbox && <div className="gallery-lightbox-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) closeLightbox(); }}><section className="gallery-lightbox" role="dialog" aria-modal="true" aria-labelledby="gallery-lightbox-title"><button ref={galleryCloseButtonRef} className="gallery-lightbox-close" type="button" onClick={closeLightbox} aria-label={locale === 'en' ? 'Close image' : 'Cerrar imagen'}>×</button><img src={lightbox.src} alt={lightbox.alt} /><div className="gallery-lightbox-copy"><h2 id="gallery-lightbox-title">{lightbox.title}</h2><p>{lightbox.meta}</p></div></section></div>}

      <footer><div className="footer-brand"><strong>Riego Central</strong><span>{t.footer.tagline}</span></div><div className="footer-links"><a href={privacyHref}>{t.footer.privacy}</a><a href={termsHref}>{t.footer.terms}</a><a href={complaintsHref}>{t.footer.complaints}</a><a href="mailto:info@riegocentral.com">info@riegocentral.com</a></div><div className="footer-meta"><span>Costa Rica</span><a href={whatsappHref} target="_blank" rel="noreferrer">8631-0650</a><span>© {new Date().getFullYear()}</span></div></footer>
      <div className="floating-actions" aria-label={t.footer.quickAria}><a className="floating-top" href="#top" aria-label={t.footer.topAria}>↑</a><a className="floating-whatsapp" href={whatsappHref} target="_blank" rel="noreferrer" aria-label={t.footer.whatsappAria}><span aria-hidden="true">WA</span><strong>WhatsApp</strong></a></div>
    </main>
  );
}

export default App;
