// @ts-check
import { defineConfig, envField } from 'astro/config';
import vercel from '@astrojs/vercel';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // Dirección pública del sitio. De aquí salen la URL canónica y la tarjeta que
  // se ve al compartir el enlace, así que un valor equivocado se nota en Google
  // y en WhatsApp.
  //
  // Vercel expone el dominio de producción durante la compilación, así que sin
  // configurar nada ya sale correcto. Al conectar el dominio propio, basta con
  // definir SITE_URL en Vercel y se usa ese.
  site:
    process.env.SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : 'http://localhost:4321'),

  // La landing se sigue generando estática. Solo las rutas que llevan
  // `export const prerender = false` (el panel y su API) se resuelven en el
  // servidor, así que el visitante normal recibe HTML servido desde la CDN.
  adapter: vercel(),

  env: {
    schema: {
      ADMIN_USER: envField.string({ context: 'server', access: 'secret' }),
      ADMIN_PASSWORD_HASH: envField.string({ context: 'server', access: 'secret' }),
      SESSION_SECRET: envField.string({ context: 'server', access: 'secret' }),

      // Almacenamiento del contenido y las imágenes. Si faltan, el sitio
      // funciona igual leyendo del archivo local: así se puede trabajar en
      // local sin depender de Supabase.
      SUPABASE_URL: envField.string({ context: 'server', access: 'secret', optional: true }),
      SUPABASE_SERVICE_ROLE_KEY: envField.string({
        context: 'server',
        access: 'secret',
        optional: true,
      }),
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },
});
