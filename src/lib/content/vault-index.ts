/**
 * Vault index for Obsidian-style link resolution.
 * Implementation lives in resolve-asset.ts (mirrored in scripts/resolve-asset.mjs).
 */

import { resolveAsset } from './resolve-asset';

export {
  buildVaultIndex,
  resolveAsset,
  vaultPathToContentPath,
  copyAssetFromVault,
  sourceVaultPath,
  normalizeTarget,
  type ResolveContext,
  type ResolvedAsset,
} from './resolve-asset';

/** @deprecated Use resolveAsset() with a ResolveContext instead. */
export function resolveVaultPath(
  target: string,
  sourceFile: string,
  contentDir: string,
  index: Map<string, string[]>
): string | null {
  const resolved = resolveAsset(target, {
    vaultRoot: contentDir,
    contentDir,
    sourceContentPath: sourceFile,
    vaultIndex: index,
  });
  return resolved?.vaultPath ?? null;
}
