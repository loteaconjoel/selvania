import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { defaultContent } from '../data/default-content';
import type { SiteContent } from '../data/types';

const DATA_DIR = join(process.cwd(), 'data');
const CONTENT_FILE = join(DATA_DIR, 'content.json');

export const UPLOADS_DIR = join(process.cwd(), 'public', 'uploads');
export const UPLOADS_URL = '/uploads';

/**
 * En Vercel el sistema de archivos de la función es de solo lectura, así que
 * este almacén sirve para trabajar en local pero no para producción. El panel
 * lo comprueba y avisa en pantalla en vez de fallar al guardar.
 *
 * Para producción hay que sustituir readContent/writeContent por un driver
 * contra una base de datos o Vercel Blob. El resto del código no cambia: todo
 * pasa por estas dos funciones.
 */
export const canPersist = !process.env.VERCEL;

/** Contenido publicado. Si nadie guardó nada aún, el de fábrica. */
export async function readContent(): Promise<SiteContent> {
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
  if (!canPersist) {
    throw new Error(
      'Este entorno no permite escribir en disco. Hace falta conectar una base de datos.',
    );
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
