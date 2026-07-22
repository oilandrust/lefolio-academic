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
  preset: slate
  mode: light    # light | dark | system (system defaults to light at build)
  overrides:
    primary: "#2563eb"
```

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

## License

MIT
