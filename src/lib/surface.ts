/**
 * Sobre qué fondo se está dibujando algo. Es lo que decide los colores de los
 * botones, los títulos y los controles del carrusel.
 *
 * El motivo es medible: sobre el verde claro (#3FA34D) el lima da 1.90:1 de
 * contraste y el verde de WhatsApp 1.61:1, así que un botón de esos colores
 * literalmente desaparece. Solo el crema (3.07:1) y el verde profundo (5.34:1)
 * se sostienen encima. Por eso las secciones claras invierten los botones en
 * vez de reutilizar los mismos de las secciones oscuras.
 */
export type Surface = 'dark' | 'light';

/** Las secciones alternan fondo; las de fondo claro son las `alt`. */
export const surfaceOf = (alt: boolean): Surface => (alt ? 'light' : 'dark');
