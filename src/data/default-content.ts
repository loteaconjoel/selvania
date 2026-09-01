import type { SiteContent } from './types';

// Contenido de partida. Es lo que ve la landing mientras nadie haya guardado
// nada desde el panel; en cuanto se guarda por primera vez, manda el archivo
// data/content.json y este queda solo como valor de fábrica al que se puede
// volver desde el panel.
//
// Los textos, las fotos y el video son de muestra: hay que reemplazarlos por los
// del proyecto. Ver public/images/demo/CREDITOS.md sobre las licencias.

export const defaultContent: SiteContent = {
  seo: {
    title: 'Selvania Park | Lotes en la selva central, a 15 min de Pichanaki',
    description:
      'El lugar de tu nuevo comienzo en el corazón de la selva central, a 15 minutos del parque de Pichanaki. Lotes con documentación en regla y servicios básicos.',
    ogImage: '/images/og.svg',
  },

  announcement: {
    enabled: true,
    html: 'MÁS DEL <strong>85% DE LOS LOTES</strong> DE LA PRIMERA ETAPA YA ESTÁN <strong>RESERVADOS</strong>',
  },

  hero: {
    brand: 'Selvania Park',
    tagline:
      'El lugar de tu nuevo comienzo en el corazón de la selva central, a 15 min del parque de Pichanaki',
    // PROVISIONAL: video de muestra. Al publicar conviene moverlo a YouTube
    // (kind: 'youtube') para no gastar el ancho de banda del hosting.
    video: { kind: 'file', src: '/video/selva.mp4' },
    poster: '/images/demo/valle-pichanaki.jpg',
    ctas: [
      {
        label: '¡Agenda tu visita!',
        message:
          'Hola, vi la página de Selvania Park y quiero agendar una visita al proyecto.',
        style: 'whatsapp',
      },
      {
        label: '¡Separa tu lote!',
        message: 'Hola, quiero información para separar un lote en Selvania Park.',
        style: 'lime',
      },
      {
        label: 'Hablar con un asesor',
        message: 'Hola, quiero hablar con un asesor de Selvania Park.',
        style: 'outline',
      },
      {
        label: '¡Únete a Selvania Park!',
        message: 'Hola, quiero ser parte de Selvania Park. ¿Me dan más información?',
        style: 'gold',
      },
    ],
  },

  whatsapp: {
    number: '51999999999', // PROVISIONAL: reemplazar por el número real
  },

  theme: {
    colors: {
      jungleDeep: '#0F1F16',
      jungle: '#3FA34D',
      lime: '#6EE12D',
      gold: '#C4E8C2',
      cream: '#FAFAFA',
    },
    fonts: {
      heading: 'Outfit',
      body: 'Inter',
    },
  },

  blocks: [
    {
      id: 'argumentos',
      type: 'marquee',
      enabled: true,
      label: 'Franja de argumentos de venta',
      items: [
        { icon: 'escudo', text: 'Documentación 100% en regla' },
        { icon: 'ubicacion', text: 'A 15 min de Pichanaki' },
        { icon: 'plusvalia', text: 'Plusvalía que crece cada año' },
        { icon: 'llave', text: 'Financiamiento directo, sin bancos' },
        { icon: 'plano', text: 'Lotes desde 300 m²' },
        { icon: 'reloj', text: 'Visitas guiadas todos los días' },
        { icon: 'familias', text: 'Más de 100 familias ya son parte' },
        { icon: 'casa', text: 'Listo para construir desde el día uno' },
      ],
    },
    {
      id: 'proyecto-3d',
      type: 'video',
      enabled: true,
      eyebrow: 'Recorrido virtual',
      title: 'Conoce Selvania Park en 3D',
      description:
        'Recorre el proyecto completo antes de venir: la distribución de los lotes, las vías internas y las áreas comunes, tal como quedarán.',
      source: { kind: 'file', src: '/video/selva.mp4' }, // PROVISIONAL
      poster: '/images/demo/selva-central.jpg',
      cta: {
        label: 'Hablar con un asesor',
        message: 'Hola, vi el recorrido 3D de Selvania Park y quiero más información.',
        style: 'lime',
      },
    },
    {
      id: 'el-proyecto',
      type: 'carousel',
      enabled: true,
      eyebrow: 'El proyecto',
      title: 'Así es Selvania Park',
      description:
        'Lotes amplios rodeados de naturaleza viva, a pocos minutos del centro de Pichanaki.',
      images: [
        { src: '/images/demo/valle-pichanaki.jpg', alt: 'Vista aérea del proyecto', caption: 'Vista aérea del terreno' },
        { src: '/images/demo/selva-central.jpg', alt: 'Lotes demarcados', caption: 'Lotes ya demarcados' },
        { src: '/images/demo/puente-perene.jpg', alt: 'Vías internas', caption: 'Vías internas afirmadas' },
        { src: '/images/demo/valle-pichanaki.jpg', alt: 'Áreas verdes', caption: 'Áreas verdes comunes' },
      ],
      cta: {
        label: '¡Agenda tu visita!',
        message: 'Hola, quiero agendar una visita para conocer Selvania Park en persona.',
        style: 'whatsapp',
      },
    },
    {
      id: 'el-puente',
      type: 'carousel',
      enabled: true,
      eyebrow: 'Acceso',
      title: '¿Por qué un puente propio cambia todo?',
      description:
        'Un acceso directo y transitable todo el año es lo que separa un terreno al que se llega, de uno al que solo se intenta llegar. El puente garantiza entrada en cualquier temporada, revaloriza cada lote y permite el ingreso de maquinaria y materiales para construir.',
      images: [
        { src: '/images/demo/puente-perene.jpg', alt: 'Puente de acceso', caption: 'Puente de acceso al proyecto' },
        { src: '/images/demo/valle-pichanaki.jpg', alt: 'Estructura del puente', caption: 'Estructura reforzada' },
        { src: '/images/demo/selva-central.jpg', alt: 'Vía de ingreso', caption: 'Vía de ingreso directa' },
      ],
      cta: {
        label: '¡Separa tu lote!',
        message: 'Hola, quiero separar un lote en Selvania Park.',
        style: 'lime',
      },
    },
    {
      id: 'servicios',
      type: 'carousel',
      enabled: true,
      eyebrow: 'Servicios básicos',
      title: 'Todo listo para vivir o construir',
      description:
        'El proyecto cuenta con los servicios básicos habilitados para que puedas empezar a construir desde el primer día.',
      images: [
        { src: '/images/demo/selva-central.jpg', alt: 'Red de agua', caption: 'Agua' },
        { src: '/images/demo/valle-pichanaki.jpg', alt: 'Red eléctrica', caption: 'Luz' },
        { src: '/images/demo/puente-perene.jpg', alt: 'Vías afirmadas', caption: 'Vías afirmadas' },
      ],
      cta: {
        label: 'Hablar con un asesor',
        message: 'Hola, quiero saber más sobre los servicios básicos de Selvania Park.',
        style: 'outline',
      },
    },
    {
      id: 'documentacion',
      type: 'text',
      enabled: true,
      eyebrow: 'Seguridad jurídica',
      title: 'Documentación en regla, sin letra chica',
      description:
        'Cada lote se transfiere con respaldo notarial. Puedes verificar todo antes de firmar.',
      bullets: [
        {
          icon: 'documento',
          title: 'Escritura pública',
          text: 'Firmada ante la Notaría Balbín, con minuta y contrato de compraventa a tu nombre.',
        },
        {
          icon: 'registro',
          title: 'Partida registral',
          text: 'El terreno está inscrito en Registros Públicos. Puedes revisar la partida cuando quieras.',
        },
        {
          icon: 'plano',
          title: 'Plano y memoria descriptiva',
          text: 'Cada lote con sus medidas, linderos y ubicación exacta debidamente documentados.',
        },
        {
          icon: 'escudo',
          title: 'Libre de cargas y gravámenes',
          text: 'Sin hipotecas, sin embargos y sin terceros con derechos sobre el terreno.',
        },
      ],
      cta: {
        label: 'Hablar con un asesor',
        message: 'Hola, quiero revisar la documentación de los lotes de Selvania Park.',
        style: 'gold',
      },
    },
    {
      id: 'por-que',
      type: 'carousel',
      enabled: true,
      eyebrow: 'La decisión',
      title: '¿Por qué ser parte de Selvania Park?',
      description:
        'Porque la selva central se está valorizando cada año, y los lotes con acceso, servicios y papeles en regla son cada vez menos.',
      images: [
        { src: '/images/demo/valle-pichanaki.jpg', alt: 'Familia en el proyecto', caption: 'Un lugar para tu familia' },
        { src: '/images/demo/selva-central.jpg', alt: 'Naturaleza', caption: 'Naturaleza a tu puerta' },
        { src: '/images/demo/puente-perene.jpg', alt: 'Inversión', caption: 'Una inversión que crece' },
      ],
      cta: {
        label: '¡Únete a Selvania Park!',
        message: 'Hola, quiero ser parte de Selvania Park. ¿Me dan más información?',
        style: 'whatsapp',
      },
    },
  ],

  footer: {
    text: 'Selvania Park — Pichanaki, Junín, Perú',
    links: [{ label: 'Política de privacidad', href: '/privacidad' }],
  },
};
