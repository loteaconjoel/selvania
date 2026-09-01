// @ts-check
import { defineConfig, envField } from 'astro/config';
import vercel from '@astrojs/vercel';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // PROVISIONAL: reemplazar por el dominio real. Se usa para la URL canónica
  // y para la imagen de previsualización al compartir el enlace.
  site: 'https://www.selvaniapark.com',

  // La landing se sigue generando estática. Solo las rutas que llevan
  // `export const prerender = false` (el panel y su API) se resuelven en el
  // servidor, así que el visitante normal recibe HTML servido desde la CDN.
  adapter: vercel(),

  env: {
    schema: {
      ADMIN_USER: envField.string({ context: 'server', access: 'secret' }),
      ADMIN_PASSWORD_HASH: envField.string({ context: 'server', access: 'secret' }),
      SESSION_SECRET: envField.string({ context: 'server', access: 'secret' }),
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },
});
