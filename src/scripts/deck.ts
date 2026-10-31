/**
 * Just Go Market — controlador da apresentação comercial (/apresentacao).
 *
 * · Navegação: botões, teclado (← → PageUp/PageDown Espaço Home End, F = tela cheia),
 *   gesto horizontal no toque e link direto para um slide (#5 ou #curadoria).
 * · Acessibilidade: slides inativos ficam `inert`; a troca é anunciada em aria-live.
 * · Motion: uma timeline GSAP por slide, sempre encerrada (progress(1) + kill)
 *   antes da próxima. gsap.matchMedia() liga/desliga tudo conforme "reduzir
 *   movimento". Os tweens só usam transform/opacity (e clip-path nas fotos) e
 *   limpam as propriedades ao terminar; sem JS ou sem movimento, tudo já está visível.
 * · Analytics (dataLayer/GTM): presentation_open, presentation_slide_view,
 *   presentation_complete, presentation_cta_click, presentation_whatsapp_click —
 *   cada slide é contado uma única vez por carregamento; nenhum dado pessoal.
 */

import { gsap } from 'gsap';

type Timeline = ReturnType<typeof gsap.timeline>;

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}

const root = document.documentElement;
const deck = document.querySelector<HTMLElement>('[data-deck]');

/** Propriedades que as coreografias tocam — limpas ao fim de cada tween. */
const CLEAR = 'opacity,visibility,transform,clipPath,strokeDasharray,strokeDashoffset';

function track(event: string, payload: Record<string, unknown> = {}) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...payload });
}

if (deck) initDeck(deck);

function initDeck(deck: HTMLElement) {
  const slidesEl = deck.querySelector<HTMLElement>('.deck-slides')!;
  const slides = Array.from(deck.querySelectorAll<HTMLElement>('.slide'));
  const total = slides.length;
  const $ = <T extends Element = HTMLElement>(sel: string) => deck.querySelector<T>(sel);
  const ui = {
    current: $('[data-deck-current]'),
    label: $('[data-deck-label]'),
    live: $('[data-deck-live]'),
    progress: $('[data-deck-progress]'),
    prev: $<HTMLButtonElement>('[data-deck-prev]'),
    next: $<HTMLButtonElement>('[data-deck-next]'),
    fullscreen: $<HTMLButtonElement>('[data-deck-fullscreen]'),
  };

  const pad = (n: number) => String(n).padStart(2, '0');
  const labelOf = (s: HTMLElement) => (s.getAttribute('aria-label') ?? '').replace(/^\d+ de \d+: /, '');
  const themeOf = (s: HTMLElement) => (s.className.match(/theme-(\w+)/) ?? [])[1] ?? 'dark';

  let current = -1;
  let motionOK = false;
  let tl: Timeline | null = null;
  let journeyTimer = 0;
  const viewed = new Set<number>();
  let completed = false;

  /* ---------------- Índice a partir do endereço ---------------- */
  function indexFromHash(): number {
    const h = decodeURIComponent(location.hash.replace(/^#/, ''));
    if (!h) return 0;
    const num = Number(h.replace(/^slide-/, ''));
    if (Number.isInteger(num) && num >= 1 && num <= total) return num - 1;
    const byId = slides.findIndex((s) => s.id === h);
    return byId >= 0 ? byId : 0;
  }

  /* ---------------- Troca de slide ---------------- */
  function go(i: number, opts: { instant?: boolean; fromHash?: boolean } = {}) {
    const next = Math.max(0, Math.min(total - 1, i));
    if (next === current) return;
    const prevSlide = slides[current];
    const nextSlide = slides[next];

    if (prevSlide) leave(prevSlide);

    if (opts.instant) deck.classList.add('is-instant');
    slides.forEach((s, idx) => {
      const on = idx === next;
      s.classList.toggle('is-active', on);
      s.toggleAttribute('inert', !on);
      if (on) s.removeAttribute('aria-hidden');
      else s.setAttribute('aria-hidden', 'true');
    });
    nextSlide.scrollTop = 0;
    if (opts.instant) requestAnimationFrame(() => requestAnimationFrame(() => deck.classList.remove('is-instant')));

    // O foco não pode ficar preso num slide que acabou de ficar inerte
    if (prevSlide && prevSlide.contains(document.activeElement)) slidesEl.focus({ preventScroll: true });

    current = next;
    const n = next + 1;
    const label = labelOf(nextSlide);
    deck.dataset.tone = nextSlide.dataset.tone ?? 'dark';
    deck.dataset.theme = themeOf(nextSlide);
    if (ui.current) ui.current.textContent = pad(n);
    if (ui.label) ui.label.textContent = label;
    if (ui.progress) ui.progress.style.transform = `scaleX(${n / total})`;
    if (ui.prev) ui.prev.disabled = next === 0;
    if (ui.next) ui.next.disabled = next === total - 1;
    if (ui.live && current >= 0) ui.live.textContent = `Slide ${n} de ${total}: ${label}`;

    if (!opts.fromHash) history.replaceState(null, '', `#${n}`);

    enter(nextSlide);
    countView(n, nextSlide.id);
  }

  const step = (delta: number) => go(current + delta);

  /* ---------------- Analytics ---------------- */
  function countView(n: number, id: string) {
    if (viewed.has(n)) return;
    viewed.add(n);
    track('presentation_slide_view', { slide_number: n, slide_id: id });
    if (n === total && !completed) {
      completed = true;
      track('presentation_complete', { slides_viewed: viewed.size, slides_total: total });
    }
  }

  deck.addEventListener('click', (e) => {
    const a = (e.target as Element | null)?.closest<HTMLAnchorElement>('a[data-deck-cta]');
    if (!a) return;
    const payload = { cta: a.dataset.deckCta, slide_number: current + 1 };
    if (/wa\.me|api\.whatsapp\.com/.test(a.href)) track('presentation_whatsapp_click', payload);
    else track('presentation_cta_click', payload);
  });

  /* ---------------- Coreografias ---------------- */
  function killTimeline() {
    window.clearTimeout(journeyTimer);
    if (tl) {
      tl.progress(1).kill();
      tl = null;
    }
  }

  function leave(slide: HTMLElement) {
    killTimeline();
    const journey = slide.querySelector<HTMLElement>('[data-journey]');
    if (journey) setJourney(journey, 4);
  }

  function enter(slide: HTMLElement) {
    const journey = slide.querySelector<HTMLElement>('[data-journey]');
    if (journey && motionOK) autoplayJourney(journey, 1);
    if (!motionOK) return;

    const g = gsap;
    const q = (sel: string) => Array.from(slide.querySelectorAll<HTMLElement>(sel));
    const t = g.timeline({ defaults: { duration: 0.55, ease: 'power3.out', clearProps: CLEAR } });
    tl = t;

    t.from(q('.slide-index'), { autoAlpha: 0, y: 10, duration: 0.35 });
    const base = q('[data-a]');
    if (base.length) t.from(base, { autoAlpha: 0, y: 24, stagger: 0.07 }, '<0.05');

    switch (slide.id) {
      case 'abertura': {
        const path = slide.querySelector('.open-symbol path');
        if (path)
          t.fromTo(
            path,
            { strokeDasharray: 1, strokeDashoffset: 1 },
            { strokeDashoffset: 0, duration: 1.1, ease: 'power2.inOut' },
            0.1,
          );
        break;
      }
      case 'oportunidade':
        t.from(q('[data-a-moment]'), { autoAlpha: 0, x: 28, stagger: 0.12, duration: 0.5 }, 0.25);
        break;
      case 'solucao':
        t.fromTo(
          q('.plan-walls path, .plan-store rect[pathLength]'),
          { strokeDasharray: 1, strokeDashoffset: 1 },
          { strokeDashoffset: 0, duration: 0.9, ease: 'power2.inOut', stagger: 0.12 },
          0.15,
        )
          .from(q('.plan-labels text, .plan-tag'), { autoAlpha: 0, duration: 0.4, stagger: 0.06 }, '-=0.4')
          .from(q('[data-a-pillar]'), { autoAlpha: 0, y: 20, stagger: 0.1, duration: 0.45 }, '-=0.3');
        break;
      case 'curadoria':
        t.fromTo(
          q('[data-a-tile] .photo'),
          { clipPath: 'inset(100% 0% 0% 0% round 24px)' },
          { clipPath: 'inset(0% 0% 0% 0% round 24px)', duration: 0.65, ease: 'power3.inOut', stagger: 0.08 },
          0.15,
        ).from(q('[data-a-tile] :is(h3, p)'), { autoAlpha: 0, y: 12, stagger: 0.05, duration: 0.4 }, '-=0.45');
        break;
      case 'projeto':
        t.from(q('[data-a-render]'), { autoAlpha: 0, scale: 0.97, stagger: 0.1, duration: 0.6 }, 0.2);
        break;
      case 'modelo':
        t.from(q('.resp-axis'), { scaleY: 0, transformOrigin: 'top', duration: 0.6, ease: 'power2.inOut' }, 0.2)
          .from(q('.resp-title'), { autoAlpha: 0, y: 12, stagger: 0.1, duration: 0.4 }, 0.25)
          .from(q('[data-a-left]'), { autoAlpha: 0, x: -24, stagger: 0.07, duration: 0.45 }, 0.4)
          .from(q('[data-a-right]'), { autoAlpha: 0, x: 24, stagger: 0.07, duration: 0.45 }, 0.55);
        break;
      case 'seguranca':
        t.from(q('[data-a-safe]'), { autoAlpha: 0, y: 18, stagger: 0.07, duration: 0.45 }, 0.3);
        break;
      case 'condicoes':
        t.from(q('[data-a-term]'), { autoAlpha: 0, y: 24, stagger: 0.09, duration: 0.5 }, 0.2);
        break;
      case 'implantacao': {
        const vertical = !window.matchMedia('(min-width: 1024px)').matches;
        t.from(q('.road-fill'), { [vertical ? 'scaleY' : 'scaleX']: 0, duration: 1.2, ease: 'power2.inOut' }, 0.2).from(
          q('[data-a-road]'),
          { autoAlpha: 0, y: 14, stagger: 0.16, duration: 0.4 },
          0.25,
        );
        break;
      }
      case 'perguntas':
        t.from(q('[data-a-qa]'), { autoAlpha: 0, y: 16, stagger: 0.06, duration: 0.4 }, 0.2);
        break;
      case 'convite':
        t.from(q('[data-a-qr]'), { autoAlpha: 0, scale: 0.94, y: 12, duration: 0.6 }, 0.35);
        break;
    }
  }

  /* ---------------- Jornada de compra ---------------- */
  function setJourney(el: HTMLElement, n: number) {
    el.dataset.step = String(n);
    el.querySelectorAll<HTMLButtonElement>('[data-journey-step]').forEach((b) =>
      b.setAttribute('aria-pressed', String(Number(b.dataset.journeyStep) === n)),
    );
  }

  function autoplayJourney(el: HTMLElement, n: number) {
    setJourney(el, n);
    window.clearTimeout(journeyTimer);
    // A última etapa (Pix + confirmação) fica mais tempo na tela
    journeyTimer = window.setTimeout(() => autoplayJourney(el, n === 4 ? 1 : n + 1), n === 4 ? 4200 : 2400);
  }

  deck.querySelectorAll<HTMLElement>('[data-journey]').forEach((el) => {
    el.addEventListener('click', (e) => {
      const b = (e.target as Element | null)?.closest<HTMLButtonElement>('[data-journey-step]');
      if (!b) return;
      window.clearTimeout(journeyTimer); // quem apresenta assume o controle
      setJourney(el, Number(b.dataset.journeyStep));
    });
  });

  /* ---------------- Entradas ---------------- */
  ui.prev?.addEventListener('click', () => step(-1));
  ui.next?.addEventListener('click', () => step(1));

  document.addEventListener('keydown', (e) => {
    if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
    const t = e.target as HTMLElement | null;
    if (t?.closest('input, textarea, select, [contenteditable="true"]')) return;
    const onControl = !!t?.closest('a, button');
    switch (e.key) {
      case 'ArrowRight':
      case 'PageDown':
        e.preventDefault();
        step(1);
        break;
      case 'ArrowLeft':
      case 'PageUp':
        e.preventDefault();
        step(-1);
        break;
      case ' ':
        if (onControl) return; // Espaço ativa o botão/link focado
        e.preventDefault();
        step(e.shiftKey ? -1 : 1);
        break;
      case 'Home':
        e.preventDefault();
        go(0);
        break;
      case 'End':
        e.preventDefault();
        go(total - 1);
        break;
      case 'f':
      case 'F':
        if (ui.fullscreen && !ui.fullscreen.hidden) {
          e.preventDefault();
          toggleFullscreen();
        }
        break;
    }
  });

  // Gesto horizontal (toque/caneta). A rolagem vertical do slide continua nativa (touch-action: pan-y).
  let start: { x: number; y: number; t: number } | null = null;
  slidesEl.addEventListener(
    'pointerdown',
    (e) => {
      if (e.pointerType === 'mouse' || !e.isPrimary) return;
      start = { x: e.clientX, y: e.clientY, t: performance.now() };
    },
    { passive: true },
  );
  slidesEl.addEventListener(
    'pointerup',
    (e) => {
      if (!start) return;
      const dx = e.clientX - start.x;
      const dy = e.clientY - start.y;
      const dt = performance.now() - start.t;
      start = null;
      if (Math.abs(dx) > 56 && Math.abs(dx) > Math.abs(dy) * 1.4 && dt < 900) step(dx < 0 ? 1 : -1);
    },
    { passive: true },
  );
  slidesEl.addEventListener('pointercancel', () => (start = null), { passive: true });

  window.addEventListener('hashchange', () => go(indexFromHash(), { fromHash: true }));

  /* ---------------- Tela cheia ---------------- */
  function toggleFullscreen() {
    if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {});
    else root.requestFullscreen?.().catch(() => {});
  }

  if (ui.fullscreen && document.fullscreenEnabled) {
    ui.fullscreen.hidden = false;
    ui.fullscreen.addEventListener('click', toggleFullscreen);
    document.addEventListener('fullscreenchange', () => {
      const on = !!document.fullscreenElement;
      deck.classList.toggle('is-fullscreen', on);
      ui.fullscreen!.setAttribute('aria-label', on ? 'Sair da tela cheia' : 'Tela cheia');
      ui.fullscreen!.title = on ? 'Sair da tela cheia (F)' : 'Tela cheia (F)';
    });
  }

  /* ---------------- Imagens com falha: mantém a moldura, esconde o ícone quebrado ---------------- */
  deck.querySelectorAll<HTMLImageElement>('.photo img').forEach((img) => {
    const fail = () => img.closest('.photo')?.classList.add('is-broken');
    if (img.complete && img.naturalWidth === 0 && img.currentSrc) fail();
    img.addEventListener('error', fail, { once: true });
  });

  /* ---------------- Impressão: tudo visível e carregado ---------------- */
  window.addEventListener('beforeprint', () => {
    killTimeline();
    deck.querySelectorAll<HTMLImageElement>('img[loading="lazy"]').forEach((img) => (img.loading = 'eager'));
    deck.querySelectorAll<HTMLElement>('[data-journey]').forEach((el) => setJourney(el, 4));
  });

  /* ---------------- Início ---------------- */
  // Movimento: liga/desliga com a preferência do sistema, inclusive durante a apresentação
  const mm = gsap.matchMedia();
  mm.add('(prefers-reduced-motion: no-preference)', () => {
    motionOK = true;
    root.classList.add('motion');
    return () => {
      motionOK = false;
      root.classList.remove('motion');
      killTimeline();
      const journey = slides[current]?.querySelector<HTMLElement>('[data-journey]');
      if (journey) setJourney(journey, 4);
    };
  });

  go(indexFromHash(), { instant: true, fromHash: true });
  deck.classList.add('is-ready');
  track('presentation_open', { slide_number: current + 1, entry: location.hash ? 'deep_link' : 'start' });
}
