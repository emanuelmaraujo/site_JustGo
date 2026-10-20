// SEO Utility Library — Just Go Market
// Gera metadados consistentes. O <title> carrega a palavra-chave; o H1 pode ser de marca.

export interface SEOProps {
    title?: string;
    /** Título completo, sem sufixo automático (ex.: home). */
    fullTitle?: string;
    description?: string;
    canonical?: string;
    ogImage?: string;
    ogType?: string;
    city?: string;
    noindex?: boolean;
}

const BRAND = 'Just Go Market';
const BRAND_SUFFIX = 'Mercado Autônomo para Condomínios';
const SITE_URL = 'https://justgomarket.com.br';
const DEFAULT_TITLE = 'Mercado Autônomo Premium para Condomínios em Brasília | Just Go Market';
const DEFAULT_DESCRIPTION =
    'Mercado autônomo 24h com curadoria premium para condomínios de alto padrão em Brasília. Instalado e operado pela Just Go Market, sem custo para o condomínio.';
const DEFAULT_OG_IMAGE = `${SITE_URL}/assets/images/og-just-go-market.png`;

export function generateTitle(title?: string, city?: string, fullTitle?: string): string {
    if (fullTitle) return fullTitle;
    if (title) {
        const cityPart = city && !title.includes(city) ? ` em ${city}` : '';
        return `${title}${cityPart} | ${BRAND}`;
    }
    return DEFAULT_TITLE;
}

export function generateDescription(description?: string): string {
    return description || DEFAULT_DESCRIPTION;
}

/**
 * URL canônica sem barra final e sem .html — exatamente a forma que o
 * .htaccess serve (ele redireciona /pagina/ → /pagina com 301).
 */
export function generateCanonical(path: string): string {
    const clean = path
        .split('?')[0]
        .split('#')[0]
        .replace(/\/index\.html$/, '')
        .replace(/\.html$/, '')
        .replace(/\/+$/, '');

    return clean === '' ? `${SITE_URL}/` : `${SITE_URL}${clean}`;
}

export function absoluteUrl(path: string): string {
    if (/^https?:\/\//.test(path)) return path;
    return `${SITE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
}

export function generateOGImage(ogImage?: string): string {
    return ogImage ? absoluteUrl(ogImage) : DEFAULT_OG_IMAGE;
}

export interface FullSEO {
    title: string;
    description: string;
    canonical: string;
    ogImage: string;
    ogType: string;
    noindex: boolean;
}

export function buildSEO(props: SEOProps, currentPath: string): FullSEO {
    return {
        title: generateTitle(props.title, props.city, props.fullTitle),
        description: generateDescription(props.description),
        canonical: props.canonical || generateCanonical(currentPath),
        ogImage: generateOGImage(props.ogImage),
        ogType: props.ogType || 'website',
        noindex: props.noindex || false,
    };
}

export { BRAND, BRAND_SUFFIX, SITE_URL, DEFAULT_OG_IMAGE };
