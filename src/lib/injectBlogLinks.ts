/**
 * Inject in-body contextual links into Sanity portable-text blocks.
 * Blog posts were authored with "[INTERNAL LINK: …]" placeholders and
 * unlinked service-page mentions; this turns those into real anchors
 * at render time so the HTML carries the links even without a CMS patch.
 */

interface Span {
  _type: string;
  text?: string;
  marks?: string[];
}

interface MarkDef {
  _key: string;
  _type: string;
  href?: string;
}

interface Block {
  _type: string;
  children?: Span[];
  markDefs?: MarkDef[];
  [key: string]: unknown;
}

export interface TextLink {
  find: string;
  href: string;
  /** Linked text. Defaults to the matched `find` string. */
  display?: string;
}

const PLACEHOLDERS: TextLink[] = [
  {
    find: '[INTERNAL LINK: Emergency Tree Removal service page]',
    href: '/tree-services/emergency-tree-removal',
    display: 'emergency tree removal',
  },
  {
    find: '[INTERNAL LINK: Storm Damage Cleanup service page]',
    href: '/tree-services/storm-damage-cleanup',
    display: 'storm damage cleanup',
  },
  {
    find: '[INTERNAL LINK: Tree Removal service page]',
    href: '/tree-services/tree-removal',
    display: 'tree removal',
  },
  {
    find: '[INTERNAL LINK: Tree Trimming and Pruning service page]',
    href: '/tree-services/tree-trimming-pruning',
    display: 'tree trimming and pruning',
  },
  {
    find: '[INTERNAL LINK: Stump Grinding service page]',
    href: '/tree-services/stump-grinding',
    display: 'stump grinding',
  },
];

const BY_SLUG: Record<string, TextLink[]> = {
  'best-time-to-trim-trees-williamsport-md': [
    {
      find: 'In Williamsport and Washington County',
      href: '/service-areas/williamsport-md',
      display: 'In Williamsport, MD, and Washington County',
    },
    {
      find: 'tree trimming, pruning, and related tree services',
      href: '/tree-services/tree-trimming-pruning',
    },
    {
      find: 'See Tree Removal service page',
      href: '/tree-services/tree-removal',
      display: 'See our tree removal service',
    },
  ],
  'emergency-tree-removal-williamsport-what-to-do-first': [
    {
      find: 'Williamsport and Washington County can experience',
      href: '/service-areas/williamsport-md',
      display: 'Williamsport, MD, and Washington County can experience',
    },
  ],
  'storm-damage-cleanup-williamsport-md': [
    {
      find: 'Once emergency, utility, and structural hazards',
      href: '/tree-services/emergency-tree-removal',
      display: 'Once emergency tree removal, utility, and structural hazards',
    },
    {
      find: 'your Williamsport-area property',
      href: '/service-areas/williamsport-md',
    },
    {
      find: 'Visit  Storm Damage Cleanup',
      href: '/tree-services/storm-damage-cleanup',
      display: 'Visit our storm damage cleanup service',
    },
  ],
  'when-should-tree-be-removed-williamsport-md': [
    {
      find: 'your Williamsport-area property',
      href: '/service-areas/williamsport-md',
    },
  ],
  'stump-grinding-vs-stump-removal-williamsport-md': [
    {
      find: 'The right choice for a Williamsport property',
      href: '/service-areas/williamsport-md',
      display: 'The right choice for a Williamsport, MD property',
    },
    {
      find: 'coordinated with Tree Removal service',
      href: '/tree-services/tree-removal',
      display: 'coordinated with our tree removal service',
    },
    {
      find: 'Learn more at Stump Grinding',
      href: '/tree-services/stump-grinding',
      display: 'Learn more about our stump grinding service',
    },
  ],
  'lot-land-clearing-washington-county-maryland': [
    {
      find: 'Inside the Town of Williamsport',
      href: '/service-areas/williamsport-md',
    },
    {
      find: 'For property under Washington County jurisdiction',
      href: '/service-areas/hagerstown-md',
      display: 'For property in Hagerstown or elsewhere under Washington County jurisdiction',
    },
    {
      find: 'Visit Lot and Land Clearing service page',
      href: '/tree-services/lot-land-clearing',
      display: 'Visit our lot and land clearing service',
    },
  ],
};

function applyLinks(blocks: Block[], links: TextLink[]): Block[] {
  let n = 0;
  const nextKey = () => `ctxlink${n++}`;

  return blocks.map((block) => {
    if (block._type !== 'block' || !block.children?.length) return block;

    const markDefs = [...(block.markDefs ?? [])];
    const children: Span[] = [];
    let changed = false;

    for (const span of block.children) {
      if (span._type !== 'span' || !span.text) {
        children.push(span);
        continue;
      }

      let remaining = span.text;
      const pieces: Span[] = [];

      while (remaining.length) {
        let earliest = -1;
        let hit: TextLink | undefined;
        for (const link of links) {
          const i = remaining.indexOf(link.find);
          if (i !== -1 && (earliest === -1 || i < earliest)) {
            earliest = i;
            hit = link;
          }
        }
        if (!hit || earliest < 0) {
          pieces.push({ ...span, text: remaining });
          break;
        }
        if (earliest > 0) {
          pieces.push({ ...span, text: remaining.slice(0, earliest) });
        }
        const key = nextKey();
        markDefs.push({ _key: key, _type: 'link', href: hit.href });
        pieces.push({
          _type: 'span',
          text: hit.display ?? hit.find,
          marks: [...(span.marks ?? []), key],
        });
        remaining = remaining.slice(earliest + hit.find.length);
        changed = true;
      }

      children.push(...pieces);
    }

    if (!changed) return block;
    return { ...block, children, markDefs };
  });
}

export function injectBlogLinks(slug: string, body: unknown[]): unknown[] {
  const links = [...PLACEHOLDERS, ...(BY_SLUG[slug] ?? [])];
  return applyLinks(body as Block[], links);
}
