import type { IconName } from '../lib/icons';

// Modelo de contenido de Selvania Park.
// Este archivo es la fuente de verdad: el esquema de Sanity se genera a partir
// de estos tipos, y el panel de administración editará exactamente estos campos.

/** Botón que abre WhatsApp con un mensaje ya escrito. */
export interface Cta {
  /** Texto visible del botón. Ej: "¡Agenda tu visita!" */
  label: string;
  /** Mensaje precargado en WhatsApp. Sirve para saber de qué sección vino el lead. */
  message: string;
  /** Apariencia del botón. */
  style: 'whatsapp' | 'lime' | 'gold' | 'outline';
}

export interface Media {
  src: string;
  alt: string;
  caption?: string;
}

export interface Bullet {
  /** Nombre del ícono, elegido de la lista de src/lib/icons.ts */
  icon: IconName;
  title: string;
  text: string;
  /**
   * Imagen del punto: la foto de la notaría, el documento escaneado. Es
   * opcional, así que mientras no la haya la tarjeta se ve solo con su ícono.
   */
  image?: Media;
}

/**
 * Fondo de la sección.
 * - auto: alterna con la sección anterior, que es el comportamiento por defecto.
 * - dark / light: lo fija a mano.
 *
 * Solo se ofrecen los dos fondos de la paleta y no un color libre: son los
 * únicos con el contraste ya comprobado contra los textos y los botones. Un
 * color cualquiera dejaría textos ilegibles sin avisar.
 */
export type BlockSurface = 'auto' | 'dark' | 'light';

interface BlockBase {
  /** Identificador estable, usado como ancla (#id) y como key de React/Astro. */
  id: string;
  /** Texto pequeño sobre el título. */
  eyebrow?: string;
  title: string;
  /** Párrafo introductorio de la sección. */
  description?: string;
  /** Si es false, la sección no se renderiza. El admin puede ocultar sin borrar. */
  enabled: boolean;
  /** Fondo propio. Si falta o es 'auto', alterna con la sección anterior. */
  surface?: BlockSurface;
  cta?: Cta;
}

/**
 * De dónde sale un video. YouTube no consume ancho de banda del hosting;
 * un archivo propio sí, y hay que vigilarlo.
 */
export type VideoSource =
  | { kind: 'youtube'; youtubeId: string }
  | { kind: 'file'; src: string };

/** Sección con video. */
export interface VideoBlock extends BlockBase {
  type: 'video';
  source: VideoSource;
  /** Imagen de portada. Si se omite en YouTube, se usa su miniatura. */
  poster?: string;
}

/** Sección con carrusel de imágenes. */
export interface CarouselBlock extends BlockBase {
  type: 'carousel';
  images: Media[];
}

/**
 * Video y carrusel en una sola sección, con un encabezado entre los dos.
 * Es la estructura que pide la maqueta para el bloque del proyecto: título,
 * descripción, video, encabezado, carrusel y botón.
 */
export interface ShowcaseBlock extends BlockBase {
  type: 'showcase';
  /**
   * Imagen a sangre que abre la sección, antes del video. Pensada para una
   * pieza gráfica ya diseñada (un flyer), no para una foto: se muestra entera,
   * sin recortar, porque recortarla le comería el texto.
   */
  banner?: Media;
  /** Encabezado entre la imagen de apertura y el video. */
  videoHeading?: string;
  source: VideoSource;
  poster?: string;
  /** Encabezado que separa el video del carrusel. */
  heading?: string;
  images: Media[];
}

/** Sección de texto con lista de puntos. */
export interface TextBlock extends BlockBase {
  type: 'text';
  bullets: Bullet[];
}

/** Frase suelta de la franja en movimiento. */
export interface MarqueeItem {
  icon: IconName;
  text: string;
}

/**
 * Franja de desplazamiento infinito. No lleva título ni descripción: es una
 * banda delgada que separa dos secciones y refuerza argumentos de venta.
 */
export interface MarqueeBlock {
  type: 'marquee';
  id: string;
  enabled: boolean;
  /** Nombre interno, solo para reconocerla en el panel de administración. */
  label: string;
  /** Fondo de la banda. Por defecto va en verde medio. */
  surface?: BlockSurface;
  items: MarqueeItem[];
}

export type Block =
  | VideoBlock
  | CarouselBlock
  | ShowcaseBlock
  | TextBlock
  | MarqueeBlock;

export interface Theme {
  colors: {
    /** Fondo principal, verde bosque muy oscuro. */
    jungleDeep: string;
    /** Verde medio para secciones alternas, acentos e íconos. */
    jungle: string;
    /** Verde lima neón, color de acento, CTA y botones. */
    lime: string;
    /** Verde claro, acento secundario y bloques de contenido. */
    gold: string;
    /** Blanco suave, texto sobre fondos oscuros. */
    cream: string;
  };
  fonts: {
    /** Nombre exacto de la fuente en Google Fonts. Ej: "Outfit" */
    heading: string;
    body: string;
  };
}

export interface SiteContent {
  /** Datos para SEO y para la tarjeta que aparece al compartir por WhatsApp. */
  seo: {
    title: string;
    description: string;
    /** URL absoluta de la imagen de previsualización (1200x630). */
    ogImage: string;
  };
  /** Barra de urgencia superior. */
  announcement: {
    enabled: boolean;
    /** Se admite <strong> para resaltar. */
    html: string;
  };
  hero: {
    brand: string;
    tagline: string;
    /** Video de presentación. */
    video: VideoSource;
    poster?: string;
    ctas: Cta[];
  };
  whatsapp: {
    /** Número con código de país, solo dígitos. Ej: 51987654321 */
    number: string;
  };
  theme: Theme;
  blocks: Block[];
  footer: {
    text: string;
    /** Enlaces legales o de redes. */
    links: { label: string; href: string }[];
  };
}
