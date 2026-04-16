import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Shared sub-schemas
 */
const faqSchema = z.object({
  question: z.string(),
  answer: z.string(),
});

const externalLinkSchema = z.object({
  url: z.string().url(),
  text: z.string(),
  source: z.string(), // e.g. "Maryland DNR", "ISA"
});

const ctaSchema = z.object({
  text: z.string(),
  href: z.string(),
});

const processStepSchema = z.object({
  title: z.string(),
  description: z.string(),
});

const quoteSchema = z.object({
  quote: z.string(),
  attribution: z.string().default('Dustin Snyder, Owner'),
});

/**
 * Tree service pages — /tree-services/<slug>
 */
const treeServices = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/tree-services' }),
  schema: z.object({
    title: z.string(),
    titleTag: z.string(),
    h1: z.string(),
    description: z.string(),
    city: z.string().default('Hagerstown'),
    state: z.string().default('MD'),
    heroImage: z.string().optional(),
    heroAlt: z.string(),
    emergency: z.boolean().default(false),

    intro: z.string(),
    whatsIncluded: z
      .object({
        heading: z.string().default("What's Included"),
        body: z.string(),
        items: z.array(z.string()).optional(),
      })
      .optional(),
    signsYouNeed: z
      .object({
        heading: z.string().default('Signs You May Need This'),
        items: z.array(
          z.object({
            title: z.string(),
            description: z.string(),
          })
        ),
      })
      .optional(),
    whyChoose: z
      .object({
        heading: z.string().default("Why Homeowners Choose Snyder's"),
        body: z.string(),
        quote: quoteSchema.optional(),
      })
      .optional(),
    processSteps: z
      .object({
        heading: z.string().default('Our Process'),
        steps: z.array(processStepSchema),
      })
      .optional(),
    useCases: z
      .object({
        heading: z.string(),
        items: z.array(z.string()),
      })
      .optional(),
    faqs: z.array(faqSchema),

    externalLink: externalLinkSchema,
    relatedLocations: z.array(z.string()).default([]),
    relatedServices: z.array(z.string()).default([]),
  }),
});

/**
 * Location pages — /service-areas/<slug>
 */
const locations = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/locations' }),
  schema: z.object({
    title: z.string(),
    titleTag: z.string(),
    h1: z.string(),
    description: z.string(),
    city: z.string(),
    state: z.string(),
    heroImage: z.string().optional(),
    heroAlt: z.string(),

    intro: z.string(),
    whyHere: z
      .object({
        heading: z.string(),
        body: z.string(),
        quote: quoteSchema.optional(),
      })
      .optional(),
    neighborhoods: z.array(z.string()),
    landmarks: z.array(z.string()).default([]),
    drivingRoute: z.string().optional(),
    mapEmbedSrc: z.string().optional(),
    localStats: z.string().optional(),

    faqs: z.array(faqSchema),
    externalLink: externalLinkSchema,
    relatedServices: z.array(z.string()).default([]),
  }),
});

/**
 * Outdoor service pages — /outdoor-services/<slug>  (Phase 2)
 */
const outdoorServices = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/outdoor-services' }),
  schema: z.object({
    title: z.string(),
    titleTag: z.string(),
    h1: z.string(),
    description: z.string(),
    city: z.string().default('Hagerstown'),
    state: z.string().default('MD'),
    heroImage: z.string().optional(),
    heroAlt: z.string(),

    intro: z.string(),
    details: z
      .object({
        heading: z.string(),
        body: z.string(),
      })
      .optional(),
    whoItsFor: z
      .object({
        heading: z.string().default("Who It's For"),
        body: z.string(),
      })
      .optional(),
    faqs: z.array(faqSchema),

    externalLink: externalLinkSchema,
  }),
});

export const collections = {
  'tree-services': treeServices,
  locations,
  'outdoor-services': outdoorServices,
};
