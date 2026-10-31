import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const stories = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/stories' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    series: z.string().nullable(),
    publishedAt: z.coerce.date(),
    author: z.string(),
    authorurl: z.string().url().optional(),
    cover: z.object({ src: z.string(), caption: z.string() }).optional(),
    featured: z.boolean().default(false),
    source: z.enum(['editorial', 'contribution']).default('editorial'),
  }),
});

export const collections = { stories };
