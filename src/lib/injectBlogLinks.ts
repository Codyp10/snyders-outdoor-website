/**
 * Inject in-body contextual links into Sanity portable-text blocks.
 * Blog posts were authored with "[INTERNAL LINK: …]" placeholders and
 * unlinked service-page mentions; this turns those into real anchors
 * at render time so the HTML carries the links even without a CMS patch.
 *
 * Target: 2–4 in-body contextual links per post (service-area + service pages).
 * Extra CMS links to other /tree-services/* or /service-areas/* paths are
 * unwrapped to plain text so the cap holds.
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

/** Paths each post is allowed to keep/add. Area links from the prior pass plus the service pages this pass requires. */
const KEEP_BY_SLUG: Record<string, string[]> = {
  'best-time-to-trim-trees-williamsport-md': [
    '/service-areas/williamsport-md',
    '/tree-services/tree-trimming-pruning',
    '/tree-services/tree-removal',
  ],
  'emergency-tree-removal-williamsport-what-to-do-first': [
    '/service-areas/williamsport-md',
    '/tree-services/emergency-tree-removal',
    '/tree-services/storm-damage-cleanup',
  ],
  'storm-damage-cleanup-williamsport-md': [
    '/service-areas/williamsport-md',
    '/tree-services/storm-damage-cleanup',
    '/tree-services/emergency-tree-removal',
  ],
  'when-should-tree-be-removed-williamsport-md': [
    '/service-areas/williamsport-md',
    '/tree-services/tree-removal',
    '/tree-services/stump-grinding',
  ],
  'stump-grinding-vs-stump-removal-williamsport-md': [
    '/service-areas/williamsport-md',
    '/tree-services/stump-grinding',
    '/tree-services/tree-removal',
  ],
  'lot-land-clearing-washington-county-maryland': [
    '/service-areas/williamsport-md',
    '/service-areas/hagerstown-md',
    '/tree-services/lot-land-clearing',
  ],
};

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
    {
      find: 'free estimate for emergency tree removal',
      href: '/tree-services/emergency-tree-removal',
    },
    {
      find: 'storm-damage cleanup, or related tree work',
      href: '/tree-services/storm-damage-cleanup',
      display: 'storm-damage cleanup',
    },
  ],
  'storm-damage-cleanup-williamsport-md': [
    {
      find: 'Emergency tree removal',
      href: '/tree-services/emergency-tree-removal',
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
    {
      find: 'which tree is being removed',
      href: '/tree-services/tree-removal',
    },
    {
      find: 'grinding the stump',
      href: '/tree-services/stump-grinding',
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

function normalizePath(href: string): string | null {
  try {
    const path = href.startsWith('/')
      ? href.split('?')[0]
      : new URL(href).pathname;
    return path.replace(/\/$/, '') || '/';
  } catch {
    return null;
  }
}

function isContextualPath(path: string): boolean {
  return path.startsWith('/tree-services/') || path.startsWith('/service-areas/');
}

function existingContextualPaths(blocks: Block[]): Set<string> {
  const found = new Set<string>();
  for (const block of blocks) {
    const used = new Set<string>();
    for (const span of block.children ?? []) {
      for (const mark of span.marks ?? []) used.add(mark);
    }
    for (const def of block.markDefs ?? []) {
      if (def._type !== 'link' || !def.href || !used.has(def._key)) continue;
      const path = normalizePath(def.href);
      if (path && isContextualPath(path)) found.add(path);
    }
  }
  return found;
}

function applyLinks(blocks: Block[], links: TextLink[]): Block[] {
  let n = 0;
  const nextKey = () => `ctxlink${n++}`;

  return blocks.map((block) => {
    if (block._type !== 'block' || !block.children?.length) return block;

    const markDefs = [...(block.markDefs ?? [])];
    let children = [...block.children];
    let remainingLinks = [...links];
    let changed = false;

    // Search concatenated span text so a phrase split across marks still matches.
    while (remainingLinks.length) {
      let full = '';
      for (const span of children) {
        if (span._type === 'span' && span.text) full += span.text;
      }

      let earliest = -1;
      let hit: TextLink | undefined;
      for (const link of remainingLinks) {
        const i = full.indexOf(link.find);
        if (i !== -1 && (earliest === -1 || i < earliest)) {
          earliest = i;
          hit = link;
        }
      }
      if (!hit || earliest < 0) break;

      const matchEnd = earliest + hit.find.length;
      const key = nextKey();
      markDefs.push({ _key: key, _type: 'link', href: hit.href });

      const next: Span[] = [];
      let offset = 0;
      let replaced = false;
      for (const span of children) {
        if (span._type !== 'span' || !span.text) {
          next.push(span);
          continue;
        }
        const start = offset;
        const end = offset + span.text.length;
        offset = end;
        if (end <= earliest || start >= matchEnd) {
          next.push(span);
          continue;
        }
        const localStart = Math.max(0, earliest - start);
        const localEnd = Math.min(span.text.length, matchEnd - start);
        if (localStart > 0) {
          next.push({ ...span, text: span.text.slice(0, localStart) });
        }
        if (!replaced) {
          next.push({
            _type: 'span',
            text: hit.display ?? hit.find,
            marks: [...(span.marks ?? []), key],
          });
          replaced = true;
        }
        if (localEnd < span.text.length) {
          next.push({ ...span, text: span.text.slice(localEnd) });
        }
      }

      children = next;
      remainingLinks = remainingLinks.filter((l) => l !== hit);
      changed = true;
    }

    if (!changed) return block;
    return { ...block, children, markDefs };
  });
}

/** Replace leftover "[INTERNAL LINK: …]" tokens with readable unlinked text. */
function stripPlaceholders(blocks: Block[], placeholders: TextLink[]): Block[] {
  return blocks.map((block) => {
    if (block._type !== 'block' || !block.children?.length) return block;
    let changed = false;
    const children = block.children.map((span) => {
      if (span._type !== 'span' || !span.text) return span;
      let text = span.text;
      for (const p of placeholders) {
        if (text.includes(p.find)) {
          text = text.split(p.find).join(p.display ?? p.find);
          changed = true;
        }
      }
      return changed ? { ...span, text } : span;
    });
    return changed ? { ...block, children } : block;
  });
}

/**
 * Unwrap contextual links whose path is not in `keep`, and keep only the
 * first occurrence of each allowed path so a post cannot exceed the cap.
 */
function unwrapExtraContextualLinks(blocks: Block[], keep: Set<string>): Block[] {
  const seen = new Set<string>();

  return blocks.map((block) => {
    if (block._type !== 'block') return block;
    const drop = new Set<string>();
    const markDefs = [...(block.markDefs ?? [])];

    for (const def of markDefs) {
      if (def._type !== 'link' || !def.href) continue;
      const path = normalizePath(def.href);
      if (!path || !isContextualPath(path)) continue;
      const extra = !keep.has(path) || seen.has(path);
      if (extra) drop.add(def._key);
      else seen.add(path);
    }

    if (!drop.size) return block;

    const children = (block.children ?? []).map((span) => {
      if (!span.marks?.some((m) => drop.has(m))) return span;
      return { ...span, marks: span.marks.filter((m) => !drop.has(m)) };
    });
    return {
      ...block,
      children,
      markDefs: markDefs.filter((d) => !drop.has(d._key)),
    };
  });
}

export function injectBlogLinks(slug: string, body: unknown[]): unknown[] {
  const keepList = KEEP_BY_SLUG[slug] ?? [];
  const keep = new Set(keepList);
  let blocks = unwrapExtraContextualLinks(body as Block[], keep);

  const missing = () => {
    const present = existingContextualPaths(blocks);
    return keepList.filter((href) => !present.has(href));
  };

  const placeholderAdds = PLACEHOLDERS.filter((p) => missing().includes(p.href));
  if (placeholderAdds.length) {
    blocks = applyLinks(blocks, placeholderAdds);
  }

  blocks = stripPlaceholders(blocks, PLACEHOLDERS);

  const slugAdds = (BY_SLUG[slug] ?? []).filter((l) => missing().includes(l.href));
  if (slugAdds.length) {
    blocks = applyLinks(blocks, slugAdds);
  }

  return unwrapExtraContextualLinks(blocks, keep);
}
