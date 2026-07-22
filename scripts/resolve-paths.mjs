import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const ENGINE_ROOT = path.join(__dirname, '..');
export const MANIFEST_PATH = path.join(ENGINE_ROOT, '.content', 'manifest.json');
export const ENGINE_META_PATH = path.join(ENGINE_ROOT, '.content', 'engine.json');
export const SENTINEL_PATH = path.join(ENGINE_ROOT, 'src', 'lib', 'content', 'content-version.ts');
export const ASSETS_OUT = path.join(ENGINE_ROOT, 'public', 'content-assets');

const DEFAULT_CONTENT_DIR = path.join(ENGINE_ROOT, 'Content');

/**
 * Resolve content root from --content flag or LEFOLIO_CONTENT env.
 * Defaults to ENGINE_ROOT/Content for backward compatibility.
 */
export function resolveContentDir(argv = process.argv) {
  const flagIndex = argv.indexOf('--content');
  if (flagIndex !== -1 && argv[flagIndex + 1]) {
    return path.resolve(argv[flagIndex + 1]);
  }
  if (process.env.LEFOLIO_CONTENT) {
    return path.resolve(process.env.LEFOLIO_CONTENT);
  }
  return DEFAULT_CONTENT_DIR;
}

export const CONTENT_DIR = resolveContentDir();

export function contentEnv(argv = process.argv) {
  const dir = resolveContentDir(argv);
  return {
    ...process.env,
    LEFOLIO_CONTENT: dir,
  };
}

export function readEngineMeta() {
  if (!fs.existsSync(ENGINE_META_PATH)) {
    return null;
  }
  return JSON.parse(fs.readFileSync(ENGINE_META_PATH, 'utf8'));
}
