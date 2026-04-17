/* ================================================================
   main.ts — Application entry point
   ================================================================
   Orchestrates: Lenis → Preloader → Renderers → Animations
   ================================================================ */

import './style.css';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

import { STATS, HELMETS } from './data';
import { renderStats, renderHelmets } from './renderers';
import { initMagneticRing } from './cursor';
import { initPianoVisualizer } from './piano';
import {
  initGlobalReveals,
  initHero,
  initTimeline,
  initMonaco,
  initStats,
  initSF26,
  initPersonal,
  initHelmetTilt,
  initImageColourTransitions,
  initPromise,
  initRadio,
} from './animations';

gsap.registerPlugin(ScrollTrigger);

/* ═══════════════════════════════════════════════════════════════
   § 1  Lenis — Smooth momentum scrolling
   ═══════════════════════════════════════════════════════════════ */
const lenis = new Lenis({
  duration: 1.2,
  easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
  touchMultiplier: 2,
});

lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time: number) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

/* ═══════════════════════════════════════════════════════════════
   § 2  DOM-dependent renders (before animation)
   ═══════════════════════════════════════════════════════════════ */
const statsGrid = document.getElementById('stats-grid');
const helmetsGrid = document.getElementById('helmets-grid');

if (statsGrid) renderStats(statsGrid, STATS);
if (helmetsGrid) renderHelmets(helmetsGrid, HELMETS);

/* ═══════════════════════════════════════════════════════════════
   § 3  Navigation scroll-aware blur
   ═══════════════════════════════════════════════════════════════ */
const nav = document.getElementById('nav');
if (nav) {
  ScrollTrigger.create({
    start: 80,
    onUpdate(self) {
      nav.classList.toggle('is-scrolled', self.scroll() > 80);
    },
  });
}

/* ═══════════════════════════════════════════════════════════════
   § 4  YouTube lazy play
   ═══════════════════════════════════════════════════════════════ */
const playBtn = document.getElementById('play-btn');
if (playBtn) {
  playBtn.addEventListener('click', () => {
    const thumb = document.getElementById('video-thumb');
    const iframe = document.getElementById('yt-iframe') as HTMLIFrameElement | null;
    if (thumb) thumb.style.display = 'none';
    if (iframe?.dataset.src) {
      iframe.src = `${iframe.dataset.src}&autoplay=1`;
    }
  });
}

/* ═══════════════════════════════════════════════════════════════
   § 5  Preloader → Init all
   ═══════════════════════════════════════════════════════════════ */
function initAll(): void {
  initMagneticRing();
  initHero();
  initPromise();
  initGlobalReveals();
  initTimeline();
  initMonaco();
  initStats();
  initSF26();
  initPersonal();
  initPianoVisualizer();
  initHelmetTilt();
  initImageColourTransitions();
  initRadio();
}

const preloader = document.getElementById('preloader');

if (preloader) {
  // Staggered entrance
  const badge = preloader.querySelector('.preloader__badge');

  const tl = gsap.timeline({
    onComplete() {
      preloader.style.display = 'none';
      initAll();
    },
  });

  // Fade in badge
  if (badge) {
    tl.from(badge, { opacity: 0, scale: 0.92, duration: 0.8, ease: 'power3.out' }, 0);
  }

  // Hold, then scale-up & fade out
  tl.to(preloader, {
    opacity: 0,
    scale: 1.05,
    duration: 0.7,
    ease: 'power3.in',
    delay: 1.6,
  });
} else {
  initAll();
}
