export type Locale = 'es' | 'en';

export const getLocaleFromPathname = (pathname: string): Locale =>
  pathname.startsWith('/en/') || pathname === '/en' ? 'en' : 'es';

type ServiceOption = { value: string; label: string };
type Content = {
  nav: { services: string; work: string; process: string; whatsapp: string };
  languageLabel: string;
  hero: { eyebrow: string; title: string; text: string; quote: string; whatsapp: string };
  facts: Array<{ number: string; title: string; text: string }>;
  intro: { coverage: string; quote: string; whatsapp: string };
  servicesHeading: { eyebrow: string; title: string; text: string; link: string };
  services: Array<{ number: string; icon: string; title: string; text: string }>;
  audienceHeading: { eyebrow: string; title: string };
  audiences: Array<{ tag: string; title: string; text: string }>;
  work: { eyebrow: string; title: string; text: string; captions: string[] };
  process: { media: string; eyebrow: string; title: string; steps: Array<{ number: string; title: string; text: string }> };
  banner: { eyebrow: string; title: string; button: string };
  faq: { eyebrow: string; title: string; items: Array<{ q: string; a: string }> };
  contact: {
    eyebrow: string; title: string; text: string; direct: string; emailLabel: string;
    name: string; phone: string; email: string; service: string; select: string;
    location: string; locationPlaceholder: string; message: string; privacyPrefix: string;
    privacyLink: string; privacySuffix: string; submit: string; sending: string;
    turnstileMissing: string; errorTitle: string; errorFallback: string; whatsappError: string;
    options: ServiceOption[];
  };
  modal: { eyebrow: string; title: string; description: string; idLabel: string; copy: string; copied: string; note: string; close: string; closeAria: string; whatsapp: string };
  footer: { tagline: string; privacy: string; terms: string; complaints: string; whatsappAria: string; topAria: string; quickAria: string };
};

export const contentByLocale: Record<Locale, Content> = {
  es: {
    nav: { services: 'Servicios', work: 'Trabajos', process: 'Proceso', whatsapp: 'WhatsApp' },
    languageLabel: 'Idioma',
    hero: {
      eyebrow: 'Riego · agua · servicios técnicos',
      title: 'Soluciones de riego, agua y servicios para su propiedad o proyecto.',
      text: 'Instalamos, damos mantenimiento y mejoramos sistemas de riego, bombeo y fontanería para empresas, hogares y proyectos especiales en Costa Rica.',
      quote: 'Solicitar cotización',
      whatsapp: 'Consultar por WhatsApp',
    },
    facts: [
      { number: '01', title: 'Comercial', text: 'Comercios y empresas' },
      { number: '02', title: 'Residencial', text: 'Hogares y propiedades' },
      { number: '03', title: 'Proyectos', text: 'Canchas y especiales' },
    ],
    intro: { coverage: 'Atención en', quote: 'Servicios por cotización', whatsapp: 'WhatsApp' },
    servicesHeading: {
      eyebrow: 'Servicios',
      title: 'Cada espacio necesita una solución diferente.',
      text: 'Revisamos lo que necesita y le proponemos una solución adecuada para su propiedad o proyecto. Todos los trabajos se realizan por cotización.',
      link: 'Consultar servicio',
    },
    services: [
      { number: '01', icon: 'sprinkler', title: 'Riego por aspersión', text: 'Instalación y mantenimiento de riego para jardines, césped y áreas verdes.' },
      { number: '02', icon: 'drop', title: 'Riego por goteo', text: 'Riego para plantas, árboles, jardines, bonsáis e invernaderos.' },
      { number: '03', icon: 'sensor', title: 'Controles y sensores de riego', text: 'Programación de controles e instalación de sensores de lluvia para facilitar el manejo del riego.' },
      { number: '04', icon: 'tools', title: 'Mantenimiento y mejoras', text: 'Revisamos sistemas existentes, corregimos problemas y realizamos mejoras cuando sea necesario.' },
      { number: '05', icon: 'pump', title: 'Tanques y bombeo', text: 'Instalación de tanques y sistemas de bombeo para agua potable.' },
      { number: '06', icon: 'pipe', title: 'Fontanería', text: 'Reparaciones y trabajos generales de fontanería para hogares, empresas y proyectos.' },
    ],
    audienceHeading: { eyebrow: 'A quién atendemos', title: 'Soluciones para empresas, hogares y proyectos especiales.' },
    audiences: [
      { tag: 'Comercial', title: 'Comercios y empresas', text: 'Atendemos sistemas de riego, agua y mantenimiento en comercios, empresas y otras propiedades.' },
      { tag: 'Residencial', title: 'Hogares y propiedades', text: 'Soluciones para jardines, sistemas de agua y necesidades de fontanería en el hogar.' },
      { tag: 'Proyectos especiales', title: 'Canchas e instalaciones', text: 'Riego para canchas de fútbol, invernaderos y proyectos que requieren una solución particular.' },
    ],
    work: {
      eyebrow: 'Trabajos reales', title: 'Conozca algunos de nuestros trabajos.', text: 'Instalaciones reales de riego, controles, tuberías y sistemas en funcionamiento.',
      captions: ['Riego por aspersión|Áreas verdes', 'Riego por goteo|Instalación', 'Control de riego|Controles y sensores', 'Instalación|Tubería y componentes', 'Sistema funcionando|Aspersión', 'Trabajo reciente|Material real del proyecto', 'Trabajo reciente|Ejecución en sitio', 'Video de proyecto|Trabajo real'],
    },
    process: {
      media: 'Material real de instalación', eyebrow: 'Cómo trabajamos', title: 'Un proceso sencillo, desde la consulta hasta el trabajo.',
      steps: [
        { number: '01', title: 'Consulta', text: 'Cuéntenos qué necesita y dónde se encuentra.' },
        { number: '02', title: 'Revisión', text: 'Revisamos el caso y coordinamos la atención necesaria.' },
        { number: '03', title: 'Cotización', text: 'Le presentamos una cotización según el trabajo requerido.' },
        { number: '04', title: 'Servicio', text: 'Una vez aprobado, coordinamos la realización del trabajo.' },
      ],
    },
    banner: { eyebrow: '¿Tiene un proyecto?', title: 'Cuéntenos qué necesita y solicite una cotización.', button: 'WhatsApp 8631-0650' },
    faq: {
      eyebrow: 'Preguntas frecuentes', title: 'Lo esencial antes de solicitar una cotización.',
      items: [
        { q: '¿En qué zonas de Costa Rica atienden?', a: 'Riego Central recibe solicitudes de todo Costa Rica. Cada caso se revisa según la ubicación, el servicio requerido y las condiciones del proyecto.' },
        { q: '¿Cómo solicito una cotización?', a: 'Puede enviar los datos básicos mediante este formulario o escribir por WhatsApp al 8631-0650. Con esa información se revisa la solicitud y se coordina el siguiente paso.' },
        { q: '¿Atienden empresas y hogares?', a: 'Sí. Atendemos comercios y empresas, propiedades residenciales y proyectos especiales como canchas e invernaderos.' },
        { q: '¿Pueden revisar un sistema de riego que ya existe?', a: 'Sí. Entre los servicios confirmados se encuentran la revisión, el mantenimiento, la reparación y la mejora de sistemas de riego existentes.' },
        { q: '¿Qué información necesitan para revisar mi solicitud?', a: 'Nombre, medio de contacto, servicio de interés, zona y una descripción breve de lo que necesita. No es necesario enviar información sensible que no tenga relación con el trabajo.' },
      ],
    },
    contact: {
      eyebrow: 'Solicitar cotización', title: 'Cuéntenos qué necesita.', text: 'Comparta algunos datos sobre el trabajo y podremos revisar su solicitud para preparar una cotización.',
      direct: 'Contacto directo', emailLabel: 'Correo general', name: 'Nombre', phone: 'Teléfono / WhatsApp', email: 'Correo', service: 'Servicio o motivo', select: 'Seleccione',
      location: 'Zona donde requiere el servicio', locationPlaceholder: 'Ej. Heredia, San José, Alajuela...', message: 'Describa brevemente lo que necesita',
      privacyPrefix: 'He leído y acepto la', privacyLink: 'Política de Privacidad', privacySuffix: 'y autorizo el tratamiento de los datos suministrados para atender esta solicitud.',
      submit: 'Enviar solicitud', sending: 'Enviando...', turnstileMissing: 'La verificación anti-spam aún no está configurada.', errorTitle: 'No pudimos enviar la solicitud',
      errorFallback: 'Intente nuevamente o utilice WhatsApp.', whatsappError: 'Contactar por WhatsApp',
      options: [
        { value: 'Riego por aspersión', label: 'Riego por aspersión' }, { value: 'Riego por goteo', label: 'Riego por goteo' },
        { value: 'Controles y sensores de riego', label: 'Controles y sensores de riego' }, { value: 'Mantenimiento de riego', label: 'Mantenimiento de riego' },
        { value: 'Tanques y bombeo', label: 'Tanques y bombeo' }, { value: 'Fontanería', label: 'Fontanería' },
        { value: 'Canchas / proyecto especial', label: 'Canchas / proyecto especial' }, { value: 'Consulta general', label: 'Consulta general' },
        { value: 'Queja / reclamo', label: 'Queja / reclamo' }, { value: 'Otro', label: 'Otro' },
      ],
    },
    modal: { eyebrow: 'Riego Central', title: 'Solicitud recibida', description: 'Recibimos correctamente su solicitud. Le enviamos un acuse al correo indicado.', idLabel: 'ID de seguimiento', copy: 'Copiar ID', copied: 'ID copiado', note: 'Guarde este ID para cualquier seguimiento posterior.', close: 'Cerrar', closeAria: 'Cerrar confirmación', whatsapp: 'Consultar por WhatsApp' },
    footer: { tagline: 'Riego, agua y servicios técnicos.', privacy: 'Privacidad', terms: 'Términos', complaints: 'Reclamos', whatsappAria: 'Contactar por WhatsApp', topAria: 'Volver al inicio', quickAria: 'Acciones rápidas' },
  },
  en: {
    nav: { services: 'Services', work: 'Our work', process: 'Process', whatsapp: 'WhatsApp' },
    languageLabel: 'Language',
    hero: {
      eyebrow: 'Irrigation · water · technical services',
      title: 'Irrigation, water and technical solutions for your property or project.',
      text: 'We install, maintain and improve irrigation, pumping and plumbing systems for businesses, homes and special projects throughout Costa Rica.',
      quote: 'Request a quote',
      whatsapp: 'Contact us on WhatsApp',
    },
    facts: [
      { number: '01', title: 'Commercial', text: 'Businesses and commercial properties' },
      { number: '02', title: 'Residential', text: 'Homes and properties' },
      { number: '03', title: 'Projects', text: 'Fields and special projects' },
    ],
    intro: { coverage: 'Service across', quote: 'Services by quote', whatsapp: 'WhatsApp' },
    servicesHeading: {
      eyebrow: 'Services', title: 'Every space requires a different solution.',
      text: 'We review what you need and propose a suitable solution for your property or project. All work is quoted individually.', link: 'Ask about this service',
    },
    services: [
      { number: '01', icon: 'sprinkler', title: 'Sprinkler irrigation', text: 'Installation and maintenance of irrigation for gardens, lawns and green areas.' },
      { number: '02', icon: 'drop', title: 'Drip irrigation', text: 'Irrigation for plants, trees, gardens, bonsai and greenhouses.' },
      { number: '03', icon: 'sensor', title: 'Irrigation controls and sensors', text: 'Controller programming and rain sensor installation to make irrigation management easier.' },
      { number: '04', icon: 'tools', title: 'Maintenance and improvements', text: 'We inspect existing systems, correct problems and make improvements when needed.' },
      { number: '05', icon: 'pump', title: 'Water tanks and pumping', text: 'Installation of tanks and pumping systems for potable water.' },
      { number: '06', icon: 'pipe', title: 'Plumbing', text: 'General plumbing repairs and work for homes, businesses and projects.' },
    ],
    audienceHeading: { eyebrow: 'Who we serve', title: 'Solutions for businesses, homes and special projects.' },
    audiences: [
      { tag: 'Commercial', title: 'Businesses and commercial properties', text: 'We serve irrigation, water and maintenance needs for businesses, commercial properties and other facilities.' },
      { tag: 'Residential', title: 'Homes and properties', text: 'Solutions for gardens, water systems and plumbing needs at home.' },
      { tag: 'Special projects', title: 'Fields and installations', text: 'Irrigation for soccer fields, greenhouses and projects that require a specific solution.' },
    ],
    work: {
      eyebrow: 'Real projects', title: 'See some of our work.', text: 'Real irrigation installations, controls, piping and operating systems.',
      captions: ['Sprinkler irrigation|Green areas', 'Drip irrigation|Installation', 'Irrigation control|Controls and sensors', 'Installation|Piping and components', 'System in operation|Sprinklers', 'Recent work|Real project material', 'Recent work|On-site execution', 'Project video|Real work'],
    },
    process: {
      media: 'Real installation footage', eyebrow: 'How we work', title: 'A simple process, from your inquiry to the work.',
      steps: [
        { number: '01', title: 'Inquiry', text: 'Tell us what you need and where the project is located.' },
        { number: '02', title: 'Review', text: 'We review the case and coordinate the required attention.' },
        { number: '03', title: 'Quote', text: 'We provide a quote based on the work required.' },
        { number: '04', title: 'Service', text: 'Once approved, we coordinate the work.' },
      ],
    },
    banner: { eyebrow: 'Have a project?', title: 'Tell us what you need and request a quote.', button: 'WhatsApp 8631-0650' },
    faq: {
      eyebrow: 'Frequently asked questions', title: 'What to know before requesting a quote.',
      items: [
        { q: 'What areas of Costa Rica do you serve?', a: 'Riego Central receives requests from all across Costa Rica. Each case is reviewed based on location, the service required and project conditions.' },
        { q: 'How do I request a quote?', a: 'You can send the basic information through this form or contact us on WhatsApp at 8631-0650. We review the request and coordinate the next step.' },
        { q: 'Do you serve businesses and homes?', a: 'Yes. We serve businesses and commercial properties, residential properties and special projects such as fields and greenhouses.' },
        { q: 'Can you inspect an existing irrigation system?', a: 'Yes. Confirmed services include inspection, maintenance, repair and improvement of existing irrigation systems.' },
        { q: 'What information do you need to review my request?', a: 'Your name, contact information, service of interest, location and a brief description of what you need. Please do not send sensitive information unrelated to the work.' },
      ],
    },
    contact: {
      eyebrow: 'Request a quote', title: 'Tell us what you need.', text: 'Share a few details about the work so we can review your request and prepare a quote.',
      direct: 'Direct contact', emailLabel: 'General email', name: 'Name', phone: 'Phone / WhatsApp', email: 'Email', service: 'Service or reason', select: 'Select',
      location: 'Location where service is needed', locationPlaceholder: 'E.g. Heredia, San José, Alajuela...', message: 'Briefly describe what you need',
      privacyPrefix: 'I have read and accept the', privacyLink: 'Privacy Policy', privacySuffix: 'and authorize the processing of the information provided to handle this request.',
      submit: 'Send request', sending: 'Sending...', turnstileMissing: 'Anti-spam verification is not configured yet.', errorTitle: 'We could not send your request',
      errorFallback: 'Please try again or contact us on WhatsApp.', whatsappError: 'Contact us on WhatsApp',
      options: [
        { value: 'Riego por aspersión', label: 'Sprinkler irrigation' }, { value: 'Riego por goteo', label: 'Drip irrigation' },
        { value: 'Controles y sensores de riego', label: 'Irrigation controls and sensors' }, { value: 'Mantenimiento de riego', label: 'Irrigation maintenance' },
        { value: 'Tanques y bombeo', label: 'Water tanks and pumping' }, { value: 'Fontanería', label: 'Plumbing' },
        { value: 'Canchas / proyecto especial', label: 'Fields / special project' }, { value: 'Consulta general', label: 'General inquiry' },
        { value: 'Queja / reclamo', label: 'Complaint / claim' }, { value: 'Otro', label: 'Other' },
      ],
    },
    modal: { eyebrow: 'Riego Central', title: 'Request received', description: 'We received your request successfully. We sent a receipt to the email address you provided.', idLabel: 'Tracking ID', copy: 'Copy ID', copied: 'ID copied', note: 'Keep this ID for any future follow-up.', close: 'Close', closeAria: 'Close confirmation', whatsapp: 'Contact us on WhatsApp' },
    footer: { tagline: 'Irrigation, water and technical services.', privacy: 'Privacy', terms: 'Terms', complaints: 'Complaints', whatsappAria: 'Contact us on WhatsApp', topAria: 'Back to top', quickAria: 'Quick actions' },
  },
};
