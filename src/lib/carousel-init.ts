import EmblaCarousel from 'embla-carousel';

// Clases que el script aplica sobre la marcha. Se dejan escritas aquí para que
// el generador de CSS las encuentre al analizar el archivo.
const DOT_BASE = 'h-2.5 rounded-full transition-all duration-300';

// Lo que no está centrado se atenúa, y cómo se atenúa depende de lo que sea.
//
// En fotos se baja el brillo además de la escala. En tarjetas blancas eso no
// vale: bajarles el brillo las vuelve grises y parecen rotas, así que solo se
// encogen. Nunca con opacidad, que sobre el fondo verde mezcla el contenido con
// el fondo y parece un fallo de carga.
//
// Cada carrusel dice cuál quiere con data-slide-on y data-slide-off; si no dice
// nada, se usa el de fotos.
const FOTO_ON = 'scale-100 brightness-100';
const FOTO_OFF = 'scale-95 brightness-[0.55]';

/**
 * Pone en marcha todos los carruseles de la página.
 *
 * Vive aquí y no dentro de un componente porque hay dos que lo usan: el de
 * fotos y el de tarjetas de la sección de documentación. Con una sola copia,
 * los arreglos de alineación, atenuado y ampliación valen para ambos.
 *
 * Se puede llamar más de una vez sin efectos raros: cada carrusel ya montado
 * queda marcado y se salta en las siguientes llamadas.
 */
// Las de tarjeta llegan por atributo desde el componente. Se listan aquí para
// que el generador de CSS, que solo lee texto, las encuentre y no las descarte:
// scale-100 scale-95 scale-[0.97] brightness-100 brightness-[0.55]
export function initCarousels(): void {
  document.querySelectorAll<HTMLElement>('[data-carousel]').forEach((root) => {
    if (root.dataset.carouselListo === 'si') return;
    root.dataset.carouselListo = 'si';

    const viewport = root.querySelector<HTMLElement>('[data-embla-viewport]');
    if (!viewport) return;

    const embla = EmblaCarousel(viewport, {
      loop: true,
      // Alineado al inicio para que el primer elemento arranque justo en el
      // mismo margen que el título y el texto de la sección.
      align: 'start',
      skipSnaps: false,
    });

    root
      .querySelector<HTMLButtonElement>('[data-embla-prev]')
      ?.addEventListener('click', () => embla.scrollPrev());
    root
      .querySelector<HTMLButtonElement>('[data-embla-next]')
      ?.addEventListener('click', () => embla.scrollNext());

    const dotsNode = root.querySelector<HTMLElement>('[data-embla-dots]');
    const onClass = dotsNode?.dataset.dotOn ?? 'bg-sv-lime';
    const offClass = dotsNode?.dataset.dotOff ?? 'bg-sv-cream/30';
    const dots: HTMLButtonElement[] = [];

    if (dotsNode) {
      embla.scrollSnapList().forEach((_, i) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = DOT_BASE;
        dot.setAttribute('aria-label', `Ir al elemento ${i + 1}`);
        dot.addEventListener('click', () => embla.scrollTo(i));
        dotsNode.appendChild(dot);
        dots.push(dot);
      });
    }

    const slides = [...root.querySelectorAll<HTMLElement>('[data-slide]')];
    const onClases = (root.dataset.slideOn ?? FOTO_ON).split(' ');
    const offClases = (root.dataset.slideOff ?? FOTO_OFF).split(' ');

    const sync = () => {
      const selected = embla.selectedScrollSnap();

      dots.forEach((dot, i) => {
        const active = i === selected;
        dot.classList.toggle(onClass, active);
        dot.classList.toggle(offClass, !active);
        dot.classList.toggle('w-7', active);
        dot.classList.toggle('w-2.5', !active);
      });

      slides.forEach((slide, i) => {
        const active = i === selected;
        slide.classList.add(...(active ? onClases : offClases));
        slide.classList.remove(...(active ? offClases : onClases));
      });
    };

    embla.on('select', sync);
    sync();

    // --- Ampliar imagen ---
    const dialog = root.querySelector<HTMLDialogElement>('[data-lightbox]');
    const big = dialog?.querySelector<HTMLImageElement>('[data-lightbox-img]');
    const bigCaption = dialog?.querySelector<HTMLElement>('[data-lightbox-caption]');

    if (!dialog || !big) return;

    root.querySelectorAll<HTMLButtonElement>('[data-zoom]').forEach((btn) => {
      btn.addEventListener('click', (event) => {
        // Sin esto, el clic llega también al carrusel y cambia de elemento.
        event.stopPropagation();
        big.src = btn.dataset.src ?? '';
        big.alt = btn.dataset.alt ?? '';

        const caption = btn.dataset.caption ?? '';
        if (bigCaption) {
          bigCaption.textContent = caption;
          // Sin pie no se deja la píldora vacía flotando bajo la imagen.
          bigCaption.hidden = caption === '';
        }

        dialog.showModal();
      });
    });

    dialog
      .querySelector<HTMLButtonElement>('[data-lightbox-close]')
      ?.addEventListener('click', () => dialog.close());

    // Un clic fuera de la imagen tiene como destino el propio <dialog>.
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) dialog.close();
    });
  });
}
