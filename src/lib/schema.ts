// Schema.org Data Generators — Just Go Market
// Domínio canônico: https://justgomarket.com.br (sem www — o .htaccess redireciona o www).

import { SITE_URL } from './seo';
import { SITE } from './site';

export interface FAQItem {
    question: string;
    answer: string;
}

export interface BreadcrumbItem {
    name: string;
    url: string;
}

const LOGO = `${SITE_URL}/assets/images/just-go-market-logo-mercado-autonomo.png`;
const ORG_ID = `${SITE_URL}/#organization`;

/** Remove tags HTML das respostas antes de enviar ao Schema. */
const plain = (html: string) => html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

export function organizationSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        '@id': ORG_ID,
        name: SITE.name,
        alternateName: 'Just Go Market — Mercado Autônomo para Condomínios',
        url: `${SITE_URL}/`,
        logo: LOGO,
        slogan: SITE.slogan,
        description:
            'Mercado autônomo de alto padrão para condomínios em Brasília. Curadoria premium, operação 24h, instalado e operado sem custo para o condomínio.',
        telephone: `+${SITE.whatsappNumber}`,
        email: SITE.email,
        address: {
            '@type': 'PostalAddress',
            addressLocality: 'Brasília',
            addressRegion: 'DF',
            addressCountry: 'BR',
        },
        areaServed: [
            { '@type': 'City', name: 'Brasília' },
            { '@type': 'City', name: 'Águas Claras' },
            { '@type': 'City', name: 'Taguatinga' },
            { '@type': 'City', name: 'Valparaíso de Goiás' },
        ],
        foundingLocation: { '@type': 'Place', name: 'Brasília, DF' },
    };
}

export function websiteSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: `${SITE_URL}/`,
        name: SITE.name,
        inLanguage: 'pt-BR',
        publisher: { '@id': ORG_ID },
    };
}

export function localBusinessSchema(city?: string, coords?: { lat: number; lng: number }) {
    return {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        '@id': `${SITE_URL}/#localbusiness${city ? `-${city.toLowerCase().replace(/\s+/g, '-')}` : ''}`,
        name: `Just Go Market — Mercado Autônomo${city ? ` em ${city}` : ''}`,
        image: `${SITE_URL}/assets/images/og-just-go-market.png`,
        url: `${SITE_URL}/`,
        telephone: `+${SITE.whatsappNumber}`,
        parentOrganization: { '@id': ORG_ID },
        address: {
            '@type': 'PostalAddress',
            addressLocality: city || 'Brasília',
            addressRegion: 'DF',
            addressCountry: 'BR',
        },
        ...(coords && {
            geo: {
                '@type': 'GeoCoordinates',
                latitude: coords.lat,
                longitude: coords.lng,
            },
        }),
        areaServed: city || 'Brasília',
        description: `Mercado autônomo premium para condomínios${city ? ` em ${city}` : ' em Brasília'}. Operação 24h, sem custo para o condomínio.`,
        openingHoursSpecification: {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
            opens: '00:00',
            closes: '23:59',
        },
        paymentAccepted: 'Pix, cartão de crédito, cartão de débito',
        priceRange: '$$',
    };
}

export function serviceSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: 'Mercado Autônomo para Condomínios',
        provider: { '@id': ORG_ID },
        description:
            'Implantação e operação completa de mercado autônomo de alto padrão em condomínios: projeto, estrutura, estoque, reposição, limpeza, manutenção e monitoramento 24h, sem custo para o condomínio.',
        areaServed: { '@type': 'State', name: 'Distrito Federal' },
        serviceType: 'Mercado Autônomo para Condomínios',
        offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'BRL',
            description: 'Implantação e operação sem custo para o condomínio',
        },
    };
}

export function faqPageSchema(faqs: FAQItem[]) {
    return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map((faq) => ({
            '@type': 'Question',
            name: plain(faq.question),
            acceptedAnswer: {
                '@type': 'Answer',
                text: plain(faq.answer),
            },
        })),
    };
}

export function breadcrumbSchema(items: BreadcrumbItem[]) {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: item.url.startsWith('http') ? item.url : `${SITE_URL}${item.url}`,
        })),
    };
}

/** Breadcrumb a partir de pares nome/caminho, já com "Início". */
export function crumbs(...items: [string, string][]) {
    return breadcrumbSchema([{ name: 'Início', url: `${SITE_URL}/` }, ...items.map(([name, url]) => ({ name, url }))]);
}

export function articleSchema(a: {
    title: string;
    description: string;
    url: string;
    datePublished: Date;
    dateModified?: Date;
    image?: string;
    author?: string;
}) {
    return {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: a.title,
        description: a.description,
        mainEntityOfPage: a.url,
        url: a.url,
        datePublished: a.datePublished.toISOString(),
        dateModified: (a.dateModified ?? a.datePublished).toISOString(),
        image: a.image ? (a.image.startsWith('http') ? a.image : `${SITE_URL}${a.image}`) : `${SITE_URL}/assets/images/og-just-go-market.png`,
        author: { '@type': 'Organization', name: a.author ?? SITE.name, url: `${SITE_URL}/` },
        publisher: { '@id': ORG_ID },
        inLanguage: 'pt-BR',
    };
}
