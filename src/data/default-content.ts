import type { SiteContent } from './types';

// Contenido de partida. Es lo que ve la landing mientras nadie haya guardado
// nada desde el panel; en cuanto se guarda por primera vez, manda el archivo
// data/content.json y este queda solo como valor de fábrica al que se puede
// volver desde el panel.
//
// Las fotos y el video ya son del proyecto. Los textos siguen siendo de
// muestra en las cifras concretas: revisarlos antes de publicar.

// Las fotos viven en el almacenamiento de Supabase, no en el repositorio: es de
// donde las sirve la web y de donde las reemplaza el cliente desde el panel.
const FOTO = 'https://hzqfgzkdlcnnzcozlwll.supabase.co/storage/v1/object/public/media';

export const defaultContent: SiteContent = {
  seo: {
    title: 'Selvania Park | Lotes en la selva central, a 15 min de Pichanaki',
    description:
      'El lugar de tu nuevo comienzo en el corazón de la selva central, a 15 minutos del parque de Pichanaki. Lotes con documentación en regla y servicios básicos.',
    ogImage: `${FOTO}/og-selvania.jpg`,
  },

  announcement: {
    enabled: true,
    // Informativa, no de urgencia: cualquier porcentaje de vendidos sería un
    // dato inventado.
    html: 'LOTES EN <strong>SELVANIA PARK</strong> · A 15 MIN DEL PARQUE DE PICHANAKI',
  },

  hero: {
    brand: 'Selvania Park',
    tagline:
      'El lugar de tu nuevo comienzo en el corazón de la selva central, a 15 min del parque de Pichanaki',
    video: { kind: 'youtube', youtubeId: 'f7Zs_RPt6Z0' },
    // Uno principal y uno secundario. Cuatro botones al mismo número no daban
    // cuatro opciones: repartían la atención entre lo mismo. Quien ya decidió
    // agenda la visita; quien todavía no, pregunta. Las otras intenciones
    // siguen existiendo más abajo, cada una en la sección donde encaja:
    // «¡Separa tu lote!» en el puente y «¡Únete a Selvania Park!» en el cierre.
    ctas: [
      {
        label: '¡Agenda tu visita!',
        message:
          'Hola, vi la página de Selvania Park y quiero agendar una visita al proyecto.',
        style: 'whatsapp',
      },
      {
        label: 'Hablar con un asesor',
        message: 'Hola, vi la página de Selvania Park y quiero hablar con un asesor.',
        style: 'outline',
      },
    ],
  },

  whatsapp: {
    // 51 de Perú + el móvil de 9 dígitos. WhatsApp necesita el número
    // internacional completo: sin el código, el enlace abre un chat vacío.
    number: '51939210162',
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
      heading: 'Space Grotesk',
      body: 'Inter',
    },
  },

  blocks: [
    {
      id: 'argumentos',
      type: 'marquee',
      enabled: true,
      label: 'Franja de argumentos de venta',
      // Sin cifras: no se publican medidas, precios ni cantidades. Cada frase
      // dice algo que el proyecto ofrece y que se puede sostener.
      items: [
        { icon: 'escudo', text: 'Documentación en regla ante notaría' },
        { icon: 'ubicacion', text: 'A 15 min del parque de Pichanaki' },
        { icon: 'plano', text: 'Lotes de distintas medidas' },
        { icon: 'ruta', text: 'Acceso por puente propio' },
        { icon: 'rayo', text: 'Servicios básicos habilitados' },
        { icon: 'hoja', text: 'En el corazón de la selva central' },
        { icon: 'reloj', text: 'Visitas guiadas al proyecto' },
      ],
    },
    // S2 y S3 de la maqueta van en un solo bloque, con los seis componentes que
    // pide en ese orden: título, descripción, video, encabezado, carrusel y
    // botón. El título es el de S2 y el encabezado intermedio es el de S3.
    {
      id: 'el-proyecto',
      type: 'showcase',
      enabled: true,
      eyebrow: 'El proyecto',
      title: 'Conoce Selvania Park',
      description:
        'Un terreno amplio dividido en lotes, en el corazón de la selva central. Míralo primero en video y después en fotos del lugar.',
      banner: {
        src: `${FOTO}/principal.webp`,
        alt: 'Urbanización Los Cocos: lotes de 190 m² en el distrito de Sangani, a 6 min del parque de Pichanaki. Compra y venta notarial, con luz y agua. Precio S/ 40,000 con facilidades.',
      },
      source: { kind: 'youtube', youtubeId: 'f7Zs_RPt6Z0' },
      heading: 'Así se ve hoy el proyecto',
      images: [
        {
          src: `${FOTO}/naranjos.jpg`,
          alt: 'Árboles de cítricos cargados de fruta sobre terreno despejado',
          caption: 'Cítricos en el terreno',
        },
        {
          src: `${FOTO}/huerto.jpg`,
          alt: 'Huerto de naranjos con cerros y palmeras al fondo',
          caption: 'El huerto, con el cerro al fondo',
        },
        {
          src: `${FOTO}/piscina.jpg`,
          alt: 'Piscina con toboganes, palmeras y sombrillas',
          caption: 'Zona recreativa',
        },
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
      // Todavía no hay foto del puente. Se muestra el trabajo de acceso, que es
      // lo único real que tenemos de esta sección, en vez de rellenar con fotos
      // que no enseñan lo que el texto promete.
      images: [
        {
          src: `${FOTO}/movimiento-tierras.jpg`,
          alt: 'Retroexcavadora trabajando junto a un montón de piedras de río',
          caption: 'Movimiento de tierras para el acceso',
        },
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
        {
          src: `${FOTO}/piscina.jpg`,
          alt: 'Piscina con toboganes, palmeras y sombrillas',
          caption: 'Piscina y zona de recreo',
        },
        {
          src: `${FOTO}/movimiento-tierras.jpg`,
          alt: 'Retroexcavadora trabajando junto a un montón de piedras de río',
          caption: 'Trabajos de habilitación en marcha',
        },
        {
          src: `${FOTO}/huerto.jpg`,
          alt: 'Huerto de naranjos con cerros y palmeras al fondo',
          caption: 'Áreas verdes del proyecto',
        },
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
        {
          src: `${FOTO}/piscina.jpg`,
          alt: 'Piscina con toboganes, palmeras y sombrillas',
          caption: 'Un lugar para tu familia',
        },
        {
          src: `${FOTO}/naranjos.jpg`,
          alt: 'Árboles de cítricos cargados de fruta sobre terreno despejado',
          caption: 'Cítricos en producción',
        },
        {
          src: `${FOTO}/huerto.jpg`,
          alt: 'Huerto de naranjos con cerros y palmeras al fondo',
          caption: 'Naturaleza a tu puerta',
        },
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
