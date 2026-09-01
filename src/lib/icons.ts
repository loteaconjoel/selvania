// Set de íconos propio, dibujado a línea sobre una caja de 24x24, con trazo
// uniforme y esquinas redondeadas. Todos usan `currentColor`, así que heredan
// el color del contenedor y siguen al tema del CMS sin configuración extra.
//
// Los nombres están en español porque son los que verá el cliente en el
// desplegable del panel de administración al elegir un ícono.

export const icons = {
  documento: [
    'M14 3H7a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V7l-4-4Z',
    'M14 3v4h4',
    'M9 13h6',
    'M9 17h4',
  ],
  registro: [
    'M3 21h18',
    'M5 21V10',
    'M9.5 21V10',
    'M14.5 21V10',
    'M19 21V10',
    'M12 3 3 8h18l-9-5Z',
  ],
  plano: [
    'M4 3h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z',
    'M3 9h18',
    'M9 21V9',
  ],
  escudo: [
    'M12 3 4.5 6v5.5c0 4.6 3.1 8.4 7.5 9.5 4.4-1.1 7.5-4.9 7.5-9.5V6L12 3Z',
    'm9 12 2.2 2.2L15.5 10',
  ],
  plusvalia: ['M3 17.5 9.5 11l4 4L21 7.5', 'M15 7.5h6v6'],
  llave: [
    'M10.5 12a3.5 3.5 0 1 1-7 0 3.5 3.5 0 1 1 7 0',
    'M10.5 12H21',
    'M17.5 12v3.5',
    'M20.5 12v2.5',
  ],
  ubicacion: [
    'M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z',
    'M14.5 10a2.5 2.5 0 1 1-5 0 2.5 2.5 0 1 1 5 0',
  ],
  familias: [
    'M16 20v-1.5a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4V20',
    'M13 7.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 1 1 7 0',
    'M21 20v-1.5a4 4 0 0 0-3-3.87',
    'M16 4.13a3.5 3.5 0 0 1 0 6.74',
  ],
  reloj: ['M21 12a9 9 0 1 1-18 0 9 9 0 1 1 18 0', 'M12 7.5v5l3.5 2'],
  hoja: [
    'M11 20.5A7.5 7.5 0 0 1 9.7 6.3C15.4 5.2 17 4.6 19 2c1 2 2 4.2 2 8 0 5.8-4.7 10.5-10 10.5Z',
    'M3 21c0-3.2 2-5.6 5.3-6.3C10.9 14.1 13 12.6 14 11.5',
  ],
  casa: ['m3 10 9-7 9 7', 'M5 9v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9', 'M10 21v-6h4v6'],
  premio: ['M18 9a6 6 0 1 1-12 0 6 6 0 1 1 12 0', 'm8.3 13.9-1.3 8.1 5-3 5 3-1.3-8.1'],
  gota: ['M19 14.5a7 7 0 0 1-14 0C5 9.8 12 2.5 12 2.5s7 7.3 7 12Z'],
  rayo: ['M13.5 2 4 14h6.5L9.5 22 20 10h-7l.5-8Z'],
  ruta: ['M8.5 3 4.5 21', 'M19.5 21 15.5 3', 'M12 5.5v2', 'M12 11v2', 'M12 16.5v2'],
  montana: ['m2.5 19 6.5-9.5 3.5 4.5 3-3.5 6 8.5H2.5Z', 'M17.5 6.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 1 1 3 0'],
  sol: [
    'M16.5 12a4.5 4.5 0 1 1-9 0 4.5 4.5 0 1 1 9 0',
    'M12 2v2.5',
    'M12 19.5V22',
    'M2 12h2.5',
    'M19.5 12H22',
    'm5 5 1.8 1.8',
    'm17.2 17.2 1.8 1.8',
    'm19 5-1.8 1.8',
    'm6.8 17.2L5 19',
  ],
  arbol: [
    'M12 22v-5',
    'M12 17a5 5 0 0 1-4.6-7A4.2 4.2 0 0 1 12 3.5 4.2 4.2 0 0 1 16.6 10 5 5 0 0 1 12 17Z',
    'm12 13 2.5-2.5',
    'm12 15-2.5-2.5',
  ],
} as const;

export type IconName = keyof typeof icons;
