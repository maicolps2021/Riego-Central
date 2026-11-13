# AGENTS.md — Riego Central

> Instrucciones de trabajo para agentes, Codex y colaboradores de **Riego Central**. Ámbito: todo este repositorio. Revisión inicial: 13 de noviembre de 2026. Este archivo adapta las normas operativas de NXCREA; no concede acceso ni autoriza despliegues.

## Identidad, alcance y fuentes de verdad

- **Proyecto y marca:** Riego Central — «Riego, agua y servicios técnicos». Cobertura: Costa Rica. Sitio: https://riegocentral.com.
- **Repositorio oficial:** `maicolps2021/Riego-Central`; rama base: `main`. **Workspace local oficial:** `/mnt/nvme/nxcrea-devlab/projects/servicios-tecnicos-cr-web`.
- Trabajar **solo** con Riego Central. No incorporar información, código, credenciales, branding, contactos, infraestructura ni decisiones de otros proyectos o clientes.
- Prioridad de evidencia: autorización actual del propietario; código/configuración y estado real de GitHub, servidor y producción; instrucciones específicas de este repositorio; TaskView; y, por último, documentación histórica/memorias. Ante contradicciones, verificar antes de actuar.
- Referencias del repositorio: `README.md`, `PROJECT_CONTEXT.md`, `docs/superpowers/specs/2026-09-15-bilingual-site-design.md`, `docs/superpowers/plans/2026-09-15-bilingual-site.md` y `tests/compliance-seo.test.mjs`. La fuente contextual complementaria es **«Riego Central — Contexto Maestro del Proyecto» (18/09/2026)**, fuera de este repositorio. El README, el contexto versionado y los planes pueden describir estados históricos; no convertir pendientes del plan en hechos.
- Distinguir siempre **confirmado, implementado, verificado, pendiente y supuesto**. No equiparar compilación, pruebas o despliegue con un flujo E2E verificado.

## Arquitectura y contratos existentes

- Frontend: React 19, Vite 6, TypeScript y CSS nativo. Una aplicación comercial bilingüe **español/inglés**; español en `/`, inglés en `/en/`. Contenido compartido en `src/content.ts`, UI en `src/App.tsx`, estilos en `src/styles.css`. **No utiliza React Router**; no añadirlo, ni instalar frameworks/SDK nuevos, sin necesidad demostrada y autorización.
- Backend: **Cloudflare Pages Functions**. Endpoint `POST /api/contact` implementado en `functions/api/contact.ts`. Infraestructura de hosting: proyecto Cloudflare Pages `riego-central`; correo vía **Resend REST desde backend**; protección mediante **Cloudflare Turnstile**.
- Preservar en el formulario: validación frontend/backend, consentimiento obligatorio de privacidad, honeypot `company`, validación servidor de Turnstile (token, hostname y action), normalización de `locale` (`es`/`en`), ID de seguimiento `RC-...`, notificación interna y acuse al cliente, tratamiento de reclamos y manejo de errores. No alterar contratos, destinatarios o flujos de envío sin autorización y pruebas de regresión.
- **No asumir que el formulario está verificado E2E.** El contexto maestro documenta pruebas técnicas, pero deja pendiente demostrar desde navegador un token real válido, envío exitoso, ID y **recepción efectiva de ambos correos**. Las integraciones externas requieren evidencia vigente.
- `package.json` define `dev`, `preview`, `test` y `build`. `npm run build` ejecuta `tsc --noEmit && vite build`; **no existe script `lint`** en la base revisada. No afirmar que lint pasó ni inventar cantidades/resultados de pruebas.
- No usar por defecto Firebase, D1, R2 u otra infraestructura genérica de NXCREA: **no forman parte del stack comprobado de este repositorio**.

## Reglas comerciales y contenido público

- Prioridad: **clientes comerciales**, luego residenciales, después canchas y proyectos especiales. Todos los precios se manejan **por cotización**.
- Servicios confirmados: riego residencial; aspersión; goteo para plantas, árboles, bonsái e invernaderos; riego de canchas de fútbol; tanques y bombeo de agua potable; fontanería y reparaciones relacionadas; revisión, mantenimiento, reparación y mejora de riego; sensores de lluvia; proyectos relacionados con agua.
- No inventar precios, garantías, certificaciones, marcas utilizadas, plazos de ejecución, experiencia, condiciones de visita ni capacidades no acreditadas.
- Contactos públicos del proyecto: WhatsApp **+506 8631 0650**; `info@riegocentral.com` y `reclamos@riegocentral.com`. No sustituirlos por contactos de NXCREA ni asumir que la entrega de correo está verificada sin prueba.
- Mantener consistencia jurídica y comercial entre ambos idiomas y páginas legales: `/privacidad/`, `/terminos/`, `/reclamos/` y sus equivalentes `/en/privacy/`, `/en/terms/`, `/en/complaints/`.
- SEO/GEO/AEO: canonical, hreflang (`es-CR`, `en`, `x-default`), titles/descriptions, Open Graph, Twitter Cards, robots, sitemap, schema.org, FAQ real, semántica H1–H3 y ALT descriptivos. Verificar **el estado actual** de indexación; los documentos de preproducción contienen instrucciones de `noindex` ya históricas. No generar relleno SEO.
- Accesibilidad y rendimiento: responsive, navegación de teclado, foco visible, contraste, etiquetas, `prefers-reduced-motion`, LCP, CLS, INP y peso de imágenes/videos. Priorizar CTA de cotización/WhatsApp, especialmente en móvil.
- Para blog/artículos: investigar fuentes, utilizar fotografías reales autorizadas, cuidar imagen/título/cuerpo, tiempo y progreso de lectura y SEO estructurado. **En `main` revisada el 13/11/2026 no hay implementación de blog**; existe trabajo local separado en `feature/blog` con cambios sin confirmar. No tocarlo ni afirmar por esta observación qué está publicado actualmente.

## Protocolo de cambios

1. Confirmar repositorio y permisos, `git status`, rama actual, `HEAD`, `origin/main`, ahead/behind y diferencias locales; revisar instrucciones `AGENTS.md` adicionales si aparecen. **No sobrescribir ni limpiar cambios ajenos**. Para trabajo aislado, usar rama o worktree independiente desde una base verificada.
2. Buscar proyecto/tarea existente en **TaskView** (Riego-Central); evitar duplicados. Al comenzar trabajo efectivo, poner la tarea **En proceso** e iniciar temporizador; al pausar/terminar, detenerlo. Registrar solo tiempo realmente trabajado, decisiones, pruebas, evidencias, commits, PR, riesgos y pendientes. No emitir cobros ni facturas sin autorización.
3. Consultar skills de ingeniería disponibles, incluidas `nxcrea-operating-system` y `nxcrea-lean-engineering` **solo si están instaladas**. Delimitar archivos autorizados, criterios de aceptación, efecto en entornos y plan de reversión. Preferir diagnóstico de solo lectura y cambios pequeños/reversibles.
4. Trabajar en rama descriptiva y **pull request** contra `main`; nunca escribir directamente en `main` ni hacer merge por defecto. No modificar dependencias, infraestructura, bases de datos, DNS, reglas de seguridad, variables, endpoints o procesos de correo fuera del alcance aprobado.
5. Para cambios de código relevantes, ejecutar `npm run test` y `npm run build` y reportar resultados reales. Para cambios solo documentales, verificar rutas/enlaces, contenido, secretos y `git diff --check`; no presentar tests funcionales como ejecutados si no se corrieron.
6. Añadir QA conforme al riesgo: visual/responsive para UI; accesibilidad/SEO para web pública; controles server-side y pruebas E2E autorizadas para formulario/Turnstile/Resend; smoke test en producción **solo tras autorización de despliegue**. Usar datos sintéticos cuando corresponda. Documentar fallos y dependencias.
7. PR: describir alcance, diff, pruebas ejecutadas/no ejecutadas, riesgos, rollback y pendientes. Detener timer y actualizar TaskView. Distinguir **cambio local, commit, PR, merge y producción**.

## Cloudflare, Git y seguridad operativa

- El **contexto maestro del 18/09/2026** registró Cloudflare Pages sin conexión automática a GitHub (`Git Provider: No`), con despliegue manual/Direct Upload. **Revalidar ese estado antes de operar**. No inferir que `git push` publica producción.
- **Requiere autorización explícita separada:** merge, despliegue, cambios de Cloudflare/DNS, permisos, modificaciones críticas del formulario/correos, pruebas que envíen mensajes reales a terceros, borrados, migraciones, pagos y operaciones destructivas.
- Nunca incluir tokens, API keys, valores de secrets, archivos `.env`, credenciales ni instrucciones para recuperarlas en Git, PR, TaskView, logs o respuestas. Las keys de Resend y Turnstile permanecen en backend/secret manager; no exponerlas en cliente.
- Los respaldos `*.nxlab-backup-*` y material fuente `media/` no deben publicarse. **Vite puede copiar accidentalmente archivos ubicados en `public/` a `dist/`**: comprobar que no hay respaldos/archivos sensibles en carpetas publicables al preparar releases.
- No atribuir permisos de escritura al broker OpenBao/GitHub App por verificaciones ajenas a este repositorio; usar únicamente conectores y permisos comprobados.
- Antes de revertir, identificar los commits del PR y revisar dependencias/cambios posteriores. En cambios de datos, exigir plan de respaldo y recuperación previo.
