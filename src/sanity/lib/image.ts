import { createImageUrlBuilder } from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';
import { sanityClient } from 'sanity:client';

const builder = createImageUrlBuilder(sanityClient);

/** URL builder for Sanity-hosted images (blog covers, inline body images). */
export function urlFor(source: SanityImageSource) {
  return builder.image(source).auto('format');
}
