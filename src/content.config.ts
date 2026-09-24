import { defineCollection, z, type SchemaContext } from 'astro:content';
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
 * Image-bearing sub-schemas. These take the collection's image() helper so
 * markdown files can reference photos with relative ../../assets paths.
 * All are optional/empty by default — sections only render once photos land.
 */
const gallerySchema = (image: SchemaContext['image']) =>
  z
    .array(
      z.object({
        image: image(),
        alt: z.string(),
        caption: z.string().optional(),
      })
    )
    .default([]);

const beforeAfterSchema = (image: SchemaContext['image']) =>
  z
    .object({
      heading: z.string().default('Before & After'),
      before: z.object({ image: image(), alt: z.string() }),
      after: z.object({ image: image(), alt: z.string() }),
      caption: z.string().optional(),
    })
    .optional();

const asidePhotoSchema = (image: SchemaContext['image']) =>
  z
    .object({
      image: image(),
      alt: z.string(),
      caption: z.string().optional(),
    })
    .optional();

/**
 * Tree service pages — /tree-services/<slug>
 */
const treeServices = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/tree-services' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    titleTag: z.string(),
    h1: z.string(),
    description: z.string(),
    /** Optional <meta name="description"> override so hero copy can stay city-specific. */
    metaDescription: z.string().optional(),
    /** Geo-neutral blurb for service cards reused across location pages. */
    cardDescription: z.string(),
    city: z.string().default('Hagerstown'),
    state: z.string().default('MD'),
    heroImage: image().optional(),
    heroImageMobile: image().optional(),
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

    gallery: gallerySchema(image),
    beforeAfter: beforeAfterSchema(image),
    asidePhoto: asidePhotoSchema(image),

    externalLink: externalLinkSchema,
    relatedLocations: z.array(z.string()).default([]),
    relatedServices: z.array(z.string()).default([]),
    /** Optional editorial line pointing at a service×city page. */
    comboCallout: z.string().optional(),
  }),
});

/**
 * Location pages — /service-areas/<slug>
 */
const locations = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/locations' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    titleTag: z.string(),
    h1: z.string(),
    description: z.string(),
    city: z.string(),
    state: z.string(),
    heroImage: image().optional(),
    heroImageMobile: image().optional(),
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

    gallery: gallerySchema(image),
    beforeAfter: beforeAfterSchema(image),
    asidePhoto: asidePhotoSchema(image),

    externalLink: externalLinkSchema,
    relatedServices: z.array(z.string()).default([]),
  }),
});

/**
 * Outdoor service pages — /outdoor-services/<slug>  (Phase 2)
 */
const outdoorServices = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/outdoor-services' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    titleTag: z.string(),
    h1: z.string(),
    description: z.string(),
    city: z.string().default('Hagerstown'),
    state: z.string().default('MD'),
    heroImage: image().optional(),
    heroImageMobile: image().optional(),
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

    gallery: gallerySchema(image),

    externalLink: externalLinkSchema,
  }),
});

/**
 * Service × city pages — /tree-services/<service>/<city>
 * First combo: tree-removal / frederick-md. Future pages are content-only.
 */
const serviceCity = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/service-city' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    titleTag: z.string(),
    h1: z.string(),
    description: z.string(),
    metaDescription: z.string(),
    serviceSlug: z.string(),
    citySlug: z.string(),
    city: z.string(),
    state: z.string(),
    county: z.string().optional(),
    heroImage: image().optional(),
    heroImageMobile: image().optional(),
    heroAlt: z.string(),
    emergency: z.boolean().default(false),

    intro: z.string(),
    whatsIncluded: z
      .object({
        heading: z.string(),
        body: z.string(),
        items: z.array(z.string()).optional(),
      })
      .optional(),
    signsYouNeed: z
      .object({
        heading: z.string(),
        body: z.string().optional(),
        subheading: z.string().optional(),
        items: z.array(
          z.object({
            title: z.string(),
            description: z.string(),
          })
        ),
      })
      .optional(),
    stormEmergency: z
      .object({
        heading: z.string(),
        body: z.string(),
      })
      .optional(),
    processSteps: z
      .object({
        heading: z.string(),
        body: z.string().optional(),
        steps: z.array(processStepSchema),
      })
      .optional(),
    costFactors: z
      .object({
        heading: z.string(),
        body: z.string(),
        items: z.array(
          z.object({
            title: z.string(),
            description: z.string(),
          })
        ),
        cta: z.string().optional(),
      })
      .optional(),
    permits: z
      .object({
        heading: z.string(),
        intro: z.string(),
        sections: z.array(
          z.object({
            heading: z.string(),
            body: z.string(),
          })
        ),
      })
      .optional(),
    nearStructures: z
      .object({
        heading: z.string(),
        body: z.string(),
      })
      .optional(),
    stumpPairing: z
      .object({
        heading: z.string(),
        body: z.string(),
      })
      .optional(),
    localAreas: z
      .object({
        heading: z.string(),
        body: z.string(),
        neighborhoods: z.array(z.string()).default([]),
        landmarks: z.array(z.string()).default([]),
      })
      .optional(),
    whyChoose: z
      .object({
        heading: z.string(),
        body: z.string(),
        quote: quoteSchema.optional(),
      })
      .optional(),
    crossLinks: z.string().optional(),
    faqs: z.array(faqSchema),

    gallery: gallerySchema(image),
    beforeAfter: beforeAfterSchema(image),
    asidePhoto: asidePhotoSchema(image),

    relatedHubService: z.string(),
    relatedCityPage: z.string(),
    relatedServices: z.array(z.string()).default([]),
    externalLinks: z.array(externalLinkSchema).default([]),
    ctaHeadline: z.string().optional(),
    ctaSubhead: z.string().optional(),
  }),
});

export const collections = {
  'tree-services': treeServices,
  locations,
  'outdoor-services': outdoorServices,
  'service-city': serviceCity,
};
