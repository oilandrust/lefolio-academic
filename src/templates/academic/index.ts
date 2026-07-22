import SiteShell from './shell/SiteShell';
import type { TemplateModule } from '@/lib/templates/types';

export const academicTemplate: TemplateModule = {
  id: 'academic',
  routing: 'multipage',
  Shell: SiteShell,
};

export { default as SectionPageList } from './views/SectionPageList';
