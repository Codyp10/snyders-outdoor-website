/**
 * Short <title> tags for blog posts. H1s and slugs stay the CMS title/URL.
 * Keyword first; keep roughly 60 characters or fewer.
 */
const SEO_TITLES: Record<string, string> = {
  'best-time-to-trim-trees-williamsport-md': 'Best Time to Trim Trees in Williamsport, MD',
  'emergency-tree-removal-williamsport-what-to-do-first':
    'Emergency Tree Removal in Williamsport, MD',
  'lot-land-clearing-washington-county-maryland': 'Lot & Land Clearing in Washington County, MD',
  'storm-damage-cleanup-williamsport-md': 'Storm Damage Cleanup in Williamsport, MD',
  'stump-grinding-vs-stump-removal-williamsport-md':
    'Stump Grinding vs. Removal, Williamsport MD',
  'when-should-tree-be-removed-williamsport-md': 'When to Remove a Tree in Williamsport, MD',
};

const MAX_TITLE = 60;

export function blogSeoTitle(slug: string, title: string): string {
  if (SEO_TITLES[slug]) return SEO_TITLES[slug];
  const branded = `${title} | Snyder's Outdoor Solutions`;
  if (branded.length <= MAX_TITLE) return branded;
  if (title.length <= MAX_TITLE) return title;
  const clipped = title.slice(0, MAX_TITLE - 1);
  const lastSpace = clipped.lastIndexOf(' ');
  return `${(lastSpace > 40 ? clipped.slice(0, lastSpace) : clipped).trimEnd()}…`;
}
