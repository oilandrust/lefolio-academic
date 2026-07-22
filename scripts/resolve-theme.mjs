/**
 * Resolve template id and theme id from config.yaml (used by sync + engine.json).
 */

export function resolveTemplateId(config) {
  const value = config?.template;
  if (typeof value === 'string' && value.trim()) {
    return value.trim();
  }
  return 'academic';
}

export function resolveThemeId(config) {
  const theme = config?.theme;

  if (typeof theme === 'string' && theme.trim()) {
    return theme.trim();
  }

  const preset = theme?.preset || 'slate';
  let mode = theme?.mode || 'light';

  if (mode === 'system') {
    mode = 'light';
  }

  return `${preset}-${mode === 'dark' ? 'dark' : 'light'}`;
}
