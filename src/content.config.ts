import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const writing = defineCollection({
  loader: glob({
    pattern: '**/*.md',
    base: './writing',
    // Keep the source available for reading-time estimates.
    retainBody: true,
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    categories: z.array(z.string()),
    date: z.coerce.date(),
  }),
});

export const collections = { writing };
