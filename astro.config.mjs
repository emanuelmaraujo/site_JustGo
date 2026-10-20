import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
    site: 'https://justgomarket.com.br',
    output: 'static',
    srcDir: './src',
    publicDir: './public',
    outDir: './dist',
    trailingSlash: 'ignore',
    // A classe de escopo acompanha a prop `class` passada a componentes filhos
    scopedStyleStrategy: 'class',
    build: {
        format: 'file',
        assets: 'site-assets',
        // CSS inline: elimina requisições bloqueantes na cadeia crítica (LCP)
        inlineStylesheets: 'always',
    },
    integrations: [
        sitemap({
            filter: (page) => !page.includes('/404'),
        }),
    ],
    image: {
        domains: ['justgomarket.com.br'],
    },

    vite: {
        css: {
            devSourcemap: true,
        },
    },
});
