# LeFolio Academic

A modern academic website template built with **Next.js**, **Tailwind CSS**, and a filesystem-driven content vault. Inspired by [Academic Pages](https://academicpages.github.io/) layout, with Obsidian-friendly markdown.

## Quick start

```bash
cd lefolio-academic
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (or your configured `basePath`). Edit files in `Content/` — changes sync automatically during development.

## Content directory

By default the engine reads content from `./Content/` inside this repo. For an Obsidian vault (or any external folder), pass `--content`:

```bash
node scripts/lefolio.mjs dev --content ~/Documents/MySite
```

Or set the environment variable:

```bash
LEFOLIO_CONTENT=~/Documents/MySite npm run dev
```

The content root is the folder that contains `config.yaml` and your markdown files directly (no `Content/` wrapper required in the vault). Build artifacts (manifest, copied assets, `.next`, `out/`) always stay in the engine directory, not in your vault.

### Vault root vs content folder

Obsidian wikilinks and embeds (`[[note]]`, `![[image.png]]`) resolve from the **Obsidian vault root**, which may be wider than the site content folder. For example, vault `~/Projects/Academic` with site content in `lefolio-academic/Content/`.

The engine auto-detects vault root by walking up from the content folder until it finds `.obsidian/`. Override when needed:

```bash
node scripts/lefolio.mjs dev --vault ~/Projects/Academic
```

Or in `config.yaml`:

```yaml
vault: ../..   # relative to the content folder
```

Only the content folder is watched during development; assets outside it are resolved at sync time (re-run sync or edit a content file to refresh).

## Content structure

```
Content/                 # or your vault root when using --content
├── config.yaml          # Site, author, navigation, template, theme
├── Assets/              # Images and other files
├── Pages/
├── Projects/
└── Publications/
```

Each `.md` file becomes a page at `/{section}/{slug}/`. Configure the homepage with `home:` in `config.yaml`.

### Template and theme

```yaml
template: academic
theme:
  preset: slate    # or latex — Latin Modern serif, maroon links (math homepage style)
  mode: light      # light | dark | system (system defaults to light at build)
  overrides:
    primary: "#2563eb"
```

### Analytics

```yaml
analytics:
  google: "G-XXXXXXXXXX"   # GA4 measurement ID
```

Injected by the core layout (all templates). Omit the key to disable tracking.

### Markdown features

- Wikilinks: `[[about]]`, `[[Page|Label]]`
- Image embeds: `![[Assets/profile.jpg|200]]`, with optional `|align|wrap` params
- Math: `$inline$` and `$$block$$` (KaTeX)
- Mermaid: ` ```mermaid ` fenced blocks
- Plotly: ` ```plotly ` JSON blocks
- GFM tables, strikethrough, etc.

## GitHub Pages deployment

1. Push this folder to a GitHub repository.
2. In **Settings → Pages**, set source to **GitHub Actions**.
3. Set `site.basePath` in `config.yaml`:
   - User site (`username.github.io`): use `basePath: ""`
   - Project site (`username.github.io/repo-name`): use `basePath: "/repo-name"`
4. Push to `main` — the workflow in `.github/workflows/deploy.yml` builds and deploys `out/`.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run sync-content` | Scan content vault, resolve assets, write `.content/manifest.json` |
| `npm run dev` | Sync + watch content + Next.js dev server |
| `npm run build` | Sync + static export to `out/` |
| `node scripts/lefolio.mjs dev --content <path>` | Dev with external content vault |

## Agent skills

Project-scoped Cursor skills in `.cursor/skills/` teach coding agents how to work on LeFolio:

| Skill | Load when |
|-------|-----------|
| `lefolio-templates` | Creating templates, shell/layout, SectionPageList, `template:` config |
| `lefolio-themes` | Theme presets, CSS tokens, light/dark, `theme:` config |
| `lefolio-content` | Editing Content/, wikilinks, embeds, frontmatter, vault paths |
| `lefolio-deploy` | GitHub Pages, basePath, CI workflow, deploy troubleshooting |

Each skill has a `SKILL.md` (instructions) and `reference.md` (tables/checklists). Wiki design docs live in `wiki/lefolio/` for deeper architecture context.

## License

MIT
