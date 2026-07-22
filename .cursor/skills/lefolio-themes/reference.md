# Theme token reference

## Color and surface

| Token | Used for |
|-------|----------|
| `--color-bg` | Page background |
| `--color-bg-alt` | Sidebar, cards, code blocks |
| `--color-bg-elevated` | Modals, dropdowns |
| `--color-text` | Body text |
| `--color-text-muted` | Subtitles, venue, meta |
| `--color-border` | Dividers, card borders |
| `--color-primary` | Links, active nav, accents |
| `--color-primary-hover` | Link/button hover |
| `--color-on-primary` | Text on primary buttons |

## Typography

| Token | Used for |
|-------|----------|
| `--font-sans` | Body, UI |
| `--font-heading` | h1–h3, site title |
| `--font-mono` | Code |
| `--text-base` | Body size |
| `--leading-body` | Body line height |

## Layout (academic defaults in theme.css)

| Token | Academic default |
|-------|------------------|
| `--sidebar-width` | `320px` |
| `--content-max-width` | fluid |
| `--radius` | `0.5rem` |
| `--shadow-card` | subtle |

## LaTeX preset

Serif Latin Modern typography, maroon hyperlinks, off-white page — modeled on [latex.now.sh](https://latex.now.sh/) (used by many math department homepages).

```yaml
theme:
  preset: latex
  mode: light
```

Files: `latex-fonts.css`, `latex-light.css`, `latex-dark.css`.

## Slate preset example (light)

```css
[data-template="academic"][data-theme="slate-light"] {
  --color-bg: #ffffff;
  --color-bg-alt: #f8fafc;
  --color-bg-elevated: #ffffff;
  --color-text: #1e293b;
  --color-text-muted: #64748b;
  --color-border: #e2e8f0;
  --color-primary: #2563eb;
  --color-primary-hover: #1d4ed8;
  --color-on-primary: #ffffff;
}
```

Dark presets invert backgrounds and lighten text — copy slate-dark.css as a template.

## Engine utility classes (globals.css + theme.css)

| Class | Maps to |
|-------|---------|
| `.text-heading` | `var(--color-text)` |
| `.text-muted` | `var(--color-text-muted)` |
| `.link-primary` | primary link color + hover |
| `.border-default` | `var(--color-border)` |
| `.bg-surface` | `var(--color-bg-alt)` |

## User overrides beyond config.yaml

Power users can add rules in `Content/Assets/theme.css` (loaded last, future) or use `theme.overrides` for quick accent changes without new preset files.
