/* ================================================================
   CHARLES LECLERC — "Il Predestinato" Digital Experience
   script.js  ·  Animation & Interaction Engine
   ================================================================
   Stack: GSAP 3 + ScrollTrigger + SplitText  ·  Lenis
   ================================================================ */

document.addEventListener('DOMContentLoaded', () => {

  gsap.registerPlugin(ScrollTrigger);

  /* ═══════════════════════════════════════════════════════════════
     § 1  LENIS — Smooth Scrolling
     ═══════════════════════════════════════════════════════════════ */
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 2,
  });

  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  /* ═══════════════════════════════════════════════════════════════
     § 2  CUSTOM CURSOR — Race Pulse
     ═══════════════════════════════════════════════════════════════ */
  const cursor = document.querySelector('.cursor');

  if (cursor && window.matchMedia('(pointer: fine)').matches) {
    const dot   = cursor.querySelector('.cursor__dot');
    const label = cursor.querySelector('.cursor__label');
    let mx = 0, my = 0;

    document.addEventListener('mousemove', (e) => {
      mx = e.clientX;
      my = e.clientY;
    });

    gsap.ticker.add(() => {
      gsap.to(cursor, {
        x: mx,
        y: my,
        duration: 0.5,
        ease: 'power3.out',
      });
    });

    // Hover targets
    const interactives = document.querySelectorAll(
      'a, button, .helmet-card, .timeline__card-img-wrap, .personal__tag, .monaco__play-btn, .hgallery__slide'
    );

    interactives.forEach((el) => {
      const cursorText = el.dataset.cursor || '16';
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('is-hovering');
        label.textContent = cursorText;
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('is-hovering');
      });
    });
  } else if (cursor) {
    cursor.style.display = 'none';
  }

  /* ═══════════════════════════════════════════════════════════════
     § 3  NAVIGATION — Scroll-aware blur
     ═══════════════════════════════════════════════════════════════ */
  const nav = document.querySelector('.nav');
  if (nav) {
    ScrollTrigger.create({
      start: 80,
      onUpdate: (self) => {
        nav.classList.toggle('is-scrolled', self.scroll() > 80);
      },
    });
  }

  /* ═══════════════════════════════════════════════════════════════
     § 4  PRELOADER
     ═══════════════════════════════════════════════════════════════ */
  const preloader = document.querySelector('.preloader');

  if (preloader) {
    const counter = { val: 0 };
    const numEl   = preloader.querySelector('.preloader__counter');
    const fillEl  = preloader.querySelector('.preloader__fill');

    const tl = gsap.timeline({
      onComplete() {
        preloader.style.display = 'none';
        document.body.style.overflow = '';
        initAllAnimations();
      },
    });

    document.body.style.overflow = 'hidden';

    tl.to(counter, {
      val: 100,
      duration: 2,
      ease: 'power2.inOut',
      onUpdate() { numEl.textContent = Math.round(counter.val); },
    })
    .to(fillEl, { scaleX: 1, duration: 2, ease: 'power2.inOut' }, 0)
    .to(preloader, {
      clipPath: 'inset(0 0 100% 0)',
      duration: 0.9,
      ease: 'power4.inOut',
      delay: 0.3,
    });
  } else {
    initAllAnimations();
  }

  /* ═══════════════════════════════════════════════════════════════
     § 5  MASTER INIT
     ═══════════════════════════════════════════════════════════════ */
  function initAllAnimations() {
    heroAnim();
    timelineAnim();
    monacoAnim();
    statsAnim();
    splitRevealAnim();
    personalAnim();
    pianoVisualizer();
    helmetsAnim();
    hGalleryAnim();
    footerAnim();
  }

  /* ───────────────────────────────────────────────────────────────
     5a  HERO — Character reveal + parallax
     ─────────────────────────────────────────────────────────────── */
  function heroAnim() {
    const heroTitle = document.querySelector('.hero__title');
    if (!heroTitle) return;

    // Manual character splitting (no SplitText plugin needed)
    const text = heroTitle.textContent.trim();
    heroTitle.innerHTML = '';
    const lines = text.split('\n').length > 1 ? text.split('\n') : [text];

    // For our layout we have the text in spans already — let's use the char spans
    const chars = document.querySelectorAll('.hero__title .char');
    const overSpan = document.querySelector('.hero__overtitle span');

    const tl = gsap.timeline({
      defaults: { ease: 'power4.out' },
      delay: 0.1,
    });

    // Background parallax fade-in
    tl.to('.hero__bg img', {
      opacity: 0.85,
      scale: 1,
      duration: 1.8,
      ease: 'power2.out',
    }, 0);

    // Overtitle
    if (overSpan) {
      tl.to(overSpan, { y: 0, duration: 1, ease: 'power3.out' }, 0.2);
    }

    // Character stagger from Y:100
    if (chars.length) {
      tl.to(chars, {
        y: 0,
        opacity: 1,
        duration: 1.2,
        stagger: 0.035,
      }, 0.3);
    }

    // Subtitle
    tl.to('.hero__subtitle', {
      opacity: 1,
      y: 0,
      duration: 1,
    }, 0.8);

    // Number watermark
    tl.from('.hero__number', {
      opacity: 0,
      x: 80,
      duration: 1.4,
      ease: 'power3.out',
    }, 0.5);

    // Scroll indicator
    tl.from('.hero__scroll', {
      opacity: 0,
      y: 20,
      duration: 0.8,
    }, 1);

    // Hero bg parallax on scroll
    gsap.to('.hero__bg img', {
      yPercent: 25,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    });
  }

  /* ───────────────────────────────────────────────────────────────
     5b  TIMELINE — Horizontal scroll
     ─────────────────────────────────────────────────────────────── */
  function timelineAnim() {
    const wrapper = document.querySelector('.timeline__wrapper');
    const track   = document.querySelector('.timeline__track');
    if (!wrapper || !track) return;

    const getDistance = () => track.scrollWidth - wrapper.clientWidth;

    const tweenTL = gsap.to(track, {
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
          const fill = document.querySelector('.timeline__progress-fill');
          if (fill) fill.style.width = `${self.progress * 100}%`;
        },
      },
    });

    // Staggered body reveal per card
    document.querySelectorAll('.timeline__card').forEach((card) => {
      const body = card.querySelector('.timeline__card-body');
      if (!body) return;
      gsap.from(body, {
        opacity: 0,
        x: 100,
        scrollTrigger: {
          trigger: card,
          containerAnimation: tweenTL,
          start: 'left 75%',
          end: 'left 35%',
          scrub: true,
        },
      });
    });
  }

  /* ───────────────────────────────────────────────────────────────
     5c  MONACO — Background shift + reveal
     ─────────────────────────────────────────────────────────────── */
  function monacoAnim() {
    const section = document.querySelector('.monaco');
    if (!section) return;

    // Background shift to Monaco Blue
    ScrollTrigger.create({
      trigger: section,
      start: 'top 60%',
      end: 'bottom 40%',
      onEnter:     () => section.classList.add('is-blue'),
      onLeave:     () => section.classList.remove('is-blue'),
      onEnterBack: () => section.classList.add('is-blue'),
      onLeaveBack: () => section.classList.remove('is-blue'),
    });

    // Chapters activate
    const chapters = section.querySelectorAll('.monaco__chapter');
    chapters.forEach((ch, i) => {
      ScrollTrigger.create({
        trigger: ch,
        start: 'top 65%',
        end: 'bottom 35%',
        onEnter:     () => ch.classList.add('active'),
        onLeave:     () => ch.classList.remove('active'),
        onEnterBack: () => ch.classList.add('active'),
        onLeaveBack: () => ch.classList.remove('active'),
      });

      gsap.from(ch, {
        opacity: 0,
        y: 40,
        scrollTrigger: {
          trigger: ch,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
        duration: 0.9,
        delay: i * 0.15,
        ease: 'power3.out',
      });
    });

    // Media stagger
    gsap.from('.monaco__media > *', {
      scrollTrigger: {
        trigger: '.monaco__media',
        start: 'top 75%',
        toggleActions: 'play none none reverse',
      },
      opacity: 0,
      y: 50,
      stagger: 0.2,
      duration: 1,
      ease: 'power3.out',
    });
  }

  /* ───────────────────────────────────────────────────────────────
     5d  STATS — Count-up scrubbed to scroll
     ─────────────────────────────────────────────────────────────── */
  function statsAnim() {
    const counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    // Header portrait reveal
    const portrait = document.querySelector('.stats__portrait');
    if (portrait) {
      gsap.from(portrait, {
        scrollTrigger: {
          trigger: portrait,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
        opacity: 0,
        scale: 0.95,
        duration: 1.2,
        ease: 'power3.out',
      });
    }

    // Scrub-linked counting
    counters.forEach((el) => {
      const target = +el.dataset.count;
      const obj    = { val: 0 };

      gsap.to(obj, {
        val: target,
        ease: 'power1.out',
        scrollTrigger: {
          trigger: el.closest('.stat'),
          start: 'top 85%',
          end: 'top 30%',
          scrub: 1,
        },
        onUpdate() { el.textContent = Math.round(obj.val); },
      });
    });

    // Stat card stagger
    gsap.from('.stat', {
      scrollTrigger: {
        trigger: '.stats__grid',
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      },
      opacity: 0,
      y: 30,
      stagger: 0.1,
      duration: 0.8,
      ease: 'power3.out',
    });
  }

  /* ───────────────────────────────────────────────────────────────
     5e  SPLIT REVEAL — Hamilton vs Leclerc
     ─────────────────────────────────────────────────────────────── */
  function splitRevealAnim() {
    const section = document.querySelector('.split-reveal');
    if (!section) return;

    const center     = section.querySelector('.split-reveal__center');
    const leftSide   = section.querySelector('.split-reveal__side--left');
    const rightSide  = section.querySelector('.split-reveal__side--right');
    const centerLabel = section.querySelector('.split-reveal__center-label');

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: '+=150%',
        pin: true,
        scrub: 1.5,
      },
    });

    // Sides push apart while center reveals the SF26
    tl.to(leftSide, {
      clipPath: 'inset(0 100% 0 0)',
      duration: 1,
      ease: 'none',
    }, 0)
    .to(rightSide, {
      clipPath: 'inset(0 0 0 100%)',
      duration: 1,
      ease: 'none',
    }, 0)
    .to(center, {
      width: '100%',
      duration: 1,
      ease: 'none',
    }, 0)
    .to(centerLabel, {
      opacity: 1,
      duration: 0.4,
    }, 0.7);
  }

  /* ───────────────────────────────────────────────────────────────
     5f  PERSONAL — Image reveal + content
     ─────────────────────────────────────────────────────────────── */
  function personalAnim() {
    const imgWrap = document.querySelector('.personal__image-wrap');
    if (imgWrap) {
      ScrollTrigger.create({
        trigger: imgWrap,
        start: 'top 75%',
        once: true,
        onEnter: () => imgWrap.classList.add('is-revealed'),
      });
    }

    gsap.from('.personal__content > *', {
      scrollTrigger: {
        trigger: '.personal__content',
        start: 'top 70%',
        toggleActions: 'play none none reverse',
      },
      opacity: 0,
      y: 30,
      stagger: 0.12,
      duration: 0.9,
      ease: 'power3.out',
    });
  }

  /* ───────────────────────────────────────────────────────────────
     5g  PIANO WAVEFORM VISUALIZER
     ─────────────────────────────────────────────────────────────── */
  function pianoVisualizer() {
    const canvas = document.querySelector('.piano-visualizer__canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animId;

    function resize() {
      canvas.width  = canvas.offsetWidth * (window.devicePixelRatio || 1);
      canvas.height = canvas.offsetHeight * (window.devicePixelRatio || 1);
      ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
    }
    resize();
    window.addEventListener('resize', resize);

    const barCount = 48;
    const bars = Array.from({ length: barCount }, () => Math.random() * 0.3 + 0.1);

    function draw(t) {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      const barW = w / barCount - 2;

      for (let i = 0; i < barCount; i++) {
        // Gentle sine wave animation
        const phase = (t * 0.001) + (i * 0.3);
        const amp = Math.sin(phase) * 0.25 + 0.35;
        bars[i] += (amp - bars[i]) * 0.05;

        const barH = bars[i] * h;
        const x = i * (barW + 2);
        const y = (h - barH) / 2;

        ctx.fillStyle = i % 4 === 0 ? '#E10600' : '#D0D0D0';
        ctx.fillRect(x, y, barW, barH);
      }

      animId = requestAnimationFrame(draw);
    }

    // Only animate when visible
    ScrollTrigger.create({
      trigger: canvas,
      start: 'top 90%',
      end: 'bottom 10%',
      onEnter:     () => { animId = requestAnimationFrame(draw); },
      onLeave:     () => cancelAnimationFrame(animId),
      onEnterBack: () => { animId = requestAnimationFrame(draw); },
      onLeaveBack: () => cancelAnimationFrame(animId),
    });
  }

  /* ───────────────────────────────────────────────────────────────
     5h  HELMETS — 3D Tilt Cards
     ─────────────────────────────────────────────────────────────── */
  function helmetsAnim() {
    const cards = document.querySelectorAll('.helmet-card');
    if (!cards.length) return;

    // 3D tilt on mouse move
    cards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const cx = rect.width / 2;
        const cy = rect.height / 2;

        const rotateX = ((y - cy) / cy) * -12;
        const rotateY = ((x - cx) / cx) * 12;

        gsap.to(card, {
          rotateX,
          rotateY,
          duration: 0.4,
          ease: 'power2.out',
          transformPerspective: 800,
        });
      });

      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          rotateX: 0,
          rotateY: 0,
          duration: 0.6,
          ease: 'power3.out',
        });
      });
    });

    // Staggered reveal
    gsap.from(cards, {
      scrollTrigger: {
        trigger: '.helmets__grid',
        start: 'top 78%',
        toggleActions: 'play none none reverse',
      },
      opacity: 0,
      y: 40,
      scale: 0.94,
      stagger: 0.1,
      duration: 0.9,
      ease: 'power3.out',
    });
  }

  /* ───────────────────────────────────────────────────────────────
     5i  HORIZONTAL GALLERY — Monaco + SF26 pin
     ─────────────────────────────────────────────────────────────── */
  function hGalleryAnim() {
    const wrapper = document.querySelector('.hgallery__wrapper');
    const track   = document.querySelector('.hgallery__track');
    if (!wrapper || !track) return;

    const getD = () => track.scrollWidth - wrapper.clientWidth;

    gsap.to(track, {
      x: () => -getD(),
      ease: 'none',
      scrollTrigger: {
        trigger: wrapper,
        start: 'top top',
        end: () => `+=${getD()}`,
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
      },
    });
  }

  /* ───────────────────────────────────────────────────────────────
     5j  FOOTER — Reveal
     ─────────────────────────────────────────────────────────────── */
  function footerAnim() {
    const footer = document.querySelector('.footer');
    if (!footer) return;

    gsap.from(footer.children, {
      scrollTrigger: {
        trigger: footer,
        start: 'top 92%',
        toggleActions: 'play none none reverse',
      },
      opacity: 0,
      y: 25,
      stagger: 0.12,
      duration: 0.8,
      ease: 'power3.out',
    });
  }

  /* ═══════════════════════════════════════════════════════════════
     § 6  YOUTUBE LAZY PLAY
     ═══════════════════════════════════════════════════════════════ */
  const playBtn = document.querySelector('.monaco__play-btn');
  if (playBtn) {
    playBtn.addEventListener('click', () => {
      const thumb  = document.querySelector('.monaco__video-thumb');
      const iframe = document.querySelector('.monaco__video iframe');
      if (thumb) thumb.classList.add('is-hidden');
      if (iframe) {
        // Autoplay after click
        iframe.src = iframe.dataset.src + '&autoplay=1';
      }
    });
  }

}); // end DOMContentLoaded
