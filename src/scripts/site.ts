/**
 * Just Go Market — interações do site (leve, carregado em todas as páginas).
 * Coreografias com scroll (GSAP + Lenis) ficam em ./motion.ts e são carregadas
 * depois do conteúdo crítico, só quando .motion está ativo.
 */

import { CTA, SITE } from '../lib/site';

const root = document.documentElement;
const motionOn = () => root.classList.contains('motion');

/* ------------------------------------------------------------------ */
/* Analytics                                                          */
/* ------------------------------------------------------------------ */
declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}

function track(event: string, payload: Record<string, unknown> = {}) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...payload });
}

function initTracking() {
  document.addEventListener(
    'click',
    (e) => {
      const el = (e.target as Element | null)?.closest<HTMLElement>('a, button');
      if (!el) return;
      const origin = el.dataset.origin || el.closest<HTMLElement>('[data-floor-label], section[id]')?.id || 'pagina';
      const explicit = el.dataset.track;
      const href = el.getAttribute('href') || '';
      if (explicit) {
        track(explicit, { origin, link_text: el.textContent?.trim().slice(0, 60) });
      } else if (/wa\.me|api\.whatsapp\.com/.test(href)) {
        track('whatsapp_click', { origin });
      }
    },
    { capture: true },
  );

  // curadoria_view — quando a seção de curadoria entra na tela
  document.querySelectorAll<HTMLElement>('[data-track-view]').forEach((el) => {
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((en) => en.isIntersecting)) {
          track(el.dataset.trackView!, { page: location.pathname });
          io.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
  });
}

/* ------------------------------------------------------------------ */
/* Header: vidro após 80px; some ao descer e volta ao subir           */
/* ------------------------------------------------------------------ */
function initHeader() {
  const header = document.querySelector<HTMLElement>('[data-header]');
  if (!header) return;
  let lastY = window.scrollY;
  let ticking = false;
  const update = () => {
    const y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 80);
    const goingDown = y > lastY + 4;
    const goingUp = y < lastY - 4;
    if (goingDown && y > 320) header.classList.add('is-hidden');
    else if (goingUp || y < 320) header.classList.remove('is-hidden');
    lastY = y;
    ticking = false;
  };
  update();
  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    },
    { passive: true },
  );
  // Foco por teclado dentro do header sempre o revela
  header.addEventListener('focusin', () => header.classList.remove('is-hidden'));
}

/* ------------------------------------------------------------------ */
/* Diálogos: menu mobile e painel "Agendar visita"                     */
/* ------------------------------------------------------------------ */
function lockScroll(lock: boolean) {
  document.body.style.overflow = lock ? 'hidden' : '';
  window.dispatchEvent(new CustomEvent(lock ? 'jg:lock' : 'jg:unlock'));
}

function initMenu() {
  const dialog = document.getElementById('menu-mobile') as HTMLDialogElement | null;
  const openBtn = document.querySelector<HTMLButtonElement>('[data-menu-open]');
  if (!dialog || !openBtn) return;
  openBtn.addEventListener('click', () => {
    dialog.showModal();
    openBtn.setAttribute('aria-expanded', 'true');
    lockScroll(true);
  });
  dialog.querySelector('[data-menu-close]')?.addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => {
    openBtn.setAttribute('aria-expanded', 'false');
    lockScroll(false);
  });
  dialog.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => dialog.close()));
  // Ao passar para o desktop com o menu aberto, fecha
  window.matchMedia('(min-width: 1024px)').addEventListener('change', (e) => {
    if (e.matches && dialog.open) dialog.close();
  });
}

function initLeadDialog() {
  const dialog = document.getElementById('lead-dialog') as HTMLDialogElement | null;
  if (!dialog) return;
  const menu = document.getElementById('menu-mobile') as HTMLDialogElement | null;

  document.addEventListener('click', (e) => {
    const trigger = (e.target as Element | null)?.closest<HTMLAnchorElement>('[data-lead-open]');
    if (!trigger || e.metaKey || e.ctrlKey || e.shiftKey) return;
    e.preventDefault();
    if (menu?.open) menu.close();
    dialog.showModal();
    lockScroll(true);
    dialog.querySelector<HTMLInputElement>('input[name="nome"]')?.focus({ preventScroll: true });
  });

  dialog.querySelector('[data-lead-close]')?.addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => lockScroll(false));
  // Clique no fundo fecha
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) dialog.close();
  });
}

/* ------------------------------------------------------------------ */
/* Formulário "Agendar visita" → WhatsApp                              */
/* ------------------------------------------------------------------ */
const digits = (v: string) => v.replace(/\D/g, '');

function formatPhone(v: string) {
  const d = digits(v).slice(0, 11);
  if (d.length <= 2) return d ? `(${d}` : '';
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

function initLeadForms() {
  document.querySelectorAll<HTMLFormElement>('[data-lead-form]').forEach((form) => {
    const field = (name: string) => form.elements.namedItem(name) as HTMLInputElement | null;
    const phone = field('whatsapp');
    phone?.addEventListener('input', () => {
      phone.value = formatPhone(phone.value);
    });

    const rules: Record<string, (v: string) => string> = {
      nome: (v) => (v.trim().length < 2 ? 'Informe o seu nome.' : ''),
      whatsapp: (v) => (digits(v).length < 10 ? 'Informe um WhatsApp com DDD.' : ''),
      condominio: (v) => (v.trim().length < 2 ? 'Informe o condomínio ou empreendimento.' : ''),
    };

    const validate = (name: string) => {
      const input = field(name);
      if (!input) return true;
      const msg = rules[name](input.value);
      const err = form.querySelector<HTMLElement>(`[data-error-for="${name}"]`);
      input.setAttribute('aria-invalid', msg ? 'true' : 'false');
      if (err) err.textContent = msg;
      return !msg;
    };

    Object.keys(rules).forEach((name) => {
      field(name)?.addEventListener('blur', () => {
        if (field(name)!.value) validate(name);
      });
      field(name)?.addEventListener('input', () => {
        if (field(name)!.getAttribute('aria-invalid') === 'true') validate(name);
      });
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const results = Object.keys(rules).map(validate);
      if (results.includes(false)) {
        const first = form.querySelector<HTMLElement>('[aria-invalid="true"]');
        first?.focus();
        return;
      }
      const data = new FormData(form);
      const get = (k: string) => String(data.get(k) ?? '').trim();
      const lines = [
        `Olá! Gostaria de ${CTA.primary.toLowerCase()} da Just Go Market.`,
        '',
        `Perfil: ${get('perfil')}`,
        `Nome: ${get('nome')}`,
        `WhatsApp: ${get('whatsapp')}`,
        `Condomínio: ${get('condominio')}`,
        `Região: ${get('regiao')}`,
      ];
      if (get('mensagem')) lines.push('', `Observações: ${get('mensagem')}`);
      lines.push('', 'Enviado pelo site justgomarket.com.br');

      track('lead_submit', {
        lead_profile: get('perfil'),
        lead_region: get('regiao'),
        lead_source: form.dataset.origin || 'form',
      });

      const url = `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(lines.join('\n'))}`;
      window.open(url, '_blank', 'noopener');
    });
  });
}

/* ------------------------------------------------------------------ */
/* Reveals (IntersectionObserver + CSS) e count-up                     */
/* ------------------------------------------------------------------ */
function stagger() {
  const groups = new Map<Element, HTMLElement[]>();
  document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
    const parent = el.parentElement;
    if (!parent) return;
    if (!groups.has(parent)) groups.set(parent, []);
    groups.get(parent)!.push(el);
  });
  groups.forEach((items) => {
    if (items.length < 2) return;
    items.forEach((el, i) => {
      if (!el.style.getPropertyValue('--d')) el.style.setProperty('--d', `${Math.min(i, 6) * 0.08}s`);
    });
  });
}

function countUp(el: HTMLElement) {
  const target = Number(el.dataset.count);
  if (!Number.isFinite(target) || target === 0) return;
  const duration = 1600;
  const start = performance.now();
  const ease = (t: number) => 1 - Math.pow(1 - t, 4);
  const holder = el.closest<HTMLElement>('.stat-value') ?? el;
  holder.style.transition = 'filter 1.2s cubic-bezier(0.16, 1, 0.3, 1)';
  holder.style.filter = 'blur(8px)';
  requestAnimationFrame(() => (holder.style.filter = 'blur(0)'));
  const frame = (now: number) => {
    const t = Math.min((now - start) / duration, 1);
    el.textContent = String(Math.round(target * ease(t)));
    if (t < 1) requestAnimationFrame(frame);
  };
  el.textContent = '0';
  requestAnimationFrame(frame);
  // Garante o valor final mesmo se a aba estiver em segundo plano
  window.setTimeout(() => {
    el.textContent = String(target);
    holder.style.filter = '';
  }, duration + 100);
}

function initReveals() {
  if (!motionOn()) return;
  stagger();
  const targets = document.querySelectorAll<HTMLElement>(
    '[data-reveal], [data-split], [data-unveil], [data-draw], [data-count], .draw-line, [data-wordmark]',
  );
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target as HTMLElement;
        el.classList.add('is-in');
        if (el.hasAttribute('data-count')) countUp(el);
        io.unobserve(el);
      });
    },
    { rootMargin: '0px 0px -12% 0px', threshold: 0.01 },
  );
  targets.forEach((el) => io.observe(el));
}

/* ------------------------------------------------------------------ */
/* Accordion                                                           */
/* ------------------------------------------------------------------ */
function initAccordions() {
  document.querySelectorAll<HTMLElement>('[data-accordion]').forEach((acc) => {
    acc.querySelectorAll<HTMLButtonElement>('.acc-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const item = btn.closest('.acc-item')!;
        const open = btn.getAttribute('aria-expanded') !== 'true';
        btn.setAttribute('aria-expanded', String(open));
        item.classList.toggle('is-open', open);
        if (open) track('faq_open', { question: btn.textContent?.trim().slice(0, 100) });
      });
    });
  });
}

/* ------------------------------------------------------------------ */
/* Abas (tablist acessível)                                            */
/* ------------------------------------------------------------------ */
function initTabs() {
  document.querySelectorAll<HTMLElement>('[data-tabs]').forEach((wrap) => {
    const tabs = Array.from(wrap.querySelectorAll<HTMLButtonElement>('[role="tab"]'));
    const select = (tab: HTMLButtonElement, focus = false) => {
      tabs.forEach((t) => {
        const on = t === tab;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        const panel = document.getElementById(t.getAttribute('aria-controls')!);
        if (panel) {
          if (on) panel.removeAttribute('data-hidden-js');
          else panel.setAttribute('data-hidden-js', '');
        }
      });
      if (focus) tab.focus();
    };
    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => select(tab));
      tab.addEventListener('keydown', (e) => {
        const key = e.key;
        let next = -1;
        if (key === 'ArrowRight') next = (i + 1) % tabs.length;
        if (key === 'ArrowLeft') next = (i - 1 + tabs.length) % tabs.length;
        if (key === 'Home') next = 0;
        if (key === 'End') next = tabs.length - 1;
        if (next >= 0) {
          e.preventDefault();
          select(tabs[next], true);
        }
      });
    });
  });
}

/* ------------------------------------------------------------------ */
/* Slider antes/depois                                                 */
/* ------------------------------------------------------------------ */
function initBeforeAfter() {
  document.querySelectorAll<HTMLElement>('[data-before-after]').forEach((wrap) => {
    const handle = wrap.querySelector<HTMLElement>('.ba-handle')!;
    let value = 50;
    const set = (v: number) => {
      value = Math.max(0, Math.min(100, v));
      wrap.style.setProperty('--pos', `${value}%`);
      handle.setAttribute('aria-valuenow', String(Math.round(value)));
      handle.setAttribute('aria-valuetext', `${Math.round(value)}% antes, ${Math.round(100 - value)}% depois`);
    };
    const fromPointer = (x: number) => {
      const r = wrap.getBoundingClientRect();
      set(((x - r.left) / r.width) * 100);
    };
    let dragging = false;
    wrap.addEventListener('pointerdown', (e) => {
      dragging = true;
      wrap.classList.add('is-dragging');
      wrap.setPointerCapture(e.pointerId);
      fromPointer(e.clientX);
    });
    wrap.addEventListener('pointermove', (e) => dragging && fromPointer(e.clientX));
    const stop = () => {
      dragging = false;
      wrap.classList.remove('is-dragging');
    };
    wrap.addEventListener('pointerup', stop);
    wrap.addEventListener('pointercancel', stop);
    handle.addEventListener('keydown', (e) => {
      const step = e.shiftKey ? 10 : 2;
      const map: Record<string, number> = {
        ArrowLeft: value - step,
        ArrowDown: value - step,
        ArrowRight: value + step,
        ArrowUp: value + step,
        PageDown: value - 10,
        PageUp: value + 10,
        Home: 0,
        End: 100,
      };
      if (e.key in map) {
        e.preventDefault();
        set(map[e.key]);
      }
    });
    set(50);
  });
}

/* ------------------------------------------------------------------ */
/* sticky-steps: estado do totem + barra de progresso                  */
/* ------------------------------------------------------------------ */
function initStickySteps() {
  document.querySelectorAll<HTMLElement>('[data-sticky-steps]').forEach((wrap) => {
    const steps = Array.from(wrap.querySelectorAll<HTMLElement>('.ss-step'));
    const totem = wrap.querySelector<HTMLElement>('.ss-totem');
    const fill = wrap.querySelector<HTMLElement>('.ss-progress-fill');
    const col = wrap.querySelector<HTMLElement>('.ss-col');
    const activate = (i: number) => {
      steps.forEach((s, j) => s.classList.toggle('is-active', j === i));
      if (totem) totem.dataset.state = String(i + 1);
    };
    activate(0);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) activate(steps.indexOf(en.target as HTMLElement));
        });
      },
      { rootMargin: '-45% 0px -45% 0px' },
    );
    steps.forEach((s) => io.observe(s));

    if (!fill || !col) return;
    let ticking = false;
    const progress = () => {
      const r = col.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = (vh * 0.5 - r.top) / r.height;
      fill.style.setProperty('--progress', String(Math.max(0, Math.min(1, p))));
      ticking = false;
    };
    progress();
    window.addEventListener(
      'scroll',
      () => {
        if (!ticking) {
          requestAnimationFrame(progress);
          ticking = true;
        }
      },
      { passive: true },
    );
  });
}

/* ------------------------------------------------------------------ */
/* Progresso de leitura em linhas (timeline) e na barra do blog        */
/* ------------------------------------------------------------------ */
function initScrollProgress() {
  const els = Array.from(document.querySelectorAll<HTMLElement>('[data-scroll-progress]'));
  if (!els.length) return;
  let ticking = false;
  const update = () => {
    const vh = window.innerHeight;
    els.forEach((el) => {
      const target = el.dataset.scrollProgress ? document.querySelector<HTMLElement>(el.dataset.scrollProgress) : el;
      if (!target) return;
      const r = target.getBoundingClientRect();
      const page = el.hasAttribute('data-progress-page');
      const p = page ? -r.top / Math.max(1, r.height - vh) : (vh * 0.6 - r.top) / r.height;
      el.style.setProperty('--progress', String(Math.max(0, Math.min(1, p))));
    });
    ticking = false;
  };
  update();
  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    },
    { passive: true },
  );
  window.addEventListener('resize', update, { passive: true });
}

/* ------------------------------------------------------------------ */
/* Indicador de andar, WhatsApp flutuante e CTA sticky mobile          */
/* ------------------------------------------------------------------ */
function initFloating() {
  const wa = document.querySelector<HTMLElement>('[data-wa-float]');
  const mcta = document.querySelector<HTMLElement>('[data-mobile-cta]');
  const final = document.querySelector<HTMLElement>('[data-cta-final]');
  const footer = document.querySelector<HTMLElement>('[data-footer]');
  const hero = document.querySelector<HTMLElement>('main > section:first-of-type');

  let finalVisible = false;
  let footerVisible = false;
  let pastHero = !hero;

  const apply = () => {
    const away = finalVisible || footerVisible;
    wa?.classList.toggle('is-away', away);
    mcta?.classList.toggle('is-visible', pastHero && !away);
  };

  const watch = (el: HTMLElement | null, cb: (v: boolean) => void, margin = '0px') => {
    if (!el) return;
    new IntersectionObserver((entries) => entries.forEach((en) => cb(en.isIntersecting)), {
      rootMargin: margin,
    }).observe(el);
  };

  watch(final, (v) => ((finalVisible = v), apply()));
  watch(footer, (v) => ((footerVisible = v), apply()));
  if (hero) {
    new IntersectionObserver(
      (entries) =>
        entries.forEach((en) => {
          pastHero = !en.isIntersecting && en.boundingClientRect.top < 0;
          apply();
        }),
      { threshold: 0 },
    ).observe(hero);
  }
  apply();
}

function initFloorIndicator() {
  const panel = document.querySelector<HTMLElement>('[data-floor-indicator]');
  if (!panel) return;
  const num = panel.querySelector<HTMLElement>('[data-floor-num]')!;
  const label = panel.querySelector<HTMLElement>('[data-floor-label]')!;
  const floors = Array.from(document.querySelectorAll<HTMLElement>('[data-floor]'));
  if (!floors.length) return;
  let current = -1;
  let lastY = window.scrollY;
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const i = floors.indexOf(en.target as HTMLElement);
        if (i === current) return;
        const y = window.scrollY;
        panel.dataset.dir = y >= lastY ? 'down' : 'up';
        lastY = y;
        current = i;
        num.textContent = floors[i].dataset.floor ?? '';
        label.textContent = floors[i].dataset.floorLabel ?? '';
        panel.classList.toggle('is-visible', i > 0);
      });
    },
    { rootMargin: '-50% 0px -50% 0px' },
  );
  floors.forEach((f) => io.observe(f));
}

/* ------------------------------------------------------------------ */
/* Relógio "Aberto agora · 23:47"                                      */
/* ------------------------------------------------------------------ */
function initClock() {
  const els = document.querySelectorAll<HTMLElement>('[data-clock]');
  if (!els.length) return;
  const fmt = new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Sao_Paulo',
  });
  const tick = () => {
    const now = fmt.format(new Date());
    els.forEach((el) => {
      el.textContent = now;
      el.setAttribute('datetime', now);
    });
  };
  tick();
  window.setInterval(tick, 15000);
}

/* ------------------------------------------------------------------ */
/* Intro: pular com clique ou tecla; encerra sozinha em ≤ 1,6s         */
/* ------------------------------------------------------------------ */
function initIntro() {
  const intro = document.querySelector<HTMLElement>('[data-intro]');
  if (!intro || !root.classList.contains('intro-on')) return;
  let done = false;
  const end = () => {
    if (done) return;
    done = true;
    root.classList.remove('intro-on');
    window.removeEventListener('keydown', skip);
    window.dispatchEvent(new CustomEvent('jg:intro-end'));
  };
  const skip = () => {
    root.classList.add('intro-skip');
    window.setTimeout(end, 240);
  };
  intro.addEventListener('click', skip);
  window.addEventListener('keydown', skip, { once: true });
  const total = window.matchMedia('(max-width: 767px)').matches ? 1000 : 1600;
  window.setTimeout(end, total);
}

/* ------------------------------------------------------------------ */
/* Boot                                                                */
/* ------------------------------------------------------------------ */
function loadMotion() {
  if (!motionOn()) return;
  const go = () => import('./motion').then((m) => m.initMotion()).catch(() => {});
  const ric = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => void })
    .requestIdleCallback;
  if (ric) ric(go, { timeout: 1500 });
  else window.setTimeout(go, 300);
}

function boot() {
  initIntro();
  initTracking();
  initHeader();
  initMenu();
  initLeadDialog();
  initLeadForms();
  initReveals();
  initAccordions();
  initTabs();
  initBeforeAfter();
  initStickySteps();
  initScrollProgress();
  initFloating();
  initFloorIndicator();
  initClock();
  loadMotion();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot, { once: true });
} else {
  boot();
}

