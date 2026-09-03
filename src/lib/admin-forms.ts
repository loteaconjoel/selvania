import { icons, type IconName } from './icons';
import type { Cta, VideoSource } from '../data/types';

/**
 * Todo lo que llega de un formulario es texto sin garantías, aunque venga de una
 * sesión autenticada. Estas funciones lo convierten a los tipos del modelo y
 * descartan lo que no encaja, en vez de confiar en lo que mandó el navegador.
 */

export const text = (form: FormData, key: string, fallback = ''): string => {
  const value = form.get(key);
  return typeof value === 'string' ? value.trim() : fallback;
};

export const checkbox = (form: FormData, key: string): boolean => form.get(key) === 'on';

const CTA_STYLES = ['whatsapp', 'lime', 'gold', 'outline'] as const;
const BLOCK_TYPES = ['video', 'carousel', 'showcase', 'text', 'marquee'] as const;

export type BlockType = (typeof BLOCK_TYPES)[number];

export const isBlockType = (value: string): value is BlockType =>
  (BLOCK_TYPES as readonly string[]).includes(value);

export const ctaStyle = (value: string): Cta['style'] =>
  (CTA_STYLES as readonly string[]).includes(value) ? (value as Cta['style']) : 'whatsapp';

export const iconName = (value: string): IconName =>
  value in icons ? (value as IconName) : 'escudo';

/** Un color solo se acepta si es un hexadecimal de 6 dígitos. */
export const hexColor = (value: string, fallback: string): string =>
  /^#[0-9a-fA-F]{6}$/.test(value) ? value.toUpperCase() : fallback;

/** Nombre de fuente de Google Fonts: letras, números y espacios. */
export const fontName = (value: string, fallback: string): string =>
  /^[A-Za-z0-9 ]{1,40}$/.test(value) ? value.trim() : fallback;

/** Número de WhatsApp: solo dígitos, con código de país. */
export const phone = (value: string, fallback: string): string => {
  const digits = value.replace(/\D/g, '');
  return digits.length >= 8 && digits.length <= 15 ? digits : fallback;
};

/**
 * Una ruta de imagen o video solo se acepta si es local o https. Así no se puede
 * colar un `javascript:` ni un `data:` desde el formulario.
 */
export const mediaUrl = (value: string, fallback = ''): string =>
  /^\/[^\s]*$/.test(value) || /^https:\/\/[^\s]+$/.test(value) ? value : fallback;

export const videoSource = (form: FormData, prefix: string, fallback: VideoSource): VideoSource => {
  const kind = text(form, `${prefix}.kind`);

  if (kind === 'youtube') {
    const id = text(form, `${prefix}.youtubeId`);
    // Un ID de YouTube son 11 caracteres. Si pegan la URL completa, se extrae.
    const match = id.match(/[A-Za-z0-9_-]{11}/);
    return match ? { kind: 'youtube', youtubeId: match[0] } : fallback;
  }

  if (kind === 'file') {
    const src = mediaUrl(text(form, `${prefix}.src`));
    return src ? { kind: 'file', src } : fallback;
  }

  return fallback;
};

/**
 * Recompone las filas de una lista editable. Los campos vienen nombrados como
 * `prefijo.0.campo`, `prefijo.1.campo`... y cada fila puede traer un `orden`
 * para reordenarla y un `borrar` para eliminarla.
 */
export function rows(form: FormData, prefix: string): Record<string, string>[] {
  const collected = new Map<string, Record<string, string>>();

  for (const [key, value] of form.entries()) {
    if (typeof value !== 'string') continue;
    if (!key.startsWith(`${prefix}.`)) continue;

    const [, index, field] = key.split('.');
    if (!index || !field) continue;

    const row = collected.get(index) ?? {};
    row[field] = value.trim();
    collected.set(index, row);
  }

  return [...collected.entries()]
    .filter(([, row]) => row.borrar !== 'on')
    .map(([index, row]): Record<string, string> => ({ ...row, __index: index }))
    .sort((a, b) => {
      const orderA = Number(a.orden);
      const orderB = Number(b.orden);
      if (Number.isFinite(orderA) && Number.isFinite(orderB) && orderA !== orderB) {
        return orderA - orderB;
      }
      return Number(a.__index) - Number(b.__index);
    });
}

/**
 * La barra de anuncio se pinta con set:html para poder resaltar palabras, así
 * que se escapa todo y después se vuelven a permitir solo estas etiquetas.
 * Cualquier otra cosa, incluido un <script>, queda como texto visible.
 */
export function sanitizeInlineHtml(input: string): string {
  const escaped = input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  return escaped.replace(
    /&lt;(\/?)(strong|em|b|i|br)\s*\/?&gt;/gi,
    (_match, slash: string, tag: string) => `<${slash}${tag.toLowerCase()}>`,
  );
}

/** Convierte un texto en un identificador apto para una URL. */
export function slugify(value: string): string {
  return value
    .normalize('NFD')
    // Quita las tildes ya separadas por NFD, para que "documentación" dé
    // "documentacion" en vez de perder la letra entera.
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40);
}
