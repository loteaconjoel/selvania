/** Construye el enlace de WhatsApp con el mensaje ya escrito. */
export function waLink(number: string, message: string): string {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

/**
 * Enlaces de Google Fonts para las familias del tema, uno por familia.
 *
 * Van separados a propósito. Google devuelve error 400 si una familia no
 * existe, y si las dos viajaran en la misma petición una errata del cliente en
 * el panel dejaría la página sin ninguna de las dos fuentes. Así, una errata
 * solo afecta a la familia mal escrita.
 *
 * Los pesos se piden hasta 700 porque es lo máximo que ofrecen muchas familias
 * (Space Grotesk, sin ir más lejos). Al pedir 800 Google no falla: sirve el 700
 * y el navegador finge el 800 engrosando el trazo, que se ve emborronado.
 */
export function googleFontsUrls(heading: string, body: string): string[] {
  const url = (name: string) =>
    `https://fonts.googleapis.com/css2?family=${name.trim().replace(/\s+/g, '+')}:wght@400;500;600;700&display=swap`;

  return heading === body ? [url(heading)] : [url(heading), url(body)];
}
