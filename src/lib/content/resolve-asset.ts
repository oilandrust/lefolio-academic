/**
 * Vault-root asset resolution — mirrored in scripts/resolve-asset.mjs for sync.
 */

import fs from 'fs';
import path from 'path';

const SKIP_INDEX_DIRS = new Set(['.obsidian', '.git', 'node_modules', '.next', 'out']);

export interface ResolveContext {
  vaultRoot: string;
  contentDir: string;
  sourceContentPath: string;
  vaultIndex: Map<string, string[]>;
}

export interface ResolvedAsset {
  vaultPath: string;
}

export function normalizeTarget(target: string): string {
  let normalized = String(target).replace(/\\/g, '/').trim();
  try {
    normalized = decodeURIComponent(normalized);
  } catch {
    // keep raw target
  }
  if (normalized.startsWith('./')) {
    normalized = normalized.slice(2);
  }
  return normalized;
}

export function buildVaultIndex(vaultRoot: string): Map<string, string[]> {
  const index = new Map<string, string[]>();

  function walk(dir: string) {
    let entries: string[];
    try {
      entries = fs.readdirSync(dir);
    } catch {
      return;
    }

    for (const entry of entries) {
      if (entry.startsWith('.')) continue;
      const fullPath = path.join(dir, entry);
      let stat: fs.Stats;
      try {
        stat = fs.statSync(fullPath);
      } catch {
        continue;
      }

      if (stat.isDirectory()) {
        if (SKIP_INDEX_DIRS.has(entry)) continue;
        walk(fullPath);
      } else {
        const relativePath = path.relative(vaultRoot, fullPath).replace(/\\/g, '/');
        const basename = path.basename(relativePath);
        const stem = basename.replace(/\.[^.]+$/, '');
        for (const key of [basename, stem]) {
          if (!index.has(key)) index.set(key, []);
          index.get(key)!.push(relativePath);
        }
      }
    }
  }

  if (fs.existsSync(vaultRoot)) walk(vaultRoot);
  return index;
}

export function sourceVaultPath(
  vaultRoot: string,
  contentDir: string,
  sourceContentPath: string
): string {
  if (!sourceContentPath) {
    return path.relative(vaultRoot, contentDir).replace(/\\/g, '/');
  }
  return path
    .relative(vaultRoot, path.join(contentDir, sourceContentPath))
    .replace(/\\/g, '/');
}

function isFile(absolutePath: string): boolean {
  try {
    return fs.existsSync(absolutePath) && fs.statSync(absolutePath).isFile();
  } catch {
    return false;
  }
}

export function resolveAsset(target: string, ctx: ResolveContext): ResolvedAsset | null {
  const { vaultRoot, contentDir, sourceContentPath, vaultIndex } = ctx;
  const normalized = normalizeTarget(target);
  if (!normalized) return null;

  const sourceVault = sourceVaultPath(vaultRoot, contentDir, sourceContentPath);
  const sourceVaultDir = path.posix.dirname(sourceVault);
  const contentVaultPrefix = path.relative(vaultRoot, contentDir).replace(/\\/g, '/');

  const candidates: string[] = [normalized, path.posix.join(sourceVaultDir, normalized)];

  if (contentVaultPrefix && contentVaultPrefix !== '.') {
    candidates.push(path.posix.join(contentVaultPrefix, normalized));
  } else {
    candidates.push(normalized);
  }

  for (const candidate of candidates) {
    const absolute = path.join(vaultRoot, candidate);
    if (isFile(absolute)) {
      return { vaultPath: candidate.replace(/\\/g, '/') };
    }
  }

  const withMd = normalized.endsWith('.md') ? normalized : `${normalized}.md`;
  for (const candidate of [normalized, withMd]) {
    const matches = vaultIndex.get(path.basename(candidate)) || vaultIndex.get(candidate);
    if (matches?.length === 1) {
      return { vaultPath: matches[0] };
    }
    if (matches && matches.length > 1) {
      const sameDir = matches.filter((m) => path.posix.dirname(m) === sourceVaultDir);
      if (sameDir.length === 1) {
        return { vaultPath: sameDir[0] };
      }
      if (contentVaultPrefix && contentVaultPrefix !== '.') {
        const inContent = matches.filter(
          (m) => m === contentVaultPrefix || m.startsWith(`${contentVaultPrefix}/`)
        );
        if (inContent.length === 1) {
          return { vaultPath: inContent[0] };
        }
      }
      return { vaultPath: [...matches].sort((a, b) => a.length - b.length)[0] };
    }
  }

  return null;
}

export function vaultPathToContentPath(
  vaultPath: string,
  vaultRoot: string,
  contentDir: string
): string | null {
  const absolute = path.resolve(vaultRoot, vaultPath);
  const rel = path.relative(contentDir, absolute);
  if (rel.startsWith('..') || path.isAbsolute(rel)) {
    return null;
  }
  return rel.replace(/\\/g, '/');
}

export function copyAssetFromVault(
  vaultPath: string,
  vaultRoot: string,
  assetsOutDir: string,
  assetMap: Record<string, string>
): string | null {
  const source = path.join(vaultRoot, vaultPath);
  if (!isFile(source)) return null;

  const publicRelative = vaultPath.replace(/\\/g, '/');
  const dest = path.join(assetsOutDir, publicRelative);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(source, dest);

  const publicPath = `/content-assets/${publicRelative.split('/').map(encodeURIComponent).join('/')}`;
  assetMap[vaultPath] = publicPath;
  return publicPath;
}
