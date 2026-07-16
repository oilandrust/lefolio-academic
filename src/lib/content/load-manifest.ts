import fs from 'fs';
import path from 'path';
import type { ContentManifest } from './types';

const MANIFEST_PATH = path.join(process.cwd(), '.content', 'manifest.json');

export function loadManifest(): ContentManifest {
  const raw = fs.readFileSync(MANIFEST_PATH, 'utf8');
  return JSON.parse(raw) as ContentManifest;
}

export function getPage(section: string, slug: string) {
  const manifest = loadManifest();
  return manifest.pages.find((p) => p.section === section && p.slug === slug) ?? null;
}

export function getAllPageParams() {
  const manifest = loadManifest();
  return manifest.pages.map((p) => ({ section: p.section, slug: p.slug }));
}

export function getSections() {
  const manifest = loadManifest();
  return manifest.sections.map((s) => s.name);
}

export function getSectionRoutes() {
  const manifest = loadManifest();
  return manifest.sectionRoutes;
}
