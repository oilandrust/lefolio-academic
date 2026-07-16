/**
 * Vault index for Obsidian-style link resolution.
 * Used at build time by scripts/sync-content.mjs (mirrored logic).
 */

import fs from 'fs';
import path from 'path';

export function buildVaultIndex(rootDir: string): Map<string, string[]> {
  const index = new Map<string, string[]>();

  function walk(dir: string) {
    for (const entry of fs.readdirSync(dir)) {
      if (entry.startsWith('.')) continue;
      const fullPath = path.join(dir, entry);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        walk(fullPath);
      } else {
        const relativePath = path.relative(rootDir, fullPath).replace(/\\/g, '/');
        const basename = path.basename(relativePath);
        const stem = basename.replace(/\.[^.]+$/, '');
        for (const key of [basename, stem]) {
          if (!index.has(key)) index.set(key, []);
          index.get(key)!.push(relativePath);
        }
      }
    }
  }

  if (fs.existsSync(rootDir)) walk(rootDir);
  return index;
}

export function resolveVaultPath(
  target: string,
  sourceFile: string,
  contentDir: string,
  index: Map<string, string[]>
): string | null {
  const normalized = target.replace(/\\/g, '/');
  if (normalized.includes('/')) {
    const full = path.join(contentDir, normalized);
    return fs.existsSync(full) ? normalized : null;
  }

  const withMd = normalized.endsWith('.md') ? normalized : `${normalized}.md`;
  for (const candidate of [normalized, withMd]) {
    const matches = index.get(path.basename(candidate)) || index.get(candidate);
    if (matches?.length === 1) return matches[0];
    if (matches && matches.length > 1) {
      const sourceDir = path.dirname(sourceFile).replace(/\\/g, '/');
      const sameDir = matches.filter((m) => path.dirname(m) === sourceDir);
      if (sameDir.length === 1) return sameDir[0];
      return [...matches].sort((a, b) => a.length - b.length)[0];
    }
    const direct = path.join(contentDir, candidate);
    if (fs.existsSync(direct)) return candidate;
  }
  return null;
}
