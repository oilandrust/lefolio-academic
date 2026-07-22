---
name: lefolio-deploy
description: >-
  Deploy LeFolio Academic to GitHub Pages: basePath, static export, GitHub
  Actions workflow, repo settings. Use when configuring Pages, fixing 404s,
  broken asset URLs, or CI deploy failures.
---

# LeFolio Deploy (GitHub Pages)

## Build pipeline

```bash
npm run build
# → sync content → next build → static files in out/
```

- **Static export:** `output: 'export'` in `next.config.mjs`
- **CLI:** `scripts/lefolio.mjs build` runs sync then `next build`
- **Artifact:** `out/` directory uploaded to GitHub Pages

## basePath (most common failure)

Must match how GitHub serves the site:

| Site type | URL | `site.basePath` |
|-----------|-----|-----------------|
| **Project site** | `username.github.io/repo-name` | `"/repo-name"` |
| **User/org site** | `username.github.io` | `""` |

Set in `Content/config.yaml`:

```yaml
site:
  url: "https://oilandrust.github.io/lefolio-academic"
  basePath: "/lefolio-academic"
```

`next.config.mjs` reads `basePath` from `.content/engine.json` (after sync) or directly from config. It sets both `basePath` and `assetPrefix`.

Local dev URL: `http://localhost:3000/lefolio-academic/` (when basePath is set).

## GitHub Actions workflow

File: `.github/workflows/deploy.yml`

```yaml
on:
  push:
    branches: [main]
  workflow_dispatch:

# build job: npm ci → npm run build → upload out/
# deploy job: actions/deploy-pages@v4
```

Permissions required: `pages: write`, `id-token: write`.

## Repo setup checklist

1. Push engine repo to GitHub
2. **Settings → Pages → Build and deployment → Source:** GitHub Actions
3. Set `site.basePath` in `Content/config.yaml` to match repo name
4. Push to `main` — workflow runs automatically
5. First deploy: approve GitHub Pages environment if prompted

Manual deploy: Actions tab → "Deploy to GitHub Pages" → Run workflow.

## External content in CI

Default CI uses repo `Content/`. For external vault:

```yaml
# .github/workflows/deploy.yml — build step
env:
  LEFOLIO_CONTENT: ${{ github.workspace }}/Content
  LEFOLIO_VAULT: ${{ github.workspace }}
```

Or commit content to the repo (recommended for CI simplicity).

## Verification

### Local

```bash
npm run build
npx serve out
```

Open `http://localhost:3000/<basePath>/` and check:

- Homepage loads
- Section pages and assets resolve (URLs include basePath prefix)
- No `*[Missing embed: ...]*` in rendered pages

### After deploy

- Visit `https://<user>.github.io/<repo>/`
- Check browser network tab for 404s on `/content-assets/...`
- Confirm `site.url` matches live URL for SEO/canonical links

## Rules

**Do:**
- Keep `basePath` in sync with GitHub repo name
- Use GitHub Actions source (not "Deploy from branch")
- Run `npm run build` locally before pushing large content changes

**Do not:**
- Force-push `main` to fix deploys
- Commit `out/`, `.next/`, `public/content-assets/` (generated)
- Deploy with wrong basePath — all routes and assets will 404

## See also

- [reference.md](reference.md) — troubleshooting table
- Skill `lefolio-content` — config.yaml and assets
- `README.md` — quick deploy section

## Conventions

- Engine root: `lefolio-academic/`; default content: `Content/`
- Build artifacts stay in engine: `.content/`, `public/content-assets/`, `out/`, `.next/`
- Run `npm run sync-content` before debugging manifest/asset issues
