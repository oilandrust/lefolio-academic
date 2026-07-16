/**
 * Obsidian-style wikilink preprocessing helpers.
 * Build-time resolution lives in scripts/sync-content.mjs;
 * this module documents the syntax and supports optional runtime use.
 */

export function parseWikilink(raw: string): { target: string; alias?: string } | null {
  const match = raw.match(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/);
  if (!match) return null;
  return { target: match[1].trim(), alias: match[2]?.trim() };
}

export function parseEmbed(raw: string): { target: string; width?: number } {
  const [filePart, sizePart] = raw.split('|').map((s) => s.trim());
  const width = sizePart && /^\d+$/.test(sizePart) ? parseInt(sizePart, 10) : undefined;
  return { target: filePart, width };
}

export function normalizeMarkdownSpacing(body: string): string {
  return body
    .replace(/([^\n])\n(#{1,6} )/g, '$1\n\n$2')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}
