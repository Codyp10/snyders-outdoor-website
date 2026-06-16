import { defineField, defineType } from 'sanity';

const TOWNS = [
  'Hagerstown, MD',
  'Greencastle, PA',
  'Waynesboro, PA',
  'Frederick, MD',
  'Martinsburg, WV',
];

const SERVICES = [
  'Tree Removal',
  'Emergency Tree Removal',
  'Storm Damage Cleanup',
  'Tree Trimming & Pruning',
  'Stump Grinding',
  'Lot & Land Clearing',
  'Other',
];

/**
 * A completed job — this is where Dustin uploads work photos.
 * Powers the before/after sections, the per-service galleries, and a
 * future /work proof hub. Hotspot is on for every image so crops stay
 * good at any aspect ratio.
 */
export default defineType({
  name: 'project',
  title: 'Job / Project (photos)',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Job title',
      type: 'string',
      description: 'Short and plain — e.g. "Large oak removal in the North End".',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'town',
      title: 'Town',
      type: 'string',
      options: { list: TOWNS },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'serviceType',
      title: 'Service',
      type: 'string',
      options: { list: SERVICES },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      type: 'text',
      rows: 3,
      description: 'A sentence or two about the job (optional).',
    }),
    defineField({
      name: 'beforeImage',
      title: 'Before photo',
      type: 'image',
      options: { hotspot: true },
      fields: [{ name: 'alt', title: 'Alt text', type: 'string' }],
    }),
    defineField({
      name: 'afterImage',
      title: 'After photo',
      type: 'image',
      options: { hotspot: true },
      fields: [{ name: 'alt', title: 'Alt text', type: 'string' }],
    }),
    defineField({
      name: 'gallery',
      title: 'More photos',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            { name: 'alt', title: 'Alt text', type: 'string' },
            { name: 'caption', title: 'Caption', type: 'string' },
          ],
        },
      ],
      options: { layout: 'grid' },
    }),
    defineField({
      name: 'featured',
      title: 'Feature on homepage?',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: 'title', town: 'town', media: 'afterImage' },
    prepare({ title, town, media }) {
      return { title, subtitle: town, media };
    },
  },
});
