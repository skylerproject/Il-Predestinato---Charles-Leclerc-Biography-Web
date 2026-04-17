/* ================================================================
   cursor.ts — Magnetic ring follower (system cursor kept!)
   ================================================================
   The default system cursor is PRESERVED. This adds a subtle,
   non-blocking magnetic ring that follows with a delay.
   Text selection stays fully enabled.
   ================================================================ */

import gsap from 'gsap';

export function initMagneticRing(): void {
  const ring = document.getElementById('magnetic-ring');
  if (!ring || !window.matchMedia('(pointer: fine)').matches) {
    ring?.remove();
    return;
  }

  let mx = 0;
  let my = 0;

  document.addEventListener('mousemove', (e: MouseEvent) => {
    mx = e.clientX;
    my = e.clientY;
  });

  // Smooth follow with GSAP ticker (delayed trail)
  gsap.ticker.add(() => {
    gsap.to(ring, {
      x: mx,
      y: my,
      duration: 0.55,
      ease: 'power3.out',
    });
  });

  // Scale up on interactive hover
  const interactives = document.querySelectorAll<HTMLElement>(
    'a, button, [data-tilt], .ptag, .tl-card__img'
  );

  interactives.forEach((el) => {
    el.addEventListener('mouseenter', () => ring.classList.add('is-active'));
    el.addEventListener('mouseleave', () => ring.classList.remove('is-active'));
  });
}
