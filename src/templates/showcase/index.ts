import SiteShell from './shell/SiteShell';
import type { TemplateModule } from '@/lib/templates/types';

export const showcaseTemplate: TemplateModule = {
  id: 'showcase',
  routing: 'multipage',
  Shell: SiteShell,
};

export { default as SectionPageList } from './views/SectionPageList';
export { default as HomeHero } from './views/HomeHero';
