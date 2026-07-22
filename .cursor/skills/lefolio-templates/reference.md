# Template reference

## Manifest fields templates consume

| Field | Purpose |
|-------|---------|
| `manifest.template` | Active template id |
| `manifest.theme` | Resolved theme id (e.g. `slate-light`) |
| `manifest.basePath` | GitHub Pages prefix |
| `manifest.config` | Full `config.yaml` content |
| `manifest.navigation` | Navbar items (`label`, `href`, `type`) |
| `manifest.sections` | Section listings with pages, index notes, display mode |
| `manifest.home` | Homepage processed body |
| `manifest.pages` | All pages with `processedBody`, `href`, frontmatter |
| `manifest.authorAvatar` | Resolved avatar URL |
| `manifest.assets` | Vault-relative path → public URL map |

## Section display modes (academic)

Set on section index note frontmatter (`Projects/Projects.md`):

| `display` | Component behavior |
|-----------|-------------------|
| `list` (default) | Title, date, venue text list |
| `grid` | Thumbnail cards with title + subtitle |
| `publication_thumbnail` | Publication-style rows with thumbnail |

Related frontmatter on index: `sort: date | order | title`, `preview`.

## New template file checklist

```text
src/templates/<id>/
├── index.ts                 # TemplateModule export
├── theme.css                # [data-template="<id>"] rules
├── themes/
│   ├── <preset>-light.css
│   └── <preset>-dark.css
├── shell/
│   └── SiteShell.tsx        # required
└── views/                   # route-specific views

src/lib/templates/registry.ts   # register template
src/app/globals.css             # import new theme presets
src/app/layout.tsx              # already uses getTemplate()
```

## Academic shell structure

```
SiteShell
├── Navbar (manifest.navigation)
├── Sidebar (manifest.config.author, authorAvatar)
└── main {children}
```

Section page (`src/app/[section]/page.tsx`) renders section index body + `SectionPageList`.

Page route (`src/app/[section]/[slug]/page.tsx`) renders `MarkdownRenderer` with `processedBody`.
