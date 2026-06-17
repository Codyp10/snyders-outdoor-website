import type { ClientPerspective, QueryParams } from '@sanity/client';
import { sanityClient } from 'sanity:client';

/**
 * One loader for both modes:
 *  - Production (flag off): reads PUBLISHED content, no stega → clean static HTML.
 *  - Preview build (flag on): reads DRAFTS with a token + stega encoding so the
 *    Presentation tool's overlays can map each string back to its field.
 * The flag is only ever "true" on the dedicated preview deployment.
 */
const visualEditingEnabled = import.meta.env.PUBLIC_SANITY_VISUAL_EDITING_ENABLED === 'true';
const token = import.meta.env.SANITY_API_READ_TOKEN;

interface LoadQueryArgs {
  query: string;
  params?: QueryParams;
}

export async function loadQuery<T>({ query, params = {} }: LoadQueryArgs): Promise<T> {
  if (visualEditingEnabled && !token) {
    throw new Error(
      'Visual editing is enabled but SANITY_API_READ_TOKEN is missing — add it to the preview deployment env.'
    );
  }

  const perspective: ClientPerspective = visualEditingEnabled ? 'drafts' : 'published';

  const { result } = await sanityClient.fetch<T>(query, params, {
    filterResponse: false,
    perspective,
    resultSourceMap: visualEditingEnabled ? 'withKeyArraySelector' : false,
    stega: visualEditingEnabled,
    ...(visualEditingEnabled ? { token } : {}),
  });

  return result;
}
