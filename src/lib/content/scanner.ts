import fs from 'fs';
import path from 'path';
import fg from 'fast-glob';
import matter from 'gray-matter';
import type { PageFrontmatter } from './types';

const SKIP_DIRS = new Set(['Assets', '.obsidian']);

export interface ScannedPage {
  section: string;
  slug: string;
  relativePath: string;
  frontmatter: PageFrontmatter;
  body: string;
}

function slugify(name: string): string {
  return name
    .replace(/\.md$/i, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function scanContentPages(contentDir: string): ScannedPage[] {
  const sections = fg
    .sync('*', { cwd: contentDir, onlyDirectories: true })
    .filter((d) => !SKIP_DIRS.has(d) && !d.startsWith('.'));

  const pages: ScannedPage[] = [];
  for (const section of sections) {
    const files = fg.sync('**/*.md', { cwd: path.join(contentDir, section) });
    for (const file of files) {
      const relativePath = `${section}/${file}`.replace(/\\/g, '/');
      const fullPath = path.join(contentDir, relativePath);
      const parsed = matter(fs.readFileSync(fullPath, 'utf8'));
      const baseSlug = slugify(path.basename(file));
      const slug = (parsed.data.permalink as string | undefined) || baseSlug;
      pages.push({
        section,
        slug,
        relativePath,
        frontmatter: parsed.data as PageFrontmatter,
        body: parsed.content.trim(),
      });
    }
  }
  return pages;
}
