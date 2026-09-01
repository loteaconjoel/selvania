import { defineMiddleware } from 'astro:middleware';
import { SESSION_COOKIE, adminConfig, readSession } from './lib/auth';

const LOGIN_PATH = '/admin/login';

export const onRequest = defineMiddleware(async (context, next) => {
  const path = context.url.pathname.replace(/\/$/, '') || '/';

  // Todo lo que cuelga de /admin exige sesión, salvo la propia pantalla de login.
  if (!path.startsWith('/admin') || path === LOGIN_PATH) {
    return next();
  }

  const token = context.cookies.get(SESSION_COOKIE)?.value;
  const user = token ? readSession(token, adminConfig().sessionSecret) : null;

  if (!user) {
    // La cookie puede existir pero estar vencida o manipulada: se descarta.
    context.cookies.delete(SESSION_COOKIE, { path: '/' });
    return context.redirect(LOGIN_PATH, 302);
  }

  context.locals.admin = user;
  return next();
});
