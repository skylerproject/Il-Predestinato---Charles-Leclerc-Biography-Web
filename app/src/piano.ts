/* ================================================================
   piano.ts — Canvas waveform visualizer for the personal section
   ================================================================ */

import { ScrollTrigger } from 'gsap/ScrollTrigger';

const BAR_COUNT = 48;
const ACCENT = '#E10600';
const NEUTRAL = '#D4D4D4';

export function initPianoVisualizer(): void {
  const canvas = document.getElementById('piano-canvas') as HTMLCanvasElement | null;
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const dpr = window.devicePixelRatio || 1;
  const bars = Array.from({ length: BAR_COUNT }, () => Math.random() * 0.3 + 0.1);
  let frameId = 0;

  function resize(): void {
    canvas!.width = canvas!.offsetWidth * dpr;
    canvas!.height = canvas!.offsetHeight * dpr;
    ctx!.scale(dpr, dpr);
  }

  resize();
  window.addEventListener('resize', resize);

  function draw(t: number): void {
    const w = canvas!.offsetWidth;
    const h = canvas!.offsetHeight;
    ctx!.clearRect(0, 0, w, h);

    const barW = w / BAR_COUNT - 2;

    for (let i = 0; i < BAR_COUNT; i++) {
      const phase = t * 0.001 + i * 0.3;
      const amp = Math.sin(phase) * 0.25 + 0.35;
      bars[i] += (amp - bars[i]) * 0.05;

      const barH = bars[i] * h;
      const x = i * (barW + 2);
      const y = (h - barH) / 2;

      ctx!.fillStyle = i % 4 === 0 ? ACCENT : NEUTRAL;
      ctx!.fillRect(x, y, barW, barH);
    }

    frameId = requestAnimationFrame(draw);
  }

  // Only animate when in viewport
  ScrollTrigger.create({
    trigger: canvas,
    start: 'top 90%',
    end: 'bottom 10%',
    onEnter: () => { frameId = requestAnimationFrame(draw); },
    onLeave: () => cancelAnimationFrame(frameId),
    onEnterBack: () => { frameId = requestAnimationFrame(draw); },
    onLeaveBack: () => cancelAnimationFrame(frameId),
  });
}
