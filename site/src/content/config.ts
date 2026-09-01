import { defineCollection, z } from 'astro:content';

// One Markdown file per récit — "le format qui vieillit le mieux", as agreed
// in the design chat. Editorial numbers (price paid, CO2 avoided) are hand
// entered per trip, distinct from the calculator's generic per-route estimates.
const recits = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    excerpt: z.string(),
    dateTravelled: z.date(),
    dateUpdated: z.date().optional(),
    kickerType: z.string(), // e.g. "Nuit", "Ligne lente", "Grande traversée", "Régional", "Famille"
    country: z.string(),
    filterTag: z.enum(['nuit', 'traversee', 'lente', 'standard']),
    readMinutes: z.number(),
    priceEur: z.number(),
    co2AvoidedKg: z.number(),
    routeId: z.string(), // links to data/routes.ts
    coverImage: z.string().optional(),
    coverAlt: z.string(),
    instagramCaption: z.string().optional(),
    instagramDate: z.string().optional(),
    featured: z.boolean().default(false),
  }),
});

export const collections = { recits };
