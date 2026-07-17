import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import yaml from 'js-yaml';
import matter from 'gray-matter';
import fg from 'fast-glob';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const CONTENT_DIR = path.join(ROOT, 'Content');
const MANIFEST_PATH = path.join(ROOT, '.content', 'manifest.json');
const SENTINEL_PATH = path.join(ROOT, 'src', 'lib', 'content', 'content-version.ts');
const ASSETS_OUT = path.join(ROOT, 'public', 'content-assets');

const SKIP_DIRS = new Set(['Assets', '.obsidian']);
const IMAGE_EXT = new Set(['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg']);

function slugify(name) {
  return name
    .replace(/\.md$/i, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function encodeSlug(slug) {
  return slug.split('/').map(encodeURIComponent).join('/');
}

function pageHref(section, slug) {
  return `/${encodeURIComponent(section)}/${encodeSlug(slug)}/`;
}

function pageRoute(page, homePath) {
  if (page.relativePath === homePath) {
    return '/';
  }

  if (!page.section) {
    const segment = path.basename(page.relativePath, '.md');
    return `/${encodeURIComponent(segment)}/`;
  }

  return pageHref(page.section, page.slug);
}

function isSectionIndexFile(section, relativePath) {
  return path.basename(relativePath, '.md') === section;
}

function normalizeAuthors(authors) {
  if (!authors) return [];
  if (Array.isArray(authors)) {
    return authors.map((a) => String(a).trim()).filter(Boolean);
  }
  return String(authors)
    .split(/,|;|\band\b/i)
    .map((a) => a.trim())
    .filter(Boolean);
}

function resolveThumbnail(value, sourceFile, vaultIndex, assetMap, basePath) {
  if (!value) return null;

  let target = String(value).trim();
  const wiki = target.match(/^\[\[([^\]]+)\]\]$/);
  if (wiki) {
    target = wiki[1].split('|')[0].trim();
  }
  target = target.replace(/^.*?Content\//, '');

  const resolved = resolveVaultPath(target, sourceFile, vaultIndex);
  if (!resolved || !isImagePath(resolved)) return null;

  const publicPath = copyAsset(resolved, assetMap);
  return publicPath ? `${basePath}${publicPath}` : null;
}

function sortPagesForSection(pages, sortMode) {
  const copy = [...pages];
  if (sortMode === 'title') {
    copy.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sortMode === 'order') {
    copy.sort((a, b) => {
      const orderA = a.frontmatter.order ?? 999;
      const orderB = b.frontmatter.order ?? 999;
      if (orderA !== orderB) return orderA - orderB;
      return a.title.localeCompare(b.title);
    });
  } else {
    // date (default)
    copy.sort((a, b) => {
      const dateA = a.frontmatter.date ? new Date(a.frontmatter.date).getTime() : 0;
      const dateB = b.frontmatter.date ? new Date(b.frontmatter.date).getTime() : 0;
      if (dateA !== dateB) return dateB - dateA;
      const orderA = a.frontmatter.order ?? 999;
      const orderB = b.frontmatter.order ?? 999;
      return orderA - orderB;
    });
  }
  return copy;
}

function contentHref(page, basePath, homePath) {
  if (page.isSectionIndex && page.section) {
    return `${basePath}/${encodeURIComponent(page.section)}/`;
  }
  const route = pageRoute(page, homePath);
  return route === '/' ? `${basePath}/` : `${basePath}${route}`;
}

function normalizeNavigationEntries(navigation) {
  if (!navigation) return [];

  if (Array.isArray(navigation)) {
    return navigation
      .map((entry) => {
        if (typeof entry === 'string') {
          return { label: entry };
        }
        if (entry && typeof entry === 'object') {
          const [label, path] = Object.entries(entry)[0];
          return { label, path: path ? String(path) : undefined };
        }
        return null;
      })
      .filter(Boolean);
  }

  if (typeof navigation === 'object') {
    return Object.entries(navigation).map(([label, path]) => ({
      label,
      path: path ? String(path) : undefined,
    }));
  }

  return [];
}

function isSectionFolder(name) {
  if (SKIP_DIRS.has(name) || name.startsWith('.')) return false;
  const fullPath = path.join(CONTENT_DIR, name);
  return fs.existsSync(fullPath) && fs.statSync(fullPath).isDirectory();
}

function findPageByRelativePath(pagesByPath, targetPath) {
  const normalized = targetPath.replace(/\\/g, '/');
  if (pagesByPath.has(normalized)) {
    return pagesByPath.get(normalized);
  }

  const basename = path.basename(normalized);
  for (const page of pagesByPath.values()) {
    if (page.relativePath.endsWith(`/${basename}`) || page.relativePath === basename) {
      return page;
    }
  }

  return null;
}

function resolveNavigationItem({ label, path: explicitPath }, pagesByPath, homePath) {
  if (explicitPath) {
    const page = findPageByRelativePath(pagesByPath, explicitPath);
    if (page) {
      return {
        label,
        href: pageRoute(page, homePath),
        type: 'page',
      };
    }
  }

  if (isSectionFolder(label)) {
    return {
      label,
      href: `/${encodeURIComponent(label)}/`,
      type: 'section',
    };
  }

  for (const page of pagesByPath.values()) {
    if (!page.section && path.basename(page.relativePath, '.md') === label) {
      return {
        label,
        href: pageRoute(page, homePath),
        type: 'page',
      };
    }
  }

  const sectionPage = [...pagesByPath.values()].find(
    (page) => page.section && page.slug === slugify(label)
  );
  if (sectionPage) {
    return {
      label,
      href: pageRoute(sectionPage, homePath),
      type: 'page',
    };
  }

  return {
    label,
    href: `/${encodeURIComponent(label)}/`,
    type: 'section',
  };
}

function buildVaultIndex(rootDir) {
  const index = new Map();

  function walk(dir) {
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
          index.get(key).push(relativePath);
        }
      }
    }
  }

  if (fs.existsSync(rootDir)) walk(rootDir);
  return index;
}

function parseLinkTarget(value) {
  const match = value.match(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/);
  if (!match) return null;
  return { target: match[1].trim(), alias: match[2]?.trim() };
}

const ALIGN_VALUES = new Set(['left', 'right', 'center']);

function normalizeBasePath(value) {
  if (!value || value === '/') return '';
  return String(value).replace(/\/$/, '');
}

function parseEmbedTarget(value) {
  const parts = value.split('|').map((s) => s.trim()).filter(Boolean);
  const target = parts[0];
  let width = null;
  let align = null;
  let wrap = false;

  for (const token of parts.slice(1)) {
    const lower = token.toLowerCase();
    if (/^\d+$/.test(token)) {
      width = parseInt(token, 10);
    } else if (ALIGN_VALUES.has(lower)) {
      align = lower;
    } else if (lower === 'wrap') {
      wrap = true;
    }
  }

  if (wrap && !align) align = 'right';
  return { target, width, align, wrap };
}

function resolveVaultPath(target, sourceFile, index) {
  const normalized = target.replace(/\\/g, '/');
  if (normalized.includes('/')) {
    const full = path.join(CONTENT_DIR, normalized);
    return fs.existsSync(full) ? normalized : null;
  }

  const withMd = normalized.endsWith('.md') ? normalized : `${normalized}.md`;
  for (const candidate of [normalized, withMd]) {
    const matches = index.get(path.basename(candidate)) || index.get(candidate);
    if (matches?.length === 1) return matches[0];
    if (matches?.length > 1) {
      const sourceDir = path.dirname(sourceFile).replace(/\\/g, '/');
      const sameDir = matches.filter((m) => path.dirname(m) === sourceDir);
      if (sameDir.length === 1) return sameDir[0];
      return [...matches].sort((a, b) => a.length - b.length)[0];
    }
    const direct = path.join(CONTENT_DIR, candidate);
    if (fs.existsSync(direct)) return candidate;
  }
  return null;
}

function isImagePath(filePath) {
  return IMAGE_EXT.has(path.extname(filePath).toLowerCase());
}

function copyAsset(relativePath, assetMap) {
  const source = path.join(CONTENT_DIR, relativePath);
  if (!fs.existsSync(source)) return null;

  const publicRelative = relativePath.replace(/\\/g, '/');
  const dest = path.join(ASSETS_OUT, publicRelative);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(source, dest);

  const publicPath = `/content-assets/${publicRelative.split('/').map(encodeURIComponent).join('/')}`;
  assetMap[relativePath] = publicPath;
  return publicPath;
}

function parseMarkdownFile(relativePath, fullPath, section = null) {
  const parsed = matter(fs.readFileSync(fullPath, 'utf8'));
  const baseSlug = slugify(path.basename(relativePath));
  const slug = parsed.data.permalink || baseSlug;

  return {
    section,
    slug,
    relativePath,
    frontmatter: parsed.data,
    body: parsed.content.trim(),
  };
}

function preprocessMarkdown(body, sourceFile, index, pagesByPath, assetMap, basePath, homePath) {
  let processed = body;

  processed = processed.replace(/!\[\[([^\]]+)\]\]/g, (_, raw) => {
    const { target, width, align, wrap } = parseEmbedTarget(raw);
    const resolved = resolveVaultPath(target, sourceFile, index);
    if (!resolved) return `\n\n*[Missing embed: ${target}]*\n\n`;

    if (isImagePath(resolved)) {
      const publicPath = copyAsset(resolved, assetMap) || '';
      const prefix = basePath || '';
      const src = `${prefix}${publicPath}`;
      const alt = path.basename(resolved, path.extname(resolved)).replace(/[_-]/g, ' ');

      if (!width && !align && !wrap) {
        return `\n\n![${alt}](${src})\n\n`;
      }

      const figureClasses = ['content-figure'];
      if (align) figureClasses.push(`align-${align}`);
      if (wrap) figureClasses.push('wrap');

      const figureStyle = width ? ` style="max-width:${width}px"` : '';
      const imgWidthAttr = width ? ` width="${width}"` : '';

      return `\n\n<figure class="${figureClasses.join(' ')}"${figureStyle}><img src="${src}" alt="${alt}"${imgWidthAttr} loading="lazy" /></figure>\n\n`;
    }

    if (resolved.endsWith('.md')) {
      const page = pagesByPath.get(resolved);
      if (page) {
        const href = contentHref(page, basePath, homePath);
        const title = page.frontmatter.title || page.slug;
        return `\n\n> **${title}**\n>\n> [Read more](${href})\n\n`;
      }
    }

    const publicPath = copyAsset(resolved, assetMap);
    if (publicPath) {
      return `\n\n[${path.basename(resolved)}](${basePath}${publicPath})\n\n`;
    }
    return `\n\n*[Missing embed: ${target}]*\n\n`;
  });

  processed = processed.replace(/(?<!!)\[\[([^\]]+)\]\]/g, (_, raw) => {
    const { target, alias } = parseLinkTarget(`[[${raw}]]`);
    const resolved = resolveVaultPath(target, sourceFile, index);
    if (!resolved) return alias || target;

    if (resolved.endsWith('.md')) {
      const page = pagesByPath.get(resolved);
      if (page) {
        const href = contentHref(page, basePath, homePath);
        return `[${alias || page.frontmatter.title || page.slug}](${href})`;
      }
    }

    const publicPath = copyAsset(resolved, assetMap);
    if (publicPath) {
      return `[${alias || path.basename(resolved)}](${basePath}${publicPath})`;
    }
    return alias || target;
  });

  processed = processed
    .replace(/([^\n])\n(#{1,6} )/g, '$1\n\n$2')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  return processed;
}

function scanPages(config) {
  const sections = fg
    .sync('*', { cwd: CONTENT_DIR, onlyDirectories: true })
    .filter((d) => !SKIP_DIRS.has(d) && !d.startsWith('.'));

  const rawPages = [];
  const sectionIndexNotes = new Map();

  for (const section of sections) {
    const files = fg.sync('**/*.md', { cwd: path.join(CONTENT_DIR, section) });
    for (const file of files) {
      const relativePath = `${section}/${file}`.replace(/\\/g, '/');
      const fullPath = path.join(CONTENT_DIR, relativePath);
      const parsed = parseMarkdownFile(relativePath, fullPath, section);

      if (isSectionIndexFile(section, relativePath)) {
        sectionIndexNotes.set(section, { ...parsed, isSectionIndex: true });
        continue;
      }

      rawPages.push(parsed);
    }
  }

  const homePath = config.home?.replace(/\\/g, '/');
  const standalonePages = [];

  for (const file of fg.sync('*.md', { cwd: CONTENT_DIR })) {
    const relativePath = file.replace(/\\/g, '/');
    if (relativePath === homePath) continue;
    if (rawPages.some((p) => p.relativePath === relativePath)) continue;

    const fullPath = path.join(CONTENT_DIR, relativePath);
    standalonePages.push(parseMarkdownFile(relativePath, fullPath, null));
  }

  let standaloneHomePage = null;

  if (
    homePath &&
    homePath.endsWith('.md') &&
    !rawPages.some((p) => p.relativePath === homePath)
  ) {
    const homeFullPath = path.join(CONTENT_DIR, homePath);
    if (fs.existsSync(homeFullPath)) {
      standaloneHomePage = parseMarkdownFile(homePath, homeFullPath, null);
    }
  }

  const allContentPages = [
    ...rawPages,
    ...sectionIndexNotes.values(),
    ...standalonePages,
    ...(standaloneHomePage ? [standaloneHomePage] : []),
  ];
  const pagesByPath = new Map(allContentPages.map((p) => [p.relativePath, p]));
  const index = buildVaultIndex(CONTENT_DIR);
  const assetMap = {};
  const basePath = normalizeBasePath(config.site?.basePath);

  if (config.author?.avatar) {
    copyAsset(config.author.avatar.replace(/\\/g, '/'), assetMap);
  }

  const pages = rawPages.map((page) => ({
    ...page,
    title: page.frontmatter.title || page.slug,
    processedBody: preprocessMarkdown(
      page.body,
      page.relativePath,
      index,
      pagesByPath,
      assetMap,
      basePath,
      homePath
    ),
  }));

  const processedSectionIndexes = new Map();
  for (const [section, note] of sectionIndexNotes.entries()) {
    processedSectionIndexes.set(section, {
      ...note,
      title: note.frontmatter.title || section,
      processedBody: preprocessMarkdown(
        note.body,
        note.relativePath,
        index,
        pagesByPath,
        assetMap,
        basePath,
        homePath
      ),
    });
  }

  const processedStandalonePages = standalonePages.map((page) => ({
    ...page,
    title: page.frontmatter.title || page.slug,
    processedBody: preprocessMarkdown(
      page.body,
      page.relativePath,
      index,
      pagesByPath,
      assetMap,
      basePath,
      homePath
    ),
  }));

  const processedStandaloneHomePage = standaloneHomePage
    ? {
        ...standaloneHomePage,
        title: standaloneHomePage.frontmatter.title || standaloneHomePage.slug,
        processedBody: preprocessMarkdown(
          standaloneHomePage.body,
          standaloneHomePage.relativePath,
          index,
          pagesByPath,
          assetMap,
          basePath,
          homePath
        ),
      }
    : null;

  pages.sort((a, b) => {
    const orderA = a.frontmatter.order ?? 999;
    const orderB = b.frontmatter.order ?? 999;
    if (orderA !== orderB) return orderA - orderB;
    const dateA = a.frontmatter.date ? new Date(a.frontmatter.date).getTime() : 0;
    const dateB = b.frontmatter.date ? new Date(b.frontmatter.date).getTime() : 0;
    return dateB - dateA;
  });

  const homePage =
    pages.find((p) => p.relativePath === homePath) ?? processedStandaloneHomePage;

  const navSections = sections.map((name) => {
    const indexNote = processedSectionIndexes.get(name) || null;
    const sortMode = indexNote?.frontmatter?.sort || 'date';
    const sectionPages = sortPagesForSection(
      pages.filter((p) => p.section === name),
      sortMode
    );

    return {
      name,
      display: indexNote?.frontmatter?.display || 'list',
      preview: indexNote?.frontmatter?.preview || null,
      index: indexNote
        ? {
            relativePath: indexNote.relativePath,
            title: indexNote.title,
            frontmatter: indexNote.frontmatter,
            processedBody: indexNote.processedBody,
          }
        : null,
      pages: sectionPages.map((p) => ({
        section: p.section,
        slug: p.slug,
        title: p.title,
        href: pageRoute(p, homePath),
        date: p.frontmatter.date || null,
        authors: normalizeAuthors(p.frontmatter.authors),
        venue:
          p.frontmatter.venue ||
          p.frontmatter.journal ||
          p.frontmatter.proceedings ||
          null,
        thumbnail: resolveThumbnail(
          p.frontmatter.thumbnail,
          p.relativePath,
          index,
          assetMap,
          basePath
        ),
        frontmatter: p.frontmatter,
      })),
    };
  });

  const navigation = normalizeNavigationEntries(config.navigation).map((entry) =>
    resolveNavigationItem(entry, pagesByPath, homePath)
  );

  const standaloneRoutes = processedStandalonePages.map((page) => ({
    relativePath: page.relativePath,
    segment: path.basename(page.relativePath, '.md'),
    title: page.title,
    processedBody: page.processedBody,
    href: pageRoute(page, homePath),
  }));

  return {
    generatedAt: new Date().toISOString(),
    config,
    basePath,
    home: homePage
      ? {
          relativePath: homePage.relativePath,
          title: homePage.title,
          processedBody: homePage.processedBody,
        }
      : null,
    navigation,
    sections: navSections,
    standalonePages: standaloneRoutes,
    sectionRoutes: [
      ...sections.map((name) => ({ section: name })),
      ...standaloneRoutes.map((page) => ({ section: page.segment })),
    ],
    pages: pages.map(({ relativePath, section, slug, title, frontmatter, processedBody }) => ({
      relativePath,
      section,
      slug,
      title,
      frontmatter,
      processedBody,
      href: pageRoute({ relativePath, section, slug }, homePath),
    })),
    assets: assetMap,
    authorAvatar:
      config.author?.avatar && assetMap[config.author.avatar.replace(/\\/g, '/')]
        ? `${basePath}${assetMap[config.author.avatar.replace(/\\/g, '/')]}`
        : null,
  };
}

function writeSentinel() {
  const content = `// Auto-generated by sync-content — do not edit
export const CONTENT_VERSION = ${Date.now()};
`;
  fs.mkdirSync(path.dirname(SENTINEL_PATH), { recursive: true });
  fs.writeFileSync(SENTINEL_PATH, content);
}

function main() {
  const configPath = path.join(CONTENT_DIR, 'config.yaml');
  const config = yaml.load(fs.readFileSync(configPath, 'utf8'));
  const manifest = scanPages(config);

  fs.mkdirSync(path.dirname(MANIFEST_PATH), { recursive: true });
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
  writeSentinel();

  console.log(`Synced ${manifest.pages.length} pages, ${Object.keys(manifest.assets).length} assets`);
}

main();
