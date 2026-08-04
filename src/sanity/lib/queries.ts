import { loadQuery } from './load-query';

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
export interface BlogPostDoc {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  coverImage?: { asset?: { _ref: string }; alt?: string } | null;
  category?: string;
  publishedAt?: string;
  body?: unknown[];
  featured?: boolean;
}

/**
 * Published blog posts, newest first. Same failure contract as getReviews():
 * a Sanity hiccup returns [] so the static build never breaks — the blog
 * index just shows its empty state.
 */
export async function getBlogPosts(): Promise<BlogPostDoc[]> {
  try {
    return await loadQuery<BlogPostDoc[]>({
      query: `*[_type == "blogPost" && defined(slug.current)] | order(coalesce(publishedAt, "1970-01-01") desc){
        _id, title, "slug": slug.current, excerpt, coverImage, category, publishedAt, body, featured
      }`,
    });
  } catch (err) {
    console.warn('[sanity] blog fetch failed (blog will be empty):', err instanceof Error ? err.message : err);
    return [];
  }
}

export async function getReviews(): Promise<ReviewDoc[]> {
  try {
    return await loadQuery<ReviewDoc[]>({
      query: `*[_type == "review" && consent == true] | order(featured desc, coalesce(date, "1970-01-01") desc){
        _id, name, town, rating, quote, service, date, featured
      }`,
    });
  } catch (err) {
    console.warn('[sanity] reviews fetch failed (section will be hidden):', err instanceof Error ? err.message : err);
    return [];
  }
}
