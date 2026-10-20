import { defineCollection, z } from 'astro:content';

const cidades = defineCollection({
    type: 'data',
    schema: z.object({
        name: z.string(),
        slug: z.string(),
        h1: z.string(),
        heroDescription: z.string(),
        metaTitle: z.string(),
        metaDescription: z.string(),
        coords: z.object({
            lat: z.number(),
            lng: z.number(),
        }),
        neighborhoods: z.array(z.string()),
        content: z.object({
            intro: z.string(),
            whyHere: z.string(),
            benefits: z.string(),
            howItWorks: z.string(),
            pricing: z.string(),
            neighborhoods: z.string(),
            cta: z.string(),
        }),
        faqs: z.array(z.object({
            question: z.string(),
            answer: z.string(),
        })),
    }),
});

const blog = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string(),
        description: z.string(),
        pubDate: z.coerce.date(),
        updatedDate: z.coerce.date().optional(),
        author: z.string().default('Just Go Market'),
        image: z.string().optional(),
        tags: z.array(z.string()).default([]),
        draft: z.boolean().default(true),
    }),
});

/** Perguntas frequentes por público (síndico / morador). Respostas aceitam HTML simples. */
const faq = defineCollection({
    type: 'data',
    schema: z.object({
        audience: z.enum(['sindico', 'morador']),
        title: z.string(),
        items: z.array(z.object({
            question: z.string(),
            answer: z.string(),
            /** Aparece no resumo da home */
            featured: z.boolean().default(false),
        })),
    }),
});

/** Universos da curadoria (adega, empório, despensa, bem-estar). */
const curadoria = defineCollection({
    type: 'data',
    schema: z.object({
        order: z.number(),
        title: z.string(),
        kicker: z.string(),
        text: z.string(),
        long: z.string(),
        items: z.array(z.string()),
        photo: z.object({
            name: z.string(),
            alt: z.string(),
            placeholder: z.string(),
        }),
        confirm: z.string().optional(),
    }),
});

export const collections = {
    cidades,
    blog,
    faq,
    curadoria,
};
