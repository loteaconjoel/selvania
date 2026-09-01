/** Construye el enlace de WhatsApp con el mensaje ya escrito. */
export function waLink(number: string, message: string): string {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

/** URL de Google Fonts para las dos familias configuradas en el tema. */
export function googleFontsUrl(heading: string, body: string): string {
  const family = (name: string, weights: string) =>
    `family=${name.trim().replace(/\s+/g, '+')}:wght@${weights}`;
  const families =
    heading === body
      ? [family(heading, '400;500;600;700;800')]
      : [family(heading, '600;700;800'), family(body, '400;500;600')];
  return `https://fonts.googleapis.com/css2?${families.join('&')}&display=swap`;
}
