export interface SiteConfig {
  title: string;
  description?: string;
  url?: string;
  basePath?: string;
}

export interface AuthorConfig {
  name: string;
  pronouns?: string;
  bio?: string;
  avatar?: string;
  location?: string;
  employer?: string;
  links?: Record<string, string>;
}

export interface ContentConfig {
  site: SiteConfig;
  home: string;
  author: AuthorConfig;
  navigation: string[];
}

export interface PageFrontmatter {
  title?: string;
  date?: string;
  order?: number;
  permalink?: string;
  [key: string]: unknown;
}

export interface ManifestPage {
  relativePath: string;
  section: string;
  slug: string;
  title: string;
  frontmatter: PageFrontmatter;
  processedBody: string;
  href: string;
}

export interface NavSection {
  name: string;
  pages: Array<{
    section: string;
    slug: string;
    title: string;
    href: string;
  }>;
}

export interface ContentManifest {
  generatedAt: string;
  config: ContentConfig;
  basePath: string;
  home: {
    section: string;
    slug: string;
    title: string;
    processedBody: string;
  } | null;
  sections: NavSection[];
  pages: ManifestPage[];
  assets: Record<string, string>;
  authorAvatar: string | null;
}
