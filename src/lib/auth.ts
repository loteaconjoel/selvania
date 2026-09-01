import {
  createHmac,
  randomBytes,
  scrypt as scryptCallback,
  timingSafeEqual,
  createHash,
} from 'node:crypto';
import { promisify } from 'node:util';
import { ADMIN_USER, ADMIN_PASSWORD_HASH, SESSION_SECRET } from 'astro:env/server';

const scrypt = promisify(scryptCallback) as (
  password: string | Buffer,
  salt: Buffer,
  keylen: number,
  options: { N: number; r: number; p: number; maxmem: number },
) => Promise<Buffer>;

// N=32768 tarda ~100 ms por intento en hardware normal: imperceptible para
// quien conoce la contraseña, carísimo para quien intenta adivinarla.
// scrypt necesita 128*N*r bytes (~33 MB aquí), por encima del maxmem por
// defecto de Node (32 MB), así que hay que subirlo explícitamente.
const SCRYPT = { N: 32768, r: 8, p: 1, maxmem: 96 * 1024 * 1024 };
const KEY_LENGTH = 64;

export const SESSION_COOKIE = 'sv_session';
export const SESSION_TTL_SECONDS = 60 * 60 * 8; // 8 horas

/**
 * Deriva el hash de una contraseña.
 * Formato: scrypt:N:r:p:salt:clave (todo en base64). Se usa ':' y no '$'
 * porque el cargador de .env expande $algo como si fuera una variable.
 * La sal es distinta en cada llamada, así que dos usuarios con la misma
 * contraseña no comparten hash.
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const key = await scrypt(password.normalize('NFKC'), salt, KEY_LENGTH, SCRYPT);
  return [
    'scrypt',
    SCRYPT.N,
    SCRYPT.r,
    SCRYPT.p,
    salt.toString('base64'),
    key.toString('base64'),
  ].join(':');
}

/** Compara una contraseña con un hash almacenado, sin filtrar tiempo. */
export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const parts = stored.split(':');
  if (parts.length !== 6 || parts[0] !== 'scrypt') return false;

  const [, rawN, rawR, rawP, rawSalt, rawKey] = parts;
  const N = Number(rawN);
  const r = Number(rawR);
  const p = Number(rawP);
  if (!Number.isInteger(N) || !Number.isInteger(r) || !Number.isInteger(p)) return false;

  const expected = Buffer.from(rawKey, 'base64');
  const derived = await scrypt(
    password.normalize('NFKC'),
    Buffer.from(rawSalt, 'base64'),
    expected.length,
    { N, r, p, maxmem: SCRYPT.maxmem },
  );

  return derived.length === expected.length && timingSafeEqual(derived, expected);
}

/**
 * Compara dos cadenas en tiempo constante. Se comparan sus SHA-256 para que la
 * duración no dependa tampoco de la longitud del texto.
 */
export function safeEquals(a: string, b: string): boolean {
  const digest = (value: string) => createHash('sha256').update(value, 'utf8').digest();
  return timingSafeEqual(digest(a), digest(b));
}

const b64url = {
  encode: (value: string) => Buffer.from(value, 'utf8').toString('base64url'),
  decode: (value: string) => Buffer.from(value, 'base64url').toString('utf8'),
};

const sign = (payload: string, secret: string) =>
  createHmac('sha256', secret).update(payload).digest('base64url');

/**
 * Emite una sesión firmada. El propio token lleva el usuario y el vencimiento,
 * así que no hace falta guardar sesiones en ninguna base de datos: si la firma
 * cuadra, el contenido no fue alterado.
 */
export function createSession(user: string, secret: string): string {
  const payload = b64url.encode(
    JSON.stringify({ u: user, exp: Date.now() + SESSION_TTL_SECONDS * 1000 }),
  );
  return `${payload}.${sign(payload, secret)}`;
}

/** Devuelve el usuario si el token es válido y no ha vencido; si no, null. */
export function readSession(token: string, secret: string): string | null {
  const [payload, signature] = token.split('.');
  if (!payload || !signature) return null;

  const expected = sign(payload, secret);
  if (signature.length !== expected.length) return null;
  if (!timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;

  try {
    const { u, exp } = JSON.parse(b64url.decode(payload)) as { u: string; exp: number };
    if (typeof u !== 'string' || typeof exp !== 'number' || Date.now() > exp) return null;
    return u;
  } catch {
    return null;
  }
}

interface AdminConfig {
  user: string;
  passwordHash: string;
  sessionSecret: string;
}

/**
 * Credenciales del panel. Se declaran como secretos en astro.config.mjs, así que
 * Astro las lee del entorno en tiempo de ejecución y nunca las incrusta en el
 * build: el hash no viaja dentro de ningún archivo JavaScript publicado.
 */
export function adminConfig(): AdminConfig {
  return {
    user: ADMIN_USER,
    passwordHash: ADMIN_PASSWORD_HASH,
    sessionSecret: SESSION_SECRET,
  };
}

// Freno a la fuerza bruta. Es memoria del proceso: en Vercel cada instancia
// lleva su propia cuenta y se reinicia al dormirse, así que frena a un script
// insistente pero no a un ataque distribuido. Para eso haría falta Vercel KV.
const attempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 8;
const WINDOW_MS = 10 * 60 * 1000;

export function tooManyAttempts(ip: string): boolean {
  const entry = attempts.get(ip);
  if (!entry || Date.now() > entry.resetAt) return false;
  return entry.count >= MAX_ATTEMPTS;
}

export function registerFailure(ip: string): void {
  const now = Date.now();
  const entry = attempts.get(ip);
  if (!entry || now > entry.resetAt) {
    attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return;
  }
  entry.count += 1;
}

export function clearAttempts(ip: string): void {
  attempts.delete(ip);
}
