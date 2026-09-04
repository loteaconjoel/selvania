import { mkdir, readFile, readdir, rename, writeFile } from 'node:fs/promises';
import { randomBytes } from 'node:crypto';
import { join } from 'node:path';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } from 'astro:env/server';
import { defaultContent } from '../data/default-content';
import type { SiteContent } from '../data/types';
import { slugify } from './admin-forms';

const DATA_DIR = join(process.cwd(), 'data');
const CONTENT_FILE = join(DATA_DIR, 'content.json');
const UPLOADS_DIR = join(process.cwd(), 'public', 'uploads');
const UPLOADS_URL = '/uploads';

/** Tabla de una sola fila donde vive todo el contenido de la página. */
const TABLE = 'site_content';
const ROW_ID = 'main';
/** Bucket público de Supabase donde se guardan las imágenes subidas. */
const BUCKET = 'media';

let client: SupabaseClient | null | undefined;

/**
 * Cliente de Supabase, o null si no está configurado. Se usa la clave de
 * servicio, que salta las políticas de acceso: solo puede hacerlo porque este
 * módulo nunca llega al navegador; se declara como secreto de servidor y solo
 * lo importan rutas que se resuelven en el servidor.
 */
function getClient(): SupabaseClient | null {
  if (client !== undefined) return client;

  client =
    SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY
      ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
          auth: { persistSession: false },
        })
      : null;

  return client;
}

export type StorageMode = 'supabase' | 'archivo' | 'solo-lectura';

/**
 * Dónde se está guardando ahora mismo:
 * - supabase: en producción y en local si están las claves. Es el bueno.
 * - archivo: sin claves y con disco escribible (local). Sirve para trabajar.
 * - solo-lectura: sin claves y sin disco escribible (Vercel). No se puede guardar.
 */
export function storageMode(): StorageMode {
  if (getClient()) return 'supabase';
  return process.env.VERCEL ? 'solo-lectura' : 'archivo';
}

export const canPersist = () => storageMode() !== 'solo-lectura';

/** Contenido publicado. Si nadie guardó nada aún, el de fábrica. */
export async function readContent(): Promise<SiteContent> {
  const supabase = getClient();

  if (supabase) {
    const { data, error } = await supabase
      .from(TABLE)
      .select('content')
      .eq('id', ROW_ID)
      .maybeSingle();

    if (error) {
      // Si Supabase falla, la página tiene que seguir viéndose. Se cae al
      // contenido de fábrica en vez de devolver un error al visitante.
      console.error('[content-store] No se pudo leer de Supabase:', error.message);
      return structuredClone(defaultContent);
    }

    return (data?.content as SiteContent | undefined) ?? structuredClone(defaultContent);
  }

  try {
    return JSON.parse(await readFile(CONTENT_FILE, 'utf8')) as SiteContent;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return structuredClone(defaultContent);
    }
    throw error;
  }
}

export async function writeContent(content: SiteContent): Promise<void> {
  const supabase = getClient();

  if (supabase) {
    const { error } = await supabase
      .from(TABLE)
      .upsert({ id: ROW_ID, content, updated_at: new Date().toISOString() });

    if (error) throw new Error(`Supabase: ${error.message}`);
    return;
  }

  if (!canPersist()) {
    throw new Error('Este entorno no permite escribir y no hay Supabase configurado.');
  }

  await mkdir(DATA_DIR, { recursive: true });

  // Se escribe a un temporal y se renombra: si algo falla a mitad, el archivo
  // bueno sigue intacto en vez de quedar a medias.
  const temp = `${CONTENT_FILE}.${process.pid}.tmp`;
  await writeFile(temp, `${JSON.stringify(content, null, 2)}\n`, 'utf8');
  await rename(temp, CONTENT_FILE);
}

/** Vuelve al contenido de fábrica. */
export async function resetContent(): Promise<void> {
  await writeContent(structuredClone(defaultContent));
}

const IMAGE_TYPES: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/avif': '.avif',
  'image/gif': '.gif',
};
const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;

/**
 * Guarda una imagen subida desde el panel y devuelve su URL pública.
 * Con Supabase va a su almacenamiento con CDN; sin él, a public/uploads.
 */
export async function saveMedia(file: File): Promise<string> {
  // El SVG queda fuera a propósito: puede llevar scripts dentro y se serviría
  // desde el propio dominio.
  const extension = IMAGE_TYPES[file.type];
  if (!extension) throw new Error('formato');
  if (file.size > MAX_UPLOAD_BYTES) throw new Error('tamano');

  const base = slugify(file.name.replace(/\.[^.]+$/, '')) || 'imagen';
  const name = `${base}-${randomBytes(4).toString('hex')}${extension}`;

  const supabase = getClient();

  if (supabase) {
    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(name, file, { contentType: file.type, upsert: false });

    if (error) throw new Error(`Supabase: ${error.message}`);

    return supabase.storage.from(BUCKET).getPublicUrl(name).data.publicUrl;
  }

  await mkdir(UPLOADS_DIR, { recursive: true });
  await writeFile(join(UPLOADS_DIR, name), Buffer.from(await file.arrayBuffer()));

  return `${UPLOADS_URL}/${name}`;
}

export interface MediaFile {
  name: string;
  url: string;
}

/**
 * Imágenes ya subidas, para que el panel pueda ofrecerlas en vez de obligar a
 * recordar rutas. Si falla la consulta se devuelve una lista vacía: la galería
 * es una comodidad y no debe tumbar la pantalla de edición.
 */
export async function listMedia(): Promise<MediaFile[]> {
  const supabase = getClient();

  if (supabase) {
    const { data, error } = await supabase.storage
      .from(BUCKET)
      .list('', { limit: 100, sortBy: { column: 'created_at', order: 'desc' } });

    if (error || !data) {
      console.error('[content-store] No se pudo listar el almacenamiento:', error?.message);
      return [];
    }

    return data
      .filter((file) => file.id && /\.(jpe?g|png|webp|avif|gif)$/i.test(file.name))
      .map((file) => ({
        name: file.name,
        url: supabase.storage.from(BUCKET).getPublicUrl(file.name).data.publicUrl,
      }));
  }

  try {
    const files = await readdir(UPLOADS_DIR);
    return files
      .filter((name) => /\.(jpe?g|png|webp|avif|gif)$/i.test(name))
      .map((name) => ({ name, url: `${UPLOADS_URL}/${name}` }));
  } catch {
    return [];
  }
}
