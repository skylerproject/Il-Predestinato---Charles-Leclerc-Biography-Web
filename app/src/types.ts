/* ================================================================
   types.ts — Strict TypeScript interfaces for the Leclerc memoir
   ================================================================ */

/** A milestone in Leclerc's career timeline */
export interface Milestone {
  readonly era: string;
  readonly title: string;
  readonly description: string;
  readonly primaryAsset: string;
  readonly secondaryAsset?: string;
}

/** Career statistics */
export interface Stats {
  readonly label: string;
  readonly value: number;
  readonly suffix?: string;
}

/** An image asset with metadata */
export interface Asset {
  readonly src: string;
  readonly alt: string;
  readonly caption?: string;
  readonly loading?: 'eager' | 'lazy';
}

/** Helmet gallery item */
export interface HelmetView {
  readonly src: string;
  readonly alt: string;
  readonly viewLabel: string;
}
