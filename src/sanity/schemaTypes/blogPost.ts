import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'blogPost',
  title: 'Blog / Resource Post',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      description: 'The web address for this post. Click "Generate" to make it from the title.',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Short summary',
      type: 'text',
      rows: 3,
      description: 'One or two sentences shown in listings and Google results.',
      validation: (r) => r.max(200),
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover image',
      type: 'image',
      options: { hotspot: true },
      fields: [{ name: 'alt', title: 'Alt text', type: 'string' }],
    }),
    defineField({
      name: 'category',
      type: 'string',
      options: {
        list: ['Tree Care Tips', 'Storm & Emergency', 'Cost Guides', 'Seasonal', 'Local Info'],
      },
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published date',
      type: 'datetime',
    }),
    defineField({
      name: 'body',
      title: 'Article body',
      type: 'blockContent',
    }),
    defineField({
      name: 'featured',
      title: 'Feature on homepage?',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'category', media: 'coverImage' },
  },
});
