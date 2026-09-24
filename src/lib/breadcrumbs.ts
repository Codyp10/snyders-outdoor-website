export interface Crumb {
  name: string;
  url: string;
}

const SEGMENT_LABELS: Record<string, string> = {
  about: 'About',
  contact: 'Contact',
  blog: 'Blog',
  privacy: 'Privacy Policy',
  terms: 'Terms of Service',
  'tree-services': 'Tree Services',
  'service-areas': 'Service Areas',
  'outdoor-services': 'Outdoor Services',
  'tree-removal': 'Tree Removal',
  'emergency-tree-removal': 'Emergency Tree Removal',
  'storm-damage-cleanup': 'Storm Damage Cleanup',
  'tree-trimming-pruning': 'Tree Trimming & Pruning',
  'stump-grinding': 'Stump Grinding',
  'lot-land-clearing': 'Lot & Land Clearing',
  'williamsport-md': 'Williamsport, MD',
  'hagerstown-md': 'Hagerstown, MD',
  'greencastle-pa': 'Greencastle, PA',
  'waynesboro-pa': 'Waynesboro, PA',
  'frederick-md': 'Frederick, MD',
  'martinsburg-wv': 'Martinsburg, WV',
};

function humanize(segment: string): string {
  if (SEGMENT_LABELS[segment]) return SEGMENT_LABELS[segment];
  return segment
    .split('-')
    .map((word) => (word.length <= 2 ? word.toUpperCase() : word.charAt(0).toUpperCase() + word.slice(1)))
    .join(' ');
}

export function breadcrumbsFromPath(pathname: string, site: string | URL): Crumb[] {
  const parts = pathname.split('/').filter(Boolean);
  const crumbs: Crumb[] = [{ name: 'Home', url: new URL('/', site).toString() }];
  let acc = '';
  for (const part of parts) {
    acc += `/${part}`;
    crumbs.push({ name: humanize(part), url: new URL(acc, site).toString() });
  }
  return crumbs;
}

export function isHomePath(pathname: string): boolean {
  return pathname === '/' || pathname === '';
}
