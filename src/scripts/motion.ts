/**
 * Just Go Market — motion
 * Revelações no scroll, títulos palavra por palavra, imagens com máscara,
 * símbolo que se desenha e números que contam.
 * O CSS só esconde os elementos quando <html> tem a classe "motion",
 * que é adicionada no <head> apenas se o usuário não pediu "reduzir movimento".
 */

const root = document.documentElement;
const motionOn = root.classList.contains('motion');

/* Marca automaticamente blocos comuns das páginas internas,
   para que o site inteiro ganhe movimento sem editar cada página. */
const AUTO_REVEAL = [
  '.section-head',
  '.inner-hero .uppercase',
  '.inner-hero p',
  '.content-wrapper > *',
  '.bento-card',
  '.card',
  '.step',
  '.stat-item',
  '.accordion-item',
  '.split-content',
  '.editorial-text',
  '.contact-info',
  '.form-wrapper',
  '.transparency-box',
  '.faq-tabs',
  '.final-content > *',
  '.about-hero p',
  '.legal-content > *',
  '.footer-flex > *',
].join(',');

const AUTO_SPLIT = ['.inner-hero h1', '.about-hero h1', '.section-head h2', '.cta-band-inner h2'].join(',');

const AUTO_UNVEIL = ['.split-image-wrapper', '.editorial-image'].join(',');

function tag(selector: string, attr: string, value = '') {
  document.querySelectorAll<HTMLElement>(selector).forEach((el) => {
    if (!el.closest('[data-no-motion]') && !el.hasAttribute(attr)) el.setAttribute(attr, value);
  });
}

/* Escalona elementos irmãos (cards em grade, itens de FAQ etc.) */
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

/* Quebra o texto em palavras, preservando spans internos (ex.: destaque verde) */
function splitWords(el: HTMLElement) {
  if (el.dataset.splitDone) return;
  el.dataset.splitDone = '1';
  let index = 0;

  const walk = (node: Node) => {
    Array.from(node.childNodes).forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        const text = child.textContent ?? '';
        if (!text.trim()) return;
        const frag = document.createDocumentFragment();
        text.split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) {
            frag.appendChild(document.createTextNode(' '));
            return;
          }
          const outer = document.createElement('span');
          outer.className = 'split-word';
          const inner = document.createElement('span');
          inner.textContent = part;
          inner.style.setProperty('--i', String(index++));
          outer.appendChild(inner);
          frag.appendChild(outer);
        });
        child.replaceWith(frag);
      } else if (child.nodeType === Node.ELEMENT_NODE && (child as Element).tagName !== 'BR') {
        walk(child);
      }
    });
  };

  // Leitores de tela continuam lendo a frase inteira
  el.setAttribute('aria-label', el.textContent?.replace(/\s+/g, ' ').trim() ?? '');
  walk(el);
  el.querySelectorAll('.split-word').forEach((w) => w.setAttribute('aria-hidden', 'true'));
}

/* Números que contam (24h, 500+, 15m²…) */
function countUp(el: HTMLElement) {
  const raw = el.textContent ?? '';
  const match = raw.match(/(\d+)/);
  if (!match) return;
  const target = parseInt(match[1], 10);
  if (target === 0) return;
  const [before, after] = raw.split(match[1]);
  const duration = 1600;
  const start = performance.now();
  const ease = (t: number) => 1 - Math.pow(1 - t, 4);
  const frame = (now: number) => {
    const t = Math.min((now - start) / duration, 1);
    el.textContent = `${before}${Math.round(target * ease(t))}${after}`;
    if (t < 1) requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
}

function init() {
  if (!motionOn) return;

  tag(AUTO_REVEAL, 'data-reveal');
  tag(AUTO_SPLIT, 'data-split');
  tag(AUTO_UNVEIL, 'data-unveil');
  document.querySelectorAll<HTMLElement>('.stat-item h3').forEach((el) => el.setAttribute('data-count', ''));
  document.querySelectorAll<HTMLElement>('[data-split]').forEach(splitWords);
  stagger();

  const targets = document.querySelectorAll<HTMLElement>(
    '[data-reveal], [data-split], [data-unveil], [data-draw], [data-count], .green-line',
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
    { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
  );

  targets.forEach((el) => io.observe(el));

  // Rede de segurança: nada fica escondido se o observer falhar
  window.setTimeout(() => {
    targets.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight) el.classList.add('is-in');
    });
  }, 2500);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
