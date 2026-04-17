/* ================================================================
   animations.ts — GSAP + ScrollTrigger animation engine
   ================================================================
   Rule: "Flawless Scroll" — NO scroll-jacking. All reveals use
   start: "top 85%", y: 30, opacity: 0→1. Smooth and editorial.
   ================================================================ */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ── Shared reveal defaults ───────────────────────────────────── */
const REVEAL_DEFAULTS = {
  y: 30,
  opacity: 0,
  duration: 0.9,
  ease: 'power3.out',
} as const;

const REVEAL_TRIGGER = {
  start: 'top 85%',
  toggleActions: 'play none none reverse' as const,
};

/* ═══════════════════════════════════════════════════════════════
   Global data-reveal Elements
   ═══════════════════════════════════════════════════════════════ */
export function initGlobalReveals(): void {
  const els = document.querySelectorAll<HTMLElement>('[data-reveal]');
  els.forEach((el) => {
    gsap.from(el, {
      ...REVEAL_DEFAULTS,
      scrollTrigger: { trigger: el, ...REVEAL_TRIGGER },
    });
  });
}

/* ═══════════════════════════════════════════════════════════════
   Hero Entrance
   ═══════════════════════════════════════════════════════════════ */
export function initHero(): void {
  const title = document.getElementById('hero-title');
  if (!title) return;

  // Split each character into a span for stagger
  const text = title.textContent ?? '';
  title.innerHTML = text
    .split('')
    .map((c) => `<span class="hero__char">${c}</span>`)
    .join('');

  const chars = title.querySelectorAll<HTMLElement>('.hero__char');

  const tl = gsap.timeline({ defaults: { ease: 'power4.out' }, delay: 0.1 });

  // Background image scale + opacity
  tl.to('.hero__bg img', {
    opacity: 0.85,
    scale: 1,
    duration: 1.6,
    ease: 'power2.out',
  }, 0);

  // Overtitle
  tl.to('.hero__overtitle span', { y: 0, duration: 0.9 }, 0.15);

  // Character staggered reveal from Y:100
  tl.fromTo(
    chars,
    { y: 100, opacity: 0 },
    { y: 0, opacity: 1, duration: 1.1, stagger: 0.04 },
    0.2
  );

  // Subtitle
  tl.to('.hero__subtitle', { opacity: 1, y: 0, duration: 0.9 }, 0.7);

  // Number ghost
  tl.from('.hero__number', { opacity: 0, x: 60, duration: 1.2 }, 0.5);

  // Scroll indicator
  tl.from('.hero__scroll', { opacity: 0, y: 15, duration: 0.7 }, 0.9);

  // Parallax on scroll
  gsap.to('.hero__bg img', {
    yPercent: 20,
    ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
  });
}

/* ═══════════════════════════════════════════════════════════════
   Horizontal Timeline
   ═══════════════════════════════════════════════════════════════ */
export function initTimeline(): void {
  const wrapper = document.getElementById('timeline-wrapper');
  const track = document.getElementById('timeline-track');
  if (!wrapper || !track) return;

  const getDistance = (): number => track.scrollWidth - wrapper.clientWidth;

  const tween = gsap.to(track, {
    x: () => -getDistance(),
    ease: 'none',
    scrollTrigger: {
      trigger: wrapper,
      start: 'top top',
      end: () => `+=${getDistance()}`,
      pin: true,
      scrub: 1.5,
      invalidateOnRefresh: true,
      onUpdate(self) {
        const fill = document.getElementById('timeline-fill');
        if (fill) fill.style.width = `${self.progress * 100}%`;
      },
    },
  });

  // Card body content reveal per card
  document.querySelectorAll<HTMLElement>('.tl-card').forEach((card) => {
    const body = card.querySelector('.tl-card__body');
    if (!body) return;
    gsap.from(body, {
      opacity: 0,
      x: 80,
      scrollTrigger: {
        trigger: card,
        containerAnimation: tween,
        start: 'left 75%',
        end: 'left 35%',
        scrub: true,
      },
    });
  });
}

/* ═══════════════════════════════════════════════════════════════
   Monaco Section — Background colour shift
   ═══════════════════════════════════════════════════════════════ */
export function initMonaco(): void {
  const section = document.getElementById('monaco');
  if (!section) return;

  ScrollTrigger.create({
    trigger: section,
    start: 'top 60%',
    end: 'bottom 40%',
    onEnter: () => section.classList.add('is-blue'),
    onLeave: () => section.classList.remove('is-blue'),
    onEnterBack: () => section.classList.add('is-blue'),
    onLeaveBack: () => section.classList.remove('is-blue'),
  });
}

/* ═══════════════════════════════════════════════════════════════
   Stats — Scroll-scrubbed count-up
   ═══════════════════════════════════════════════════════════════ */
export function initStats(): void {
  document.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => {
    const target = parseInt(el.dataset.count ?? '0', 10);
    const obj = { val: 0 };

    gsap.to(obj, {
      val: target,
      ease: 'power1.out',
      scrollTrigger: {
        trigger: el.closest('.stat') ?? el,
        start: 'top 85%',
        end: 'top 35%',
        scrub: 1,
      },
      onUpdate() {
        el.textContent = String(Math.round(obj.val));
      },
    });
  });
}

/* ═══════════════════════════════════════════════════════════════
   SF26 Hero Parallax
   ═══════════════════════════════════════════════════════════════ */
export function initSF26(): void {
  const hero = document.querySelector('.sf26__hero');
  if (!hero) return;

  gsap.to('.sf26__hero-bg img', {
    yPercent: 15,
    ease: 'none',
    scrollTrigger: {
      trigger: hero,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
    },
  });
}

/* ═══════════════════════════════════════════════════════════════
   Personal Image Reveal (wipe)
   ═══════════════════════════════════════════════════════════════ */
export function initPersonal(): void {
  const imgWrap = document.querySelector<HTMLElement>('.personal__image-wrap');
  if (!imgWrap) return;

  ScrollTrigger.create({
    trigger: imgWrap,
    start: 'top 80%',
    once: true,
    onEnter: () => imgWrap.classList.add('is-revealed'),
  });
}

/* ═══════════════════════════════════════════════════════════════
   Helmet 3D Tilt
   ═══════════════════════════════════════════════════════════════ */
export function initHelmetTilt(): void {
  document.querySelectorAll<HTMLElement>('[data-tilt]').forEach((card) => {
    card.addEventListener('mousemove', (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rotateX = ((y - cy) / cy) * -10;
      const rotateY = ((x - cx) / cx) * 10;

      gsap.to(card, {
        rotateX,
        rotateY,
        duration: 0.35,
        ease: 'power2.out',
        transformPerspective: 800,
      });
    });

    card.addEventListener('mouseleave', () => {
      gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.5, ease: 'power3.out' });
    });
  });
}

/* ═══════════════════════════════════════════════════════════════
   Image grayscale → colour on scroll
   ═══════════════════════════════════════════════════════════════ */
export function initImageColourTransitions(): void {
  document
    .querySelectorAll<HTMLElement>('.tl-card__img img, .monaco__bento img, .sf26__card img')
    .forEach((img) => {
      gsap.fromTo(
        img,
        { filter: 'grayscale(1) contrast(1.1)' },
        {
          filter: 'grayscale(0) contrast(1)',
          scrollTrigger: {
            trigger: img,
            start: 'top 90%',
            end: 'top 40%',
            scrub: true,
          },
        }
      );
    });
}

/* ═══════════════════════════════════════════════════════════════
   The Promise — Word-by-word text reveal on scroll
   ═══════════════════════════════════════════════════════════════ */
export function initPromise(): void {
  const textEl = document.querySelector<HTMLElement>('.promise__text');
  if (!textEl) return;

  // Wrap each word in a span
  const rawText = textEl.textContent ?? '';
  textEl.innerHTML = rawText
    .split(/\s+/)
    .filter((w) => w.length > 0)
    .map((word) => `<span class="word">${word}</span>`)
    .join(' ');

  const words = textEl.querySelectorAll<HTMLElement>('.word');

  // Reveal words progressively as user scrolls through the section
  ScrollTrigger.create({
    trigger: textEl,
    start: 'top 80%',
    end: 'bottom 40%',
    scrub: true,
    onUpdate(self) {
      const progress = self.progress;
      const totalWords = words.length;
      const visibleCount = Math.ceil(progress * totalWords);

      words.forEach((w, i) => {
        if (i < visibleCount) {
          w.classList.add('is-visible');
        } else {
          w.classList.remove('is-visible');
        }
      });
    },
  });
}

/* ═══════════════════════════════════════════════════════════════
   Radio Ga Ga — Interactive card pulse animation
   ═══════════════════════════════════════════════════════════════ */
export function initRadio(): void {
  document.querySelectorAll<HTMLElement>('.radio-card').forEach((card) => {
    card.addEventListener('click', () => {
      // Pulse the wave SVG
      const wave = card.querySelector<HTMLElement>('.radio-card__wave svg');
      if (wave) {
        gsap.fromTo(
          wave,
          { scaleY: 1 },
          {
            scaleY: 1.8,
            duration: 0.15,
            ease: 'power2.out',
            yoyo: true,
            repeat: 3,
            onComplete: () => gsap.set(wave, { scaleY: 1 }),
          }
        );
      }

      // Flash the quote text red briefly
      const quote = card.querySelector<HTMLElement>('.radio-card__quote');
      if (quote) {
        gsap.fromTo(quote, { color: '#E10600' }, { color: '#0A0A0A', duration: 0.8, ease: 'power2.out' });
      }

      // Subtle card shake
      gsap.fromTo(card, { x: -2 }, { x: 0, duration: 0.4, ease: 'elastic.out(1, 0.3)' });
    });
  });
}
