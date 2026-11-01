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
        // termina em 1.04 para sobrar margem ao paralaxe do ponteiro (heroPointer)
        { scale: 1.04, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } },
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
// 0.46 mantém contraste ≥ 3:1 (texto grande, WCAG AA) mesmo no estado "apagado"
const WORD_DIM = 0.46;
function wordLight(mm: gsap.MatchMedia) {
  document.querySelectorAll<HTMLElement>('[data-word-light]').forEach((el) => {
    const words = el.querySelectorAll('.wl-w');
    const section = el.closest('section') ?? el;
    mm.add(DESKTOP, () => {
      gsap.fromTo(
        words,
        { opacity: WORD_DIM },
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
        { opacity: WORD_DIM },
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

/* ---------------- store-tour: o scroll anda pela loja ---------------- */
// Fachada aproxima → interior abre do centro (como uma porta) → balcão entra pela direita
// (como quem vira o olhar). Palco fixo; scrub suave com snap nas três paradas.
// Só transform/opacity (compositor): dissolução com zooms opostos entre fachada e interior e
// cortina com contra-translação para o balcão — nada de clip-path em camada de tela cheia.
function storeTour(mm: gsap.MatchMedia) {
  mm.add(`${DESKTOP} and (min-height: 600px)`, () => {
    const tours = Array.from(document.querySelectorAll<HTMLElement>('[data-tour]'));
    const cleanups: (() => void)[] = [];
    tours.forEach((tour) => {
      const frames = Array.from(tour.querySelectorAll<HTMLElement>('.tour-frame'));
      if (frames.length < 3) return;
      tour.classList.add('is-pinned');
      const stage = tour.querySelector<HTMLElement>('.tour-stage')!;
      const img = (f: HTMLElement) => f.querySelector('.photo-img');
      const media = (f: HTMLElement) => f.querySelector('.tour-media');
      const copy = (f: HTMLElement) => f.querySelector('.tour-copy');
      const ticks = Array.from(tour.querySelectorAll<HTMLElement>('[data-tick]'));
      const setActive = (i: number) => {
        ticks.forEach((t, k) => t.classList.toggle('is-active', k === i));
        frames.forEach((f, k) => {
          f.toggleAttribute('inert', k !== i);
          f.setAttribute('aria-hidden', String(k !== i));
        });
        tour.classList.toggle('is-live', i === 1);
      };
      setActive(0);

      // Porta de vidro da loja no render da fachada (≈ centro da vitrine)
      const DOOR = '68% 58%';
      gsap.set([img(frames[0]), img(frames[1])], { transformOrigin: DOOR });
      gsap.set(frames[1], { autoAlpha: 0 });
      gsap.set(frames[2], { xPercent: 100 });
      gsap.set(media(frames[2]), { xPercent: -100 });
      gsap.set([copy(frames[1]), copy(frames[2])], { autoAlpha: 0, y: 30 });

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: stage,
          start: 'top top',
          end: '+=280%',
          pin: true,
          scrub: 0.9,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          snap: { snapTo: [0, 0.5, 1], duration: { min: 0.25, max: 0.7 }, ease: 'power2.inOut', delay: 0.05 },
          onUpdate: (st) => setActive(st.progress < 0.4 ? 0 : st.progress < 0.8 ? 1 : 2),
        },
      });

      // 0 → 1 (tempo 0–1): a fachada fica sozinha; a câmera caminha até a porta e, sem cortes
      // nem molduras, o interior se dissolve por cima em tela cheia — vindo de um zoom maior
      // e recuando — como quem atravessa a porta.
      tl.fromTo(img(frames[0]), { scale: 1.04 }, { scale: 2.4, duration: 0.95, ease: 'power1.in' }, 0.05)
        .to(copy(frames[0]), { autoAlpha: 0, y: -24, duration: 0.25 }, 0.1)
        .to(frames[0], { autoAlpha: 0.45, duration: 0.4, ease: 'sine.inOut' }, 0.42)
        .to(frames[1], { autoAlpha: 1, duration: 0.5, ease: 'sine.inOut' }, 0.4)
        .fromTo(img(frames[1]), { scale: 1.75 }, { scale: 1.04, duration: 0.62, ease: 'power2.out' }, 0.4)
        .to(copy(frames[1]), { autoAlpha: 1, y: 0, duration: 0.15 }, 0.85)
        // 1 → 2 (tempo 1.1–2): o olhar vira para o balcão
        .to(img(frames[1]), { xPercent: -6, duration: 0.9 }, 1.1)
        .to(copy(frames[1]), { autoAlpha: 0, y: -24, duration: 0.2 }, 1.2)
        .to(frames[2], { xPercent: 0, duration: 0.6, ease: 'power2.inOut' }, 1.25)
        .to(media(frames[2]), { xPercent: 0, duration: 0.6, ease: 'power2.inOut' }, 1.25)
        .fromTo(img(frames[2]), { scale: 1.12 }, { scale: 1.02, duration: 0.7 }, 1.25)
        .to(copy(frames[2]), { autoAlpha: 1, y: 0, duration: 0.15 }, 1.78)
        .to({}, { duration: 0.07 }, 1.93);

      cleanups.push(() => {
        tour.classList.remove('is-pinned', 'is-live');
        frames.forEach((f) => {
          f.removeAttribute('inert');
          f.removeAttribute('aria-hidden');
        });
        gsap.set([...frames, ...frames.map(img), ...frames.map(media), ...frames.map(copy)], { clearProps: 'all' });
      });
    });
    return () => cleanups.forEach((c) => c());
  });

  // Sem palco fixo (celular/tablet): pulsos dos pontos só quando o interior está na tela
  mm.add(`not all and ${DESKTOP}`, () => {
    const triggers = Array.from(document.querySelectorAll<HTMLElement>('[data-tour]')).map((tour) =>
      ScrollTrigger.create({
        trigger: tour.querySelector('.tour-frame[data-frame="1"]') ?? tour,
        start: 'top 80%',
        end: 'bottom 20%',
        toggleClass: { targets: tour, className: 'is-live' },
      }),
    );
    return () => triggers.forEach((t) => t.kill());
  });
}

/* ---------------- hero: a imagem acompanha o ponteiro (bem de leve) ---------------- */
function heroPointer(mm: gsap.MatchMedia) {
  mm.add(`${DESKTOP} and ${FINE}`, () => {
    const media = document.querySelector<HTMLElement>('[data-hero-media]');
    const photo = media?.querySelector<HTMLElement>('.photo-img');
    if (!media || !photo) return;
    const x = gsap.quickTo(photo, 'x', { duration: 1.2, ease: 'power3.out' });
    const y = gsap.quickTo(photo, 'y', { duration: 1.2, ease: 'power3.out' });
    const onMove = (e: PointerEvent) => {
      const r = media.getBoundingClientRect();
      if (r.bottom < 0 || r.top > window.innerHeight) return;
      x(((e.clientX / window.innerWidth) - 0.5) * -16);
      y(((e.clientY / window.innerHeight) - 0.5) * -10);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      gsap.set(photo, { clearProps: 'transform' });
    };
  });
}

/* ---------------- tilt: profundidade 3D nos cartões (só ponteiro fino) ---------------- */
function tilt(mm: gsap.MatchMedia) {
  mm.add(`${DESKTOP} and ${FINE}`, () => {
    const items = Array.from(document.querySelectorAll<HTMLElement>('[data-tilt]'));
    const offs = items.map((el) => {
      gsap.set(el, { transformPerspective: 900, transformOrigin: 'center' });
      const rx = gsap.quickTo(el, 'rotationX', { duration: 0.6, ease: 'power3.out' });
      const ry = gsap.quickTo(el, 'rotationY', { duration: 0.6, ease: 'power3.out' });
      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        ry(((e.clientX - r.left) / r.width - 0.5) * 7);
        rx(((e.clientY - r.top) / r.height - 0.5) * -7);
      };
      const leave = () => {
        rx(0);
        ry(0);
      };
      el.addEventListener('pointermove', move, { passive: true });
      el.addEventListener('pointerleave', leave);
      return () => {
        el.removeEventListener('pointermove', move);
        el.removeEventListener('pointerleave', leave);
        gsap.set(el, { clearProps: 'transform' });
      };
    });
    return () => offs.forEach((o) => o());
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
  storeTour(mm);
  heroPointer(mm);
  tilt(mm);

  // Pins dependem da ordem na página; recalcula após fontes e imagens
  ScrollTrigger.sort();
  ScrollTrigger.refresh();
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
  window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
}
