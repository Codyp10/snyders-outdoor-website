import { defineField, defineType } from 'sanity';

/**
 * Global business info (NAP). Create exactly ONE of these.
 * Lets the business phone/address/hours be edited without code.
 * The website still has business.json as a fallback until this is wired.
 */
export default defineType({
  name: 'siteSettings',
  title: 'Business Info',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Business name', type: 'string' }),
    defineField({
      name: 'phone',
      title: 'Phone (display format)',
      type: 'string',
      description: 'e.g. (301) 288-1677',
    }),
    defineField({ name: 'email', type: 'string' }),
    defineField({ name: 'street', title: 'Street address', type: 'string' }),
    defineField({ name: 'city', type: 'string' }),
    defineField({ name: 'region', title: 'State', type: 'string' }),
    defineField({ name: 'postalCode', title: 'ZIP code', type: 'string' }),
    defineField({
      name: 'gbpUrl',
      title: 'Google Business Profile URL',
      type: 'url',
      description: 'Link to your Google listing — used for the "Leave a review" button.',
    }),
    defineField({
      name: 'hours',
      title: 'Hours',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'One line per row, e.g. "Mon–Fri: 7am–5pm".',
    }),
    defineField({
      name: 'social',
      title: 'Social / profile links',
      type: 'array',
      of: [{ type: 'url' }],
      description: 'Facebook, Google, BBB, etc.',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Business Info' };
    },
  },
});
