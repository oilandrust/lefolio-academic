---
name: lefolio-themes
description: >-
  Create and customize LeFolio CSS theme presets (slate, light/dark, tokens,
  overrides). Use when editing theme.css, adding presets, theme: in config.yaml,
  --color-primary, data-theme, or prose styling.
---

# LeFolio Themes

## Template vs theme

| Concern | Controls | Config key |
|---------|----------|------------|
| **Template** | Layout, components (sidebar vs hero) | `template: academic` |
| **Theme** | Colors, fonts, palette within that layout | `theme.preset`, `theme.mode` |
| **Overrides** | Individual token values | `theme.overrides` or vault `Assets/theme.css` |

## Runtime wiring

`src/app/layout.tsx` sets on `<body>`:

```html
<body
  data-template="academic"
  data-theme="slate-light"
  style="--color-primary: #2563eb"
>
```

| Attribute | Source |
|-----------|--------|
| `data-template` | `config.template` |
| `data-theme` | `resolveThemeId()` → `{preset}-{light\|dark}` |
| `style` | `themeOverrideStyle()` from `theme.overrides` |

## Config shape

```yaml
template: academic
theme:
  preset: slate
  mode: light            # light | dark | system (system → light at build today)
  overrides:
    primary: "#2563eb"
    bg: "#fafafa"
```

Shorthand: `theme: slate-light` (string form also supported).

## Resolution code

- **Build/sync:** `scripts/resolve-theme.mjs`
- **Runtime:** `src/lib/theme/resolve-theme.ts`

`resolveThemeId({ preset: 'slate', mode: 'dark' })` → `"slate-dark"`

### Override keys → CSS variables

| Override key | CSS variable |
|--------------|--------------|
| `primary` | `--color-primary` |
| `primaryHover` | `--color-primary-hover` |
| `bg` | `--color-bg` |
| `bgAlt` | `--color-bg-alt` |
| `text` | `--color-text` |
| `textMuted` | `--color-text-muted` |
| `border` | `--color-border` |
| `fontSans` | `--font-sans` |
| `fontHeading` | `--font-heading` |
| `sidebarWidth` | `--sidebar-width` |

## CSS layers

```text
1. globals.css          Tailwind + shared .content-figure, .link-primary
2. themes/*.css         [data-theme="slate-light"] color tokens
3. template/theme.css   [data-template="academic"] layout + .prose-content
4. config overrides     inline style on <body>
```

Import order in `src/app/globals.css`:

```css
@import "tailwindcss";
@plugin "@tailwindcss/typography";
@import "../templates/academic/themes/slate-light.css";
@import "../templates/academic/themes/slate-dark.css";
@import "../templates/academic/theme.css";
```

**Tailwind must load before preset CSS** (presets use `@apply prose-slate`).

## Add a new preset

1. Create `src/templates/academic/themes/ocean-light.css`:

```css
[data-template="academic"][data-theme="ocean-light"] {
  --color-bg: #ffffff;
  --color-text: #0f172a;
  --color-primary: #0891b2;
  /* ... all required tokens — see reference.md */
}

[data-template="academic"][data-theme="ocean-light"] .prose-content {
  @apply prose-slate;
}
```

2. Create matching `ocean-dark.css`
3. Import both in `src/app/globals.css`
4. User sets `theme.preset: ocean` or `theme.preset: latex` in config

Built-in academic presets: `slate`, `latex`.

Scope presets with **both** `[data-template="..."]` and `[data-theme="..."]` to avoid cross-template bleed.

## Token rules for components

**Do:**
- Use `var(--color-primary)`, `var(--color-text-muted)`, etc.
- Use utility classes: `text-heading`, `text-muted`, `link-primary`, `border-default`, `bg-surface`
- Scope prose under `[data-template="academic"] .prose-content`

**Do not:**
- Hardcode `#2563eb` or `text-slate-600` in shell components
- Import preset CSS from template `index.ts`
- Edit generated `.content/` or `manifest.json` for theme changes

## Markdown prose

`MarkdownRenderer` wraps body in `<div className="prose-content">`. Template CSS controls typography; presets control colors inside prose.

## Verification

```bash
npm run dev
```

Toggle `theme.mode` in `config.yaml`, confirm `data-theme` and colors update after sync.

## See also

- [reference.md](reference.md) — full token vocabulary
- Skill `lefolio-templates` — template CSS structure
- Wiki: `wiki/lefolio/theming.md`

## Conventions

- Engine root: `lefolio-academic/`; default content: `Content/`
- Build artifacts stay in engine: `.content/`, `public/content-assets/`, `out/`, `.next/`
- Run `npm run sync-content` before debugging manifest issues
