/**
 * Minimal markdown for frontmatter strings (links, bold, italic, paragraphs).
 * Existing service/location layouts dump frontmatter as HTML without parsing
 * markdown; service×city copy includes inline links, so we render them here.
 */

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function formatInline(escaped: string): string {
  const withLinks = escaped.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_match, label: string, href: string) => {
    const safeHref = href.replace(/"/g, '&quot;');
    const isExternal = /^https?:\/\//i.test(href);
    const extra = isExternal ? ' target="_blank" rel="noopener noreferrer"' : '';
    return `<a href="${safeHref}"${extra}>${label}</a>`;
  });

  return withLinks
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '<em>$1</em>');
}

/** Inline-only (FAQ answers, single sentences). */
export function renderInlineMarkdown(text: string): string {
  return formatInline(escapeHtml(text));
}

/** Split on blank lines into sibling paragraphs (no wrapping &lt;p&gt;). */
export function renderMarkdownParagraphs(text: string): string {
  return text
    .split(/\n\n+/)
    .map((block) => formatInline(escapeHtml(block.trim())).replace(/\n/g, ' '))
    .filter(Boolean)
    .join('</p><p>');
}

/** Plain text for JSON-LD (strip link/emphasis markup). */
export function stripMarkdown(text: string): string {
  return text
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1');
}
