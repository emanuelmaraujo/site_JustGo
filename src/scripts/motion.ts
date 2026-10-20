/**
 * Just Go Market — coreografias com scroll (GSAP + ScrollTrigger + Lenis).
 * Carregado sob demanda por site.ts (requestIdleCallback), apenas com .motion.
 *
 * Princípios: significado antes de efeito; calma é luxo (sem bounce/elastic);
 * uma coreografia por viewport; só transform, opacity e clip-path.
 *
 * A divisão de texto (palavras) é feita no servidor e os traços se desenham
 * com CSS, então não há SplitText nem DrawSVG aqui — menos JS.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

const DESKTOP = '(min-width: 1024px)';
const FINE = '(hover: hover) and (pointer: fine)';

let lenis: Lenis | null = null;

/* ---------------- Lenis: smooth scroll só no desktop ---------------- */
function initLenis() {
  if (!window.matchMedia(`${DESKTOP} and ${FINE}`).matches) return;
  lenis = new Lenis({
    lerp: 0.1,
    wheelMultiplier: 0.9,
    anchors: { offset: -96 },
    prevent: (node: HTMLElement) => !!node.closest('dialog, .hg-track'),
  });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis?.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);

  const html = document.documentElement;
  if (html.classList.contains('intro-on')) lenis.stop();
  window.addEventListener('jg:intro-end', () => lenis?.start());
  window.addEventListener('jg:lock', () => lenis?.stop());
  window.addEventListener('jg:unlock', () => lenis?.start());
}

/* ---------------- media-expand: cartão → tela cheia ---------------- */
function mediaExpand() {
  document.querySelectorAll<HTMLElement>('[data-media-expand]').forEach((el) => {
    const g = parseFloat(getComputedStyle(el).getPropertyValue('--gutter')) || 24;
    const gutter = Math.min(g, window.innerWidth * 0.06);
    gsap.fromTo(
      el,
      { clipPath: `inset(0px ${gutter}px 0px ${gutter}px round 32px)` },
      {
        clipPath: 'inset(0px 0px 0px 0px round 0px)',
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top 88%', end: 'top 12%', scrub: true },
      },
    );
  });

  // Hero da home: o cartão cresce de inset(12% round 32px) até a tela cheia
  document.querySelectorAll<HTMLElement>('[data-hero-media]').forEach((el) => {
    gsap.fromTo(
      el,
      { clipPath: 'inset(0% 7% 0% 7% round 32px)' },
      {
        clipPath: 'inset(0% 0% 0% 0% round 0px)',
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top 80%', end: 'top top', scrub: true },
      },
    );
    const img = el.querySelector('.photo-img');
    if (img) {
      gsap.fromTo(
        img,
        { scale: 1.12 },
        { scale: 1, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } },
      );
    }
  });
}

/* ---------------- parallax ---------------- */
function parallax(mm: gsap.MatchMedia) {
  // Elementos com data-parallax-y="-15" (título do hero, símbolo do CTA final)
  document.querySelectorAll<HTMLElement>('[data-parallax-y]').forEach((el) => {
    const amount = Number(el.dataset.parallaxY) || -15;
    const trigger = el.closest('section') ?? el;
    gsap.fromTo(
      el,
      { yPercent: 0 },
      {
        yPercent: amount,
        ease: 'none',
        scrollTrigger: { trigger, start: el.closest('[data-cta-final]') ? 'top bottom' : 'top top', end: 'bottom top', scrub: true },
      },
    );
  });

  // Foto dentro da moldura (a foto se move mais devagar que a moldura)
  mm.add('(min-width: 768px)', () => {
    document.querySelectorAll<HTMLElement>('[data-parallax]').forEach((fig) => {
      if (fig.closest('[data-hgallery]')) return; // a galeria cuida das suas
      const img = fig.querySelector('.photo-img');
      if (!img) return;
      gsap.fromTo(
        img,
        { yPercent: -6 },
        { yPercent: 6, ease: 'none', scrollTrigger: { trigger: fig, start: 'top bottom', end: 'bottom top', scrub: true } },
      );
    });
  });
}

/* ---------------- word-light: o manifesto acende com a leitura ---------------- */
function wordLight(mm: gsap.MatchMedia) {
  document.querySelectorAll<HTMLElement>('[data-word-light]').forEach((el) => {
    const words = el.querySelectorAll('.wl-w');
    const section = el.closest('section') ?? el;
    mm.add(DESKTOP, () => {
      gsap.fromTo(
        words,
        { opacity: 0.18 },
        {
          opacity: 1,
          ease: 'none',
          stagger: 0.1,
          scrollTrigger: { trigger: section, start: 'top top', end: '+=100%', scrub: 0.6, pin: true },
        },
      );
    });
    mm.add('(max-width: 1023px)', () => {
      gsap.fromTo(
        words,
        { opacity: 0.18 },
        {
          opacity: 1,
          ease: 'none',
          stagger: 0.1,
          scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 45%', scrub: 0.6 },
        },
      );
    });
  });
}

/* ---------------- pin-horizontal: curadoria ---------------- */
function horizontalGallery(mm: gsap.MatchMedia) {
  mm.add(DESKTOP, () => {
    document.querySelectorAll<HTMLElement>('[data-hgallery]').forEach((wrap) => {
      const track = wrap.querySelector<HTMLElement>('.hg-track');
      if (!track) return;
      wrap.classList.add('is-pinned');
      const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);
      const tween = gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: wrap,
          start: 'center center',
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });

      wrap.querySelectorAll<HTMLElement>('.hg-panel').forEach((panel) => {
        const img = panel.querySelector('.photo-img');
        if (!img) return;
        gsap.fromTo(
          img,
          { xPercent: -6, scale: 1.14 },
          {
            xPercent: 6,
            scale: 1.14,
            ease: 'none',
            scrollTrigger: {
              trigger: panel,
              containerAnimation: tween,
              start: 'left right',
              end: 'right left',
              scrub: true,
            },
          },
        );
      });

      return () => wrap.classList.remove('is-pinned');
    });
  });
}

/* ---------------- curtain: o CTA final sobe sobre a seção anterior ---------------- */
function curtain() {
  document.querySelectorAll<HTMLElement>('[data-curtain]').forEach((el) => {
    const prev = el.previousElementSibling as HTMLElement | null;
    if (!prev) return;
    ScrollTrigger.create({
      trigger: prev,
      start: () => (prev.offsetHeight > window.innerHeight ? 'bottom bottom' : 'top top'),
      end: () => `+=${Math.min(el.offsetHeight, window.innerHeight)}`,
      pin: true,
      pinSpacing: false,
      invalidateOnRefresh: true,
    });
    const inner = prev.firstElementChild;
    if (inner) {
      gsap.to(inner, {
        opacity: 0.35,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top bottom', end: 'top top', scrub: true },
      });
    }
  });
}

/* ---------------- magnetic: CTA primário (só ponteiro fino) ---------------- */
function magnetic(mm: gsap.MatchMedia) {
  mm.add(FINE, () => {
    const items = Array.from(document.querySelectorAll<HTMLElement>('[data-magnetic]')).map((el) => ({
      el,
      x: gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3.out' }),
      y: gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3.out' }),
    }));
    if (!items.length) return;
    const RADIUS = 80;
    const MAX = 6;
    const onMove = (e: PointerEvent) => {
      items.forEach(({ el, x, y }) => {
        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const reach = Math.max(r.width, r.height) / 2 + RADIUS;
        const dist = Math.hypot(dx, dy);
        if (dist < reach) {
          const f = 1 - dist / reach;
          x((dx / reach) * MAX * 2 * f);
          y((dy / reach) * MAX * 2 * f);
        } else {
          x(0);
          y(0);
        }
      });
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  });
}

export function initMotion() {
  document.documentElement.classList.add('motion-ready');
  initLenis();
  const mm = gsap.matchMedia();
  mediaExpand();
  parallax(mm);
  wordLight(mm);
  horizontalGallery(mm);
  curtain();
  magnetic(mm);

  // Pins dependem da ordem na página; recalcula após fontes e imagens
  ScrollTrigger.sort();
  ScrollTrigger.refresh();
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
  window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
}
