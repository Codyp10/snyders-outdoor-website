import type { CollectionEntry } from 'astro:content';

/**
 * Crawlable labels for service×city pages. New markdown files in
 * src/content/service-city are picked up automatically. PRIORITY only
 * controls order for the pages that already exist.
 */
const SERVICE_ANCHORS: Record<string, string> = {
  'tree-removal': 'Tree removal',
  'emergency-tree-removal': 'Emergency tree removal',
  'stump-grinding': 'Stump grinding',
  'storm-damage-cleanup': 'Storm damage cleanup',
  'tree-trimming-pruning': 'Tree trimming and pruning',
  'lot-land-clearing': 'Lot and land clearing',
};

const PRIORITY = [
  'tree-removal-frederick-md',
  'emergency-tree-removal-frederick-md',
  'stump-grinding-frederick-md',
  'tree-removal-hagerstown-md',
];

export interface ServiceCityLink {
  id: string;
  label: string;
  href: string;
  serviceSlug: string;
  citySlug: string;
  description: string;
  heroImage: CollectionEntry<'service-city'>['data']['heroImage'];
  heroAlt: string;
}

export function serviceCityLinks(entries: CollectionEntry<'service-city'>[]): ServiceCityLink[] {
  return entries
    .map((entry) => {
      const service = SERVICE_ANCHORS[entry.data.serviceSlug] ?? entry.data.title.split(' in ')[0];
      return {
        id: entry.id,
        label: `${service} in ${entry.data.city}, ${entry.data.state}`,
        href: `/tree-services/${entry.data.serviceSlug}/${entry.data.citySlug}`,
        serviceSlug: entry.data.serviceSlug,
        citySlug: entry.data.citySlug,
        description: cardDescription(entry),
        heroImage: entry.data.heroImage,
        heroAlt: entry.data.heroAlt,
      };
    })
    .sort((a, b) => {
      const ai = PRIORITY.indexOf(a.id);
      const bi = PRIORITY.indexOf(b.id);
      const ar = ai === -1 ? Number.MAX_SAFE_INTEGER : ai;
      const br = bi === -1 ? Number.MAX_SAFE_INTEGER : bi;
      if (ar !== br) return ar - br;
      return a.label.localeCompare(b.label);
    });
}

function cardDescription(entry: CollectionEntry<'service-city'>): string {
  const place = entry.data.county
    ? `${entry.data.city} and ${entry.data.county}`
    : `${entry.data.city}, ${entry.data.state}`;
  switch (entry.data.serviceSlug) {
    case 'tree-removal':
      return `Residential tree removal in ${place}, with cleanup and a free on-site estimate.`;
    case 'stump-grinding':
      return `Stump grinding in ${place}. Chip removal is included. Free on-site estimates.`;
    case 'emergency-tree-removal':
      return `24/7 emergency tree removal in ${place} when a tree is on a home, car, or driveway.`;
    default:
      return entry.data.metaDescription;
  }
}

export const serviceCityIcon: Record<string, 'axe' | 'alert' | 'wind' | 'scissors' | 'disc' | 'trees'> = {
  'tree-removal': 'axe',
  'emergency-tree-removal': 'alert',
  'storm-damage-cleanup': 'wind',
  'tree-trimming-pruning': 'scissors',
  'stump-grinding': 'disc',
  'lot-land-clearing': 'trees',
};
