import type { CSSProperties } from 'react';
import type { ThemeConfig } from '@/lib/content/types';

const OVERRIDE_MAP: Record<string, string> = {
  primary: '--color-primary',
  primaryHover: '--color-primary-hover',
  bg: '--color-bg',
  bgAlt: '--color-bg-alt',
  text: '--color-text',
  textMuted: '--color-text-muted',
  border: '--color-border',
  fontSans: '--font-sans',
  fontHeading: '--font-heading',
  sidebarWidth: '--sidebar-width',
};

export function resolveThemeId(theme?: ThemeConfig | string): string {
  if (typeof theme === 'string' && theme.trim()) {
    return theme.trim();
  }

  const config = typeof theme === 'object' && theme !== null ? theme : undefined;
  const preset = config?.preset || 'slate';
  let mode = config?.mode || 'light';

  if (mode === 'system') {
    mode = 'light';
  }

  return `${preset}-${mode === 'dark' ? 'dark' : 'light'}`;
}

export function themeOverrideStyle(theme?: ThemeConfig | string): React.CSSProperties {
  if (!theme || typeof theme === 'string' || !theme.overrides) {
    return {};
  }

  const style: Record<string, string> = {};

  for (const [key, value] of Object.entries(theme.overrides)) {
    const cssVar = OVERRIDE_MAP[key];
    if (cssVar && value) {
      style[cssVar] = value;
    }
  }

  return style as CSSProperties;
}
