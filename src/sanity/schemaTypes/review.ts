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

export default defineType({
  name: 'review',
  title: 'Customer Review',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Customer name',
      type: 'string',
      description: 'First name + last initial is fine (e.g. "Karen M.").',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'town',
      title: 'Town',
      type: 'string',
      options: { list: TOWNS },
      description: 'Which service area this customer is in — used to show the review on that town page.',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'rating',
      title: 'Star rating',
      type: 'number',
      options: { list: [1, 2, 3, 4, 5] },
      initialValue: 5,
      validation: (r) => r.required().min(1).max(5),
    }),
    defineField({
      name: 'quote',
      title: 'Review',
      type: 'text',
      rows: 4,
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'service',
      title: 'Service (optional)',
      type: 'string',
      options: { list: SERVICES },
      description: 'If this review is about a specific job, tag it so it can show on that service page.',
    }),
    defineField({
      name: 'date',
      title: 'Date of review',
      type: 'date',
    }),
    defineField({
      name: 'featured',
      title: 'Feature on homepage?',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'consent',
      title: 'Customer gave permission to publish',
      type: 'boolean',
      description: 'Only publish reviews the customer agreed to share publicly. Required.',
      initialValue: true,
      validation: (r) => r.required(),
    }),
  ],
  preview: {
    select: { title: 'name', town: 'town', rating: 'rating' },
    prepare({ title, town, rating }) {
      const stars = '★'.repeat(rating || 0);
      return { title, subtitle: `${stars}  ·  ${town || ''}` };
    },
  },
});
