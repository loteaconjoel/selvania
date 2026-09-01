// Set de íconos propio, dibujado a línea sobre una caja de 24x24.
// Todos usan `currentColor`, así que heredan el color del contenedor y siguen
// al tema del CMS sin configuración extra.
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
    'M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z',
    'M3 9h18',
    'M9 9v12',
  ],
  escudo: [
    'M12 3 4.5 6v5.5c0 4.6 3.1 8.4 7.5 9.5 4.4-1.1 7.5-4.9 7.5-9.5V6L12 3Z',
    'm9 12 2.2 2.2L15.5 10',
  ],
  plusvalia: ['M3 17l6-6 4 4 8-8', 'M15 7h6v6'],
  llave: [
    'M12 15a4 4 0 1 1-8 0 4 4 0 1 1 8 0',
    'M10.9 12.1 20 3',
    'm17 6 2.5 2.5',
    'm14.5 8.5 2.5 2.5',
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
  reloj: ['M21 12a9 9 0 1 1-18 0 9 9 0 1 1 18 0', 'M12 7v5l3.5 2'],
  hoja: ['M4 20c0-8 6-14 16-14 0 10-6 14-13 14H4Z', 'M4 20c3-6 7-9.5 11-11'],
  casa: [
    'm3 10 9-7 9 7',
    'M5 9v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9',
    'M10 21v-6h4v6',
  ],
  premio: [
    'M18 9a6 6 0 1 1-12 0 6 6 0 1 1 12 0',
    'M8.5 14 7 22l5-3 5 3-1.5-8',
  ],
} as const;

export type IconName = keyof typeof icons;
