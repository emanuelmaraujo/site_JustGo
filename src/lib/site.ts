// Configuração central do site — Just Go Market

export const SITE = {
  name: 'Just Go Market',
  url: 'https://justgomarket.com.br',
  slogan: 'O essencial, a um passo.',
  whatsappNumber: '5561999918007',
  whatsappDisplay: '(61) 99991-8007',
  email: 'justgomarket@justgomarket.com.br',
  city: 'Brasília, DF',
} as const;

/** Um único nome de CTA principal em todo o site (§6.1). */
export const CTA = {
  primary: 'Agendar visita',
  primaryHref: '/agendar-visita',
  secondary: 'Falar no WhatsApp',
} as const;

export function whatsappUrl(text?: string) {
  const base = `https://wa.me/${SITE.whatsappNumber}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

export const WHATSAPP_DEFAULT_TEXT = 'Olá! Vim pelo site da Just Go Market e gostaria de conversar.';

export interface NavItem {
  href: string;
  label: string;
}

/** Navegação principal — máximo de 5 itens + 1 CTA. */
export const NAV: NavItem[] = [
  { href: '/curadoria', label: 'Curadoria' },
  { href: '/como-funciona', label: 'Como funciona' },
  { href: '/para-sindicos', label: 'Para síndicos' },
  { href: '/para-moradores', label: 'Para moradores' },
  { href: '/sobre', label: 'Sobre' },
];

export const FOOTER_NAV: NavItem[] = [
  ...NAV,
  { href: '/para-incorporadoras', label: 'Para incorporadoras' },
  { href: '/diagnostico-condominio', label: 'Diagnóstico' },
  { href: '/faq', label: 'Perguntas frequentes' },
  { href: '/blog', label: 'Blog' },
];

export const REGIONS: NavItem[] = [
  { href: '/brasilia', label: 'Brasília' },
  { href: '/noroeste', label: 'Noroeste' },
  { href: '/sudoeste', label: 'Sudoeste' },
  { href: '/aguas-claras', label: 'Águas Claras' },
  { href: '/taguatinga', label: 'Taguatinga' },
];

export const LEGAL: NavItem[] = [
  { href: '/privacidade', label: 'Privacidade' },
  { href: '/termos', label: 'Termos de uso' },
];

/**
 * Marcas premium efetivamente vendidas — [CONFIRMAR].
 * Enquanto a lista estiver vazia, a faixa de marcas não é exibida.
 */
export const PREMIUM_BRANDS: string[] = [];

/** Fatos verificáveis usados em todo o site. Alterar aqui atualiza todas as páginas. */
export const FACTS = {
  hours: '24h',
  investment: 'R$ 0',
  area: '15 m²',
  contractMonths: 36,
  projectDays: 'até 5 dias úteis',
  installDays: '15 a 30 dias',
  totalDays: '30 a 60 dias',
  replyHours: 'até 24 horas',
  // Pix confirmado em todos os totens. Aproximação: [CONFIRMAR] antes de citar.
  payment: 'Pix ou cartão de crédito e débito',
} as const;
