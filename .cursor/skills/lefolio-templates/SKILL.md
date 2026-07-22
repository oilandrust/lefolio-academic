---
name: lefolio-templates
description: >-
  Create and extend LeFolio site templates (TemplateModule API, shell, views,
  routing). Use when adding a template, porting landing/portfolio UI, editing
  SiteShell/Sidebar/SectionPageList, or changing template: in config.yaml.
---

# LeFolio Templates

## What a template is

A template is **information architecture + React shell**, not a CSS skin.

| Template | Routing | Shape |
|----------|---------|-------|
| `academic` (current) | `multipage` | Sidebar + navbar + section listings |
| `showcase` (current) | `multipage` | Top nav + hero + docs (product/marketing) |
| `landing` (planned) | `singlepage` | Hero + `##` sections + CTA |
| `portfolio` (planned) | `singlepage` | Hero + project cards |

Templates consume the **manifest** (`.content/manifest.json`) produced by sync. They must not re-parse the vault.

## TemplateModule contract

```typescript
// src/lib/templates/types.ts
interface TemplateModule {
  id: string;
  routing: 'multipage' | 'singlepage';
  Shell: React.FC<{ manifest: ContentManifest; children: React.ReactNode }>;
}
```

## File layout (academic reference)

```text
src/templates/academic/
├── index.ts              # exports academicTemplate
├── theme.css             # layout tokens + prose scoped to [data-template="academic"]
├── shell/
│   ├── SiteShell.tsx
│   ├── Navbar.tsx
│   └── Sidebar.tsx
└── views/
    └── SectionPageList.tsx   # list | grid | publication_thumbnail modes
```

## Registration

1. Implement `TemplateModule` in `src/templates/<id>/index.ts`
2. Register in `src/lib/templates/registry.ts`:

```typescript
import { landingTemplate } from '@/templates/landing';

const templates: Record<string, TemplateModule> = {
  academic: academicTemplate,
  landing: landingTemplate,
};
```

3. User selects via `config.yaml`:

```yaml
template: academic
```

Sync writes `template` to the manifest (`scripts/sync-content.mjs` via `resolveTemplateId`).

## App wiring

- **`src/app/layout.tsx`** — `getTemplate(manifest.template).Shell` wraps all pages; sets `data-template` on `<body>`
- **Section routes** — import views from the template package, e.g. `@/templates/academic/views/SectionPageList`
- **Do not** keep shell components in `src/components/` — they belong under `src/templates/<id>/`

## CSS boundary

| Layer | Location | Scope |
|-------|----------|-------|
| Engine shared | `src/app/globals.css` | Figures, link utilities, Tailwind imports |
| Template structure | `src/templates/<id>/theme.css` | `[data-template="<id>"]` layout + `.prose-content` |
| Theme presets | `src/templates/<id>/themes/*.css` | `[data-theme="preset-mode"]` colors |

Import preset CSS from `globals.css` (after `@import "tailwindcss"`), not from template `index.ts`.

## Workflow: add a new template

1. Create `src/templates/<id>/` with `index.ts`, `shell/`, `views/`, `theme.css`
2. Implement `Shell` — read nav, author, sections from `manifest`
3. Register in `src/lib/templates/registry.ts`
4. Add theme preset CSS files under `themes/` and import in `globals.css`
5. Wire routes in `src/app/` if routing differs from academic
6. Run `npm run build` and verify `data-template="<id>"` on `<body>`

## Rules

**Do:**
- Consume `ContentManifest` types from `src/lib/content/types.ts`
- Scope template CSS with `[data-template="<id>"]`
- Keep markdown rendering in `MarkdownRenderer` (engine), not in templates

**Do not:**
- Put React components in the content vault
- Re-parse markdown or wikilinks in template code
- Change manifest shape without updating sync + types
- Hardcode colors — use CSS tokens (see `lefolio-themes` skill)

## Verification

```bash
npm run sync-content
npm run build
```

Check generated pages use the correct shell and section display modes.

## See also

- [reference.md](reference.md) — file checklist and manifest fields templates use
- Skill `lefolio-themes` — palette/preset CSS
- Skill `lefolio-content` — vault structure and frontmatter
- Wiki: `wiki/lefolio/templates.md` — architecture rationale

## Conventions

- Engine root: `lefolio-academic/`; default content: `Content/`
- Build artifacts stay in engine: `.content/`, `public/content-assets/`, `out/`, `.next/`
- Run `npm run sync-content` before debugging manifest issues
