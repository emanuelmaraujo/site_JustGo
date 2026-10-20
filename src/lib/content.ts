// Acesso ao conteúdo editável (Content Collections)
import { getCollection, getEntry } from 'astro:content';

export async function getFaqs() {
    const sindico = (await getEntry('faq', 'sindico'))!.data.items;
    const morador = (await getEntry('faq', 'morador'))!.data.items;
    return {
        sindico,
        morador,
        all: [...sindico, ...morador],
        featured: {
            sindico: sindico.filter((i) => i.featured),
            morador: morador.filter((i) => i.featured),
        },
    };
}

export async function getCuradoria() {
    const items = await getCollection('curadoria');
    return items.map((i) => i.data).sort((a, b) => a.order - b.order);
}
