import type { APIRoute } from 'astro';
import {
  SESSION_COOKIE,
  SESSION_TTL_SECONDS,
  adminConfig,
  clearAttempts,
  createSession,
  registerFailure,
  safeEquals,
  tooManyAttempts,
  verifyPassword,
} from '../../lib/auth';

export const prerender = false;

const redirect = (location: string) =>
  new Response(null, { status: 303, headers: { Location: location } });

export const POST: APIRoute = async ({ request, cookies, clientAddress }) => {
  const ip = clientAddress ?? 'desconocida';

  if (tooManyAttempts(ip)) {
    return redirect('/admin/login?e=bloqueado');
  }

  const form = await request.formData();
  const user = String(form.get('usuario') ?? '');
  const password = String(form.get('password') ?? '');

  const config = adminConfig();

  // Se verifica la contraseña aunque el usuario ya no coincida: así el tiempo de
  // respuesta es el mismo se equivoque en el usuario o en la contraseña, y no se
  // puede deducir cuál de los dos campos estaba bien.
  const userOk = safeEquals(user, config.user);
  const passwordOk = await verifyPassword(password, config.passwordHash);

  if (!userOk || !passwordOk) {
    registerFailure(ip);
    return redirect('/admin/login?e=credenciales');
  }

  clearAttempts(ip);

  cookies.set(SESSION_COOKIE, createSession(config.user, config.sessionSecret), {
    httpOnly: true, // inalcanzable desde JavaScript, aunque haya un XSS
    secure: import.meta.env.PROD, // solo por HTTPS en producción
    sameSite: 'lax', // no se envía desde otros sitios
    path: '/',
    maxAge: SESSION_TTL_SECONDS,
  });

  return redirect('/admin');
};
