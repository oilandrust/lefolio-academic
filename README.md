# LeFolio Academic

A modern academic website template built with **Next.js**, **Tailwind CSS**, and a filesystem-driven **`Content/`** folder. Inspired by [Academic Pages](https://academicpages.github.io/) layout, with Obsidian-friendly markdown.

## Quick start

```bash
cd lefolio-academic
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Edit files in `Content/` — changes sync automatically during development.

## Content structure

```
Content/
├── config.yaml          # Site, author, navigation, basePath
├── Assets/              # Images and other files
├── Pages/               # Section folders → routes
├── Teaching/
└── Publications/
```

Each `.md` file becomes a page at `/{section}/{slug}/`. Configure the homepage with `home:` in `config.yaml`.

### Markdown features

- Wikilinks: `[[about]]`, `[[Page|Label]]`
- Image embeds: `![[Assets/profile.jpg|200]]`, with optional `|align|wrap` params:
  - `![[photo.jpg|300|center]]` — sized + centered, block-level
  - `![[photo.jpg|200|left|wrap]]` — floats left, text wraps around it
  - `![[photo.jpg|200|right|wrap]]` — floats right, text wraps around it
  - Params can appear in any order after the filename, separated by `|`; `wrap` without an explicit alignment defaults to `right`
- Math: `$inline$` and `$$block$$` (KaTeX)
- Mermaid: ` ```mermaid ` fenced blocks
- Plotly: ` ```plotly ` JSON blocks
- GFM tables, strikethrough, etc.

## GitHub Pages deployment

1. Push this folder to a GitHub repository.
2. In **Settings → Pages**, set source to **GitHub Actions**.
3. Set `site.basePath` in `Content/config.yaml`:
   - User site (`username.github.io`): use `basePath: ""`
   - Project site (`username.github.io/repo-name`): use `basePath: "/repo-name"`
4. Push to `main` — the workflow in `.github/workflows/deploy.yml` builds and deploys `out/`.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run sync-content` | Scan `Content/`, resolve assets, write `.content/manifest.json` |
| `npm run dev` | Sync + watch content + Next.js dev server |
| `npm run build` | Sync + static export to `out/` |

## License

MIT
