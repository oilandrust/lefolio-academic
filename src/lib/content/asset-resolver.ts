import fs from 'fs';
import path from 'path';

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
  const source = path.join(contentDir, relativePath);
  if (!fs.existsSync(source)) return null;

  const publicRelative = relativePath.replace(/\\/g, '/');
  const dest = path.join(assetsOutDir, publicRelative);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(source, dest);

  const publicPath = `/content-assets/${publicRelative.split('/').map(encodeURIComponent).join('/')}`;
  assetMap[relativePath] = publicPath;
  return publicPath;
}
