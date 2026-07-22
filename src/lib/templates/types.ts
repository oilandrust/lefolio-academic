import type { ContentManifest } from '@/lib/content/types';

export interface TemplateModule {
  id: string;
  routing: 'multipage' | 'singlepage';
  Shell: React.FC<{
    manifest: ContentManifest;
    children: React.ReactNode;
  }>;
}
