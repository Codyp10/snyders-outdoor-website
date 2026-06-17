import { sanityClient } from 'sanity:client';

export interface ReviewDoc {
  _id: string;
  name: string;
  town: string;
  rating: number;
  quote: string;
  service?: string;
  date?: string;
  featured?: boolean;
}

/**
 * Published, consented reviews — featured first, then newest.
 * Wrapped so a Sanity hiccup (or missing read access) NEVER breaks the
 * static build: it just returns [] and the reviews section hides itself.
 */
export async function getReviews(): Promise<ReviewDoc[]> {
  try {
    return await sanityClient.fetch<ReviewDoc[]>(
      `*[_type == "review" && consent == true] | order(featured desc, coalesce(date, "1970-01-01") desc){
        _id, name, town, rating, quote, service, date, featured
      }`
    );
  } catch (err) {
    console.warn('[sanity] reviews fetch failed (section will be hidden):', err instanceof Error ? err.message : err);
    return [];
  }
}
