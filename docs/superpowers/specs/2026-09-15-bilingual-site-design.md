# Riego Central — Diseño bilingüe Español / Inglés

## Objetivo

Convertir todo el sitio de Riego Central en una experiencia bilingüe completa, manteniendo español como idioma principal y agregando una versión inglesa equivalente, sin duplicar lógica de negocio ni romper el formulario, Turnstile, Resend, SEO, páginas legales o rutas existentes.

## Alcance aprobado

- Español permanece en `https://riegocentral.com/`.
- Inglés se publica en `https://riegocentral.com/en/`.
- Selector visible `ES | EN` en el encabezado principal.
- Todas las secciones comerciales se traducen al inglés.
- Todas las páginas legales se traducen al inglés.
- El formulario, sus validaciones, estados, modal de éxito, mensajes de error y opciones se muestran en el idioma de la página.
- Los correos de acuse al cliente deben usar el idioma desde el que se envió la solicitud.
- Los correos internos pueden mantenerse en español para operación local, pero deben indicar el idioma/origen de la solicitud.
- Se mantiene un único endpoint `/api/contact` y el mismo sistema de ID de seguimiento.
- No se agregan dependencias de internacionalización; se prioriza React, navegador y archivos estáticos existentes.

## Rutas

### Español

- `/`
- `/privacidad/`
- `/terminos/`
- `/reclamos/`

### Inglés

- `/en/`
- `/en/privacy/`
- `/en/terms/`
- `/en/complaints/`

No se crean variantes regionales adicionales en esta fase.

## Arquitectura de contenido

La aplicación React debe detectar el idioma por pathname y renderizar el contenido desde diccionarios tipados internos, evitando duplicar la lógica del componente principal.

Se utilizará un tipo de idioma equivalente a:

```ts
type Locale = 'es' | 'en';
```

El contenido comercial, FAQ, etiquetas del formulario, navegación, modal y mensajes operativos se centralizarán en un módulo de contenido bilingüe. El flujo de envío seguirá siendo único.

El idioma se enviará al backend mediante un campo explícito `locale` con valores permitidos `es` o `en`. El backend no confiará en valores arbitrarios: cualquier valor distinto de `en` se tratará como `es`.

## Formulario y correo

El formulario conservará los campos actuales y Turnstile. Se agregará `locale` al payload.

El backend seguirá generando un único ID del tipo `RC-YYYYMMDD-XXXXXXXX`.

Para solicitudes enviadas desde `/en/`:

- El acuse al cliente estará completamente en inglés.
- El asunto será equivalente a `We received your request — RC-...`.
- Las advertencias sobre cotización, contrato, precio, garantía y fecha se mantendrán con el mismo alcance jurídico del texto español, sin ampliar obligaciones.
- Para `Complaint / claim`, el acuse usará redacción específica de reclamo.

Para solicitudes enviadas desde español, se mantiene el comportamiento actual.

El correo interno debe seguir llegando al destinatario principal, copia a Alexis y enrutamiento de reclamos. Se añadirá una indicación del idioma de la solicitud para facilitar atención bilingüe.

## Selector de idioma

El encabezado principal mostrará un control compacto `ES | EN`.

Comportamiento:

- En `/`, `ES` aparece activo y `EN` enlaza a `/en/`.
- En `/en/`, `EN` aparece activo y `ES` enlaza a `/`.
- En páginas legales, el selector debe llevar a la página legal equivalente, no siempre al home.
- No se usará traducción automática del navegador ni parámetros `?lang=`.

## SEO internacional

Cada página tendrá:

- `lang="es-CR"` para español y `lang="en"` para inglés.
- title y description propios por idioma.
- canonical propio de la URL actual.
- `hreflang="es-CR"`, `hreflang="en"` y `hreflang="x-default"` apuntando al par correspondiente.
- Open Graph localizado (`es_CR` / `en_US` o `en` compatible según implementación final).
- Twitter metadata localizada.
- Schema.org con `inLanguage` correcto.
- FAQ schema traducido para la versión inglesa.
- `availableLanguage` de Organization/ContactPoint ampliado a español e inglés.

El sitemap incluirá las 8 URLs y relaciones alternas cuando se implemente el formato elegido.

Mientras el proyecto siga en pre-lanzamiento, todas las páginas continuarán con `noindex,nofollow` y `robots.txt` seguirá con `Disallow: /`. La internacionalización no activa indexación por sí sola.

## Páginas legales

Las páginas inglesas serán traducciones fieles de las páginas españolas actuales, preservando:

- alcance y limitaciones;
- Ley N.° 8968 y referencias a normativa costarricense;
- naturaleza informativa del sitio;
- condición de cotización previa;
- ID de seguimiento;
- canal de reclamos;
- tratamiento de datos;
- Cloudflare, Turnstile, Resend y WhatsApp donde correspondan.

No se reinterpretará la ley ni se añadirán garantías, plazos, derechos comerciales o afirmaciones no presentes en la versión española.

Las páginas españolas siguen siendo la referencia de contenido legal del proyecto. Si en el futuro cambia el texto legal en español, la versión inglesa debe actualizarse en el mismo cambio.

## Vite y rutas directas

El servidor de desarrollo y el build deben soportar carga directa de:

- `/en/`
- `/en/privacy/`
- `/en/terms/`
- `/en/complaints/`

Las páginas legales inglesas se servirán como HTML estático siguiendo el patrón existente de las páginas legales españolas.

La ruta `/en/` debe resolver la misma aplicación React y seleccionar idioma inglés por pathname. La configuración de Vite debe contemplar esta ruta en desarrollo sin añadir React Router, salvo que la estructura actual demuestre que es imprescindible; por defecto no se instalará.

## Accesibilidad y UX

- El selector de idioma debe ser navegable por teclado y tener estado activo comprensible.
- No se cambiará automáticamente el idioma sin acción del usuario.
- El modal de éxito debe mantener su comportamiento actual: foco inicial, cierre por botón, `Esc`, clic fuera y retorno del foco.
- Mensajes de error y validaciones deben estar en el idioma activo.
- En móvil el selector no debe competir con el CTA principal de WhatsApp.

## Pruebas obligatorias

Se añadirán pruebas que fallen antes de implementar y cubran como mínimo:

1. detección de `/en/` y contenido inglés;
2. selector `ES | EN` y rutas equivalentes;
3. opciones del formulario en ambos idiomas;
4. `locale` incluido en el payload;
5. correo de acuse inglés para `locale=en`;
6. correo español sin regresiones;
7. páginas legales inglesas presentes;
8. canonical y hreflang correctos;
9. sitemap con las ocho URLs;
10. pre-lanzamiento continúa bloqueado por `noindex` y `robots.txt`;
11. build TypeScript/Vite correcto;
12. verificación de rutas directas y recursos en producción.

## Archivos previstos

A modificar:

- `src/App.tsx`
- `src/styles.css`
- `functions/api/contact.ts`
- `vite.config.ts`
- `index.html`
- `public/sitemap.xml`
- `public/_headers` solo si las nuevas rutas HTML lo requieren
- `tests/compliance-seo.test.mjs`

A crear, sujeto al plan de implementación:

- `src/content.ts` para contenido bilingüe tipado
- `public/en/index.html` o mecanismo estático equivalente para metadata inglesa de entrada
- `public/en/privacy/index.html`
- `public/en/terms/index.html`
- `public/en/complaints/index.html`

La implementación debe evitar duplicar la aplicación React completa.

## Fuera de alcance

- Traducción automática mediante terceros.
- CMS.
- Base de datos para idiomas.
- Detección automática por IP o geolocalización.
- Más idiomas aparte de español e inglés.
- React Router si no es necesario.
- Activación de indexación o Search Console.

## Criterios de aceptación

El trabajo se considera implementado solo cuando:

- `/` muestra español y `/en/` muestra inglés;
- todas las páginas legales tienen par bilingüe;
- el selector navega al equivalente correcto;
- formulario, modal, errores y acuse al cliente respetan el idioma activo;
- el backend sigue validando Turnstile y generando el mismo ID de seguimiento;
- consultas y reclamos conservan el enrutamiento actual;
- SEO bilingüe está preparado sin activar indexación todavía;
- todas las pruebas pasan;
- TypeScript y build pasan;
- rutas directas funcionan en producción;
- no hay errores relacionados en consola;
- no se ha introducido ninguna dependencia nueva innecesaria.
