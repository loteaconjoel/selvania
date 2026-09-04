import type { APIRoute } from 'astro';
import { randomBytes } from 'node:crypto';
import {
  canPersist,
  readContent,
  resetContent,
  saveMedia,
  writeContent,
} from '../../../lib/content-store';
import * as f from '../../../lib/admin-forms';
import type { Block, Bullet, Cta, MarqueeItem, Media, SiteContent } from '../../../data/types';

export const prerender = false;

/** Solo se vuelve a rutas del propio panel, nunca a un destino externo. */
function safeReturn(value: string): string {
  return /^\/admin(\/[\w-]*)*$/.test(value) ? value : '/admin';
}

const back = (to: string, query: string) =>
  new Response(null, { status: 303, headers: { Location: `${safeReturn(to)}${query}` } });

/** Reconstruye los botones de WhatsApp desde las filas del formulario. */
function readCtas(form: FormData, prefix: string): Cta[] {
  return f
    .rows(form, prefix)
    .map((row) => ({
      label: row.label ?? '',
      message: row.message ?? '',
      style: f.ctaStyle(row.style ?? ''),
    }))
    .filter((cta) => cta.label !== '');
}

/** Un solo botón opcional, el que llevan las secciones. */
function readCta(form: FormData): Cta | undefined {
  if (!f.checkbox(form, 'cta.enabled')) return undefined;
  const label = f.text(form, 'cta.label');
  if (!label) return undefined;
  return {
    label,
    message: f.text(form, 'cta.message'),
    style: f.ctaStyle(f.text(form, 'cta.style')),
  };
}

function readImages(form: FormData): Media[] {
  return f
    .rows(form, 'img')
    .map((row) => ({
      src: f.mediaUrl(row.src ?? ''),
      alt: row.alt ?? '',
      caption: row.caption || undefined,
    }))
    .filter((image) => image.src !== '');
}

function readBullets(form: FormData): Bullet[] {
  return f
    .rows(form, 'bullet')
    .map((row) => ({
      icon: f.iconName(row.icon ?? ''),
      title: row.title ?? '',
      text: row.text ?? '',
    }))
    .filter((bullet) => bullet.title !== '');
}

function readMarqueeItems(form: FormData): MarqueeItem[] {
  return f
    .rows(form, 'item')
    .map((row) => ({ icon: f.iconName(row.icon ?? ''), text: row.text ?? '' }))
    .filter((item) => item.text !== '');
}

/** Sección recién creada, con contenido de ejemplo para no partir de la nada. */
function newBlock(type: f.BlockType): Block {
  const id = `seccion-${randomBytes(3).toString('hex')}`;
  const common = { id, enabled: false, eyebrow: '', description: '' };

  switch (type) {
    case 'video':
      return {
        ...common,
        type: 'video',
        title: 'Nueva sección de video',
        source: { kind: 'youtube', youtubeId: '' },
      };
    case 'carousel':
      return { ...common, type: 'carousel', title: 'Nuevo carrusel', images: [] };
    case 'showcase':
      return {
        ...common,
        type: 'showcase',
        title: 'Nueva sección con video y carrusel',
        source: { kind: 'youtube', youtubeId: '' },
        heading: '',
        images: [],
      };
    case 'text':
      return { ...common, type: 'text', title: 'Nueva sección de texto', bullets: [] };
    case 'marquee':
      return { id, type: 'marquee', enabled: false, label: 'Nueva franja', items: [] };
  }
}

export const POST: APIRoute = async ({ request }) => {
  const form = await request.formData();
  const action = f.text(form, 'accion');
  const to = f.text(form, 'volver', '/admin');

  if (!canPersist()) {
    return back(to, '?e=sin-almacenamiento');
  }

  try {
    if (action === 'restablecer') {
      await resetContent();
      return back(to, '?ok=restablecido');
    }

    if (action === 'imagen') {
      const file = form.get('archivo');
      if (!(file instanceof File) || file.size === 0) return back(to, '?e=sin-archivo');
      const url = await saveMedia(file);
      return back(to, `?ok=imagen&url=${encodeURIComponent(url)}`);
    }

    const content: SiteContent = await readContent();

    switch (action) {
      case 'general': {
        content.seo.title = f.text(form, 'seo.title') || content.seo.title;
        content.seo.description = f.text(form, 'seo.description');
        content.seo.ogImage = f.mediaUrl(f.text(form, 'seo.ogImage'), content.seo.ogImage);

        content.announcement.enabled = f.checkbox(form, 'announcement.enabled');
        content.announcement.html = f.sanitizeInlineHtml(f.text(form, 'announcement.html'));

        content.hero.brand = f.text(form, 'hero.brand') || content.hero.brand;
        content.hero.tagline = f.text(form, 'hero.tagline');
        content.hero.video = f.videoSource(form, 'hero.video', content.hero.video);
        content.hero.poster = f.mediaUrl(f.text(form, 'hero.poster')) || undefined;
        content.hero.ctas = readCtas(form, 'cta');

        content.whatsapp.number = f.phone(f.text(form, 'whatsapp.number'), content.whatsapp.number);

        content.footer.text = f.text(form, 'footer.text');
        content.footer.links = f
          .rows(form, 'link')
          .map((row) => ({ label: row.label ?? '', href: f.mediaUrl(row.href ?? '') }))
          .filter((link) => link.label !== '' && link.href !== '');
        break;
      }

      case 'tema': {
        const colors = content.theme.colors;
        colors.jungleDeep = f.hexColor(f.text(form, 'color.jungleDeep'), colors.jungleDeep);
        colors.jungle = f.hexColor(f.text(form, 'color.jungle'), colors.jungle);
        colors.lime = f.hexColor(f.text(form, 'color.lime'), colors.lime);
        colors.gold = f.hexColor(f.text(form, 'color.gold'), colors.gold);
        colors.cream = f.hexColor(f.text(form, 'color.cream'), colors.cream);

        content.theme.fonts.heading = f.fontName(
          f.text(form, 'font.heading'),
          content.theme.fonts.heading,
        );
        content.theme.fonts.body = f.fontName(f.text(form, 'font.body'), content.theme.fonts.body);
        break;
      }

      case 'bloque': {
        const id = f.text(form, 'id');
        const block = content.blocks.find((candidate) => candidate.id === id);
        if (!block) return back(to, '?e=no-existe');

        block.enabled = f.checkbox(form, 'enabled');

        if (block.type === 'marquee') {
          block.label = f.text(form, 'label') || block.label;
          block.items = readMarqueeItems(form);
          break;
        }

        block.title = f.text(form, 'title') || block.title;
        block.eyebrow = f.text(form, 'eyebrow') || undefined;
        block.description = f.text(form, 'description') || undefined;
        block.cta = readCta(form);

        if (block.type === 'video') {
          block.source = f.videoSource(form, 'video', block.source);
          block.poster = f.mediaUrl(f.text(form, 'poster')) || undefined;
        } else if (block.type === 'carousel') {
          block.images = readImages(form);
        } else if (block.type === 'showcase') {
          block.source = f.videoSource(form, 'video', block.source);
          block.poster = f.mediaUrl(f.text(form, 'poster')) || undefined;
          block.heading = f.text(form, 'heading') || undefined;
          block.images = readImages(form);

          const bannerSrc = f.mediaUrl(f.text(form, 'banner.src'));
          block.banner = bannerSrc
            ? { src: bannerSrc, alt: f.text(form, 'banner.alt') }
            : undefined;
        } else {
          block.bullets = readBullets(form);
        }
        break;
      }

      case 'nuevo': {
        const type = f.text(form, 'tipo');
        if (!f.isBlockType(type)) return back(to, '?e=tipo');
        const block = newBlock(type);
        content.blocks.push(block);
        await writeContent(content);
        // Se va directo a editarla: recién creada está vacía y oculta.
        return back(`/admin/seccion/${block.id}`, '?ok=creada');
      }

      case 'mover': {
        const index = content.blocks.findIndex((block) => block.id === f.text(form, 'id'));
        const target = index + (f.text(form, 'direccion') === 'arriba' ? -1 : 1);
        if (index < 0 || target < 0 || target >= content.blocks.length) {
          return back(to, '?e=orden');
        }
        [content.blocks[index], content.blocks[target]] = [
          content.blocks[target],
          content.blocks[index],
        ];
        break;
      }

      case 'visibilidad': {
        const block = content.blocks.find((candidate) => candidate.id === f.text(form, 'id'));
        if (!block) return back(to, '?e=no-existe');
        block.enabled = !block.enabled;
        break;
      }

      case 'eliminar': {
        const id = f.text(form, 'id');
        const before = content.blocks.length;
        content.blocks = content.blocks.filter((block) => block.id !== id);
        if (content.blocks.length === before) return back(to, '?e=no-existe');
        await writeContent(content);
        return back('/admin', '?ok=eliminada');
      }

      default:
        return back(to, '?e=accion');
    }

    await writeContent(content);
    return back(to, '?ok=guardado');
  } catch (error) {
    const reason = error instanceof Error ? error.message : 'desconocido';
    const code = ['formato', 'tamano'].includes(reason) ? reason : 'guardar';
    return back(to, `?e=${code}`);
  }
};
