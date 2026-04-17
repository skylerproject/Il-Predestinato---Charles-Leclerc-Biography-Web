/* ================================================================
   data.ts — All typed data for the Leclerc memoir
   ================================================================ */

import type { Stats, HelmetView } from './types';

/** Career stats as of 2026 */
export const STATS: readonly Stats[] = [
  { label: 'Grand Prix Wins',  value: 8,  suffix: '+' },
  { label: 'Pole Positions',   value: 26, suffix: '+' },
  { label: 'Podium Finishes',  value: 41, suffix: '+' },
  { label: 'Fastest Laps',     value: 10, suffix: '+' },
] as const;

/** Helmet gallery views */
export const HELMETS: readonly HelmetView[] = [
  {
    src: '/assets/Charles-Leclerc-helmet-for-2026-formulaone-f1-charlesleclerc16-scuderriaferrari-helmets.jpg',
    alt: 'Leclerc 2026 helmet — front view',
    viewLabel: 'Front View',
  },
  {
    src: '/assets/Charles-Leclerc-helmet-for-2026-formulaone-f1-charlesleclerc16-scuderriaferrari-helmets-(1).jpg',
    alt: 'Leclerc 2026 helmet — side view',
    viewLabel: 'Side View',
  },
  {
    src: '/assets/Charles-Leclerc-helmet-for-2026-formulaone-f1-charlesleclerc16-scuderriaferrari-helmets-(2).jpg',
    alt: 'Leclerc 2026 helmet — top view',
    viewLabel: 'Top View',
  },
  {
    src: '/assets/Charles-Leclerc-helmet-for-2026-formulaone-f1-charlesleclerc16-scuderriaferrari-helmets-(3).jpg',
    alt: 'Leclerc 2026 helmet — rear view',
    viewLabel: 'Rear View',
  },
] as const;
