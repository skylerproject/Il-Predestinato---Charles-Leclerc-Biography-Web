/* ================================================================
   renderers.ts — DOM rendering functions (type-safe)
   ================================================================ */

import type { Stats, HelmetView } from './types';

/**
 * Renders the stats grid into the target container.
 * Each stat card includes a data-count attribute for GSAP count-up.
 */
export function renderStats(container: HTMLElement, stats: readonly Stats[]): void {
  container.innerHTML = stats
    .map(
      (s) => `
      <div class="stat" data-reveal>
        <div class="stat__number">
          <span data-count="${s.value}">0</span>${s.suffix ? `<span class="stat__plus">${s.suffix}</span>` : ''}
        </div>
        <div class="stat__label">${s.label}</div>
      </div>`
    )
    .join('');
}

/**
 * Renders the helmet gallery grid into the target container.
 * Each card receives a data-tilt attribute for the 3D tilt effect.
 */
export function renderHelmets(container: HTMLElement, helmets: readonly HelmetView[]): void {
  container.innerHTML = helmets
    .map(
      (h) => `
      <div class="helmet-card" data-tilt data-reveal>
        <img src="${h.src}" alt="${h.alt}" loading="lazy">
        <div class="helmet-card__overlay">
          <span class="helmet-card__view">${h.viewLabel}</span>
        </div>
      </div>`
    )
    .join('');
}
