# Contexto comercial del proyecto

Actualizado: 2026-09-08

## Marca
- Nombre definitivo confirmado: Riego Central.
- Identidad visual aprobada: logo verde/grafito con símbolo de riego, implementado en `public/media/riego-central-logo.webp`.
- Descriptor: Riego, agua y servicios técnicos.
- Responsable público: no aplica.

## Contacto
- WhatsApp principal: 86310650
- Dominio previsto: `riegocentral.com` (compra/activación no verificada todavía).
- Correo general definido para la web: `info@riegocentral.com`.
- Canal de reclamos definido para la web: `reclamos@riegocentral.com`.
- La recepción real de ambos correos queda pendiente de configuración y verificación del dominio.

## Cobertura
- Costa Rica.

## Prioridad de clientes
1. Comercial
2. Residencial
3. Canchas / proyectos

## Servicios confirmados
Ofrecer desde el inicio todos los servicios mencionados en los audios revisados del proyecto:
- Instalación de sistemas de riego residencial por aspersión para jardines y césped.
- Sistemas de riego por goteo para plantas, árboles, bonsáis e invernaderos.
- Sistemas de riego para canchas de fútbol.
- Instalación de tanques y sistemas de bombeo para agua potable.
- Fontanería y reparaciones generales.
- Revisión de sistemas de riego existentes.
- Mantenimiento, reparación y mejora de sistemas de riego.
- Instalación de sensores de lluvia para controles de riego.

## Material disponible
- Fotos, videos y audios almacenados en `media/`.
- El material visual respalda especialmente riego por aspersión, goteo, controladores/sensores y trabajos de tubería de riego.
- No hay respaldo visual fuerte todavía para fontanería general, tanques y bombeo; usar texto/iconografía hasta contar con material real.

## Cumplimiento y SEO implementado en preproducción
- Política de Privacidad en `/privacidad/`.
- Términos de Uso en `/terminos/`.
- Canal de Reclamos en `/reclamos/`.
- Consentimiento de privacidad obligatorio en formulario y validado también en servidor.
- Cloudflare Turnstile integrado en cliente y servidor; Siteverify valida token, hostname y action. Casos válido/inválido verificados con las claves oficiales de prueba de Cloudflare. Las credenciales reales de producción siguen pendientes.
- FAQ visible + `FAQPage`, `Organization`, `WebSite` y `Service` en JSON-LD.
- Canonical, Open Graph, Twitter Card, GEO (`CR`), sitemap y favicon preparados para `riegocentral.com`.
- Prelanzamiento permanece `noindex,nofollow` y `robots.txt` bloquea rastreo hasta publicación real.

## Pendientes mínimos antes de producción
- Comprar/activar `riegocentral.com` y configurar/verificar `info@riegocentral.com` y `reclamos@riegocentral.com`.
- Crear/configurar el widget real de Cloudflare Turnstile para `riegocentral.com` y `www.riegocentral.com`, y cargar sus variables en Cloudflare Pages.
- Verificar el dominio en Resend y probar recepción real del formulario.
- Confirmar si la visita/diagnóstico/cotización es gratuita o tiene costo.
- Confirmar si existe garantía y cómo comunicarla.
- Confirmar horario o modalidad de atención.
- Precios: no se publican. Todos los servicios se manejan por cotización.
