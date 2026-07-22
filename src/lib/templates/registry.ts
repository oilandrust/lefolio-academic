import type { TemplateModule } from './types';
import { academicTemplate } from '@/templates/academic';

const templates: Record<string, TemplateModule> = {
  academic: academicTemplate,
};

export function getTemplate(id: string): TemplateModule {
  const template = templates[id];
  if (template) {
    return template;
  }

  if (typeof console !== 'undefined') {
    console.warn(`Unknown template "${id}", falling back to academic.`);
  }

  return templates.academic;
}
