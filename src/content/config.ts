import { defineCollection, z } from 'astro:content';

const blogCollection = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string(),
        description: z.string(),
        date: z.date(),
        tags: z.array(z.string()).default([]),
        // Optional: link to a related project
        relatedProject: z.string().optional(),
        // Draft posts won't be published
        draft: z.boolean().default(false),
    }),
});

export const collections = {
    'blog': blogCollection,
};
