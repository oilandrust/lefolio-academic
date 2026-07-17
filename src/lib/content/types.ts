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

export type NavigationConfig =
  | string[]
  | Record<string, string | null>
  | Array<string | Record<string, string>>;

export interface ContentConfig {
  site: SiteConfig;
  home: string;
  author: AuthorConfig;
  navigation: NavigationConfig;
}

export interface PageFrontmatter {
  title?: string;
  date?: string;
  order?: number;
  permalink?: string;
  authors?: string | string[];
  venue?: string;
  journal?: string;
  proceedings?: string;
  thumbnail?: string;
  display?: string;
  sort?: string;
  preview?: string;
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

export interface NavItem {
  label: string;
  href: string;
  type: 'section' | 'page';
}

export interface SectionListItem {
  section: string;
  slug: string;
  title: string;
  href: string;
  date?: string | null;
  authors: string[];
  venue?: string | null;
  thumbnail?: string | null;
  frontmatter?: PageFrontmatter;
}

export interface SectionIndexNote {
  relativePath: string;
  title: string;
  frontmatter: PageFrontmatter;
  processedBody: string;
}

export interface NavSection {
  name: string;
  display: string;
  preview?: string | null;
  index: SectionIndexNote | null;
  pages: SectionListItem[];
}

export interface StandalonePage {
  relativePath: string;
  segment: string;
  title: string;
  processedBody: string;
  href: string;
}

export interface ContentManifest {
  generatedAt: string;
  config: ContentConfig;
  basePath: string;
  home: {
    relativePath: string;
    title: string;
    processedBody: string;
  } | null;
  navigation: NavItem[];
  sections: NavSection[];
  standalonePages: StandalonePage[];
  sectionRoutes: Array<{ section: string }>;
  pages: ManifestPage[];
  assets: Record<string, string>;
  authorAvatar: string | null;
}
