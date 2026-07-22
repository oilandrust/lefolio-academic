/**
 * @deprecated Use copyAssetFromVault from ./resolve-asset instead.
 */
import path from 'path';
import { copyAssetFromVault } from './resolve-asset';

const IMAGE_EXT = new Set(['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg']);

export function isImagePath(filePath: string): boolean {
  return IMAGE_EXT.has(path.extname(filePath).toLowerCase());
}

export function copyAsset(
  contentDir: string,
  assetsOutDir: string,
  relativePath: string,
  assetMap: Record<string, string>
): string | null {
  return copyAssetFromVault(relativePath, contentDir, assetsOutDir, assetMap);
}
