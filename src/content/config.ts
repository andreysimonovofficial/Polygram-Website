import { defineCollection, z } from 'astro:content';

const sections = defineCollection({
  type: 'data',
  schema: z.object({}),
});

export const collections = {
  sections: sections,
};
