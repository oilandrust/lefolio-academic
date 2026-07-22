# Deploy troubleshooting

## Symptom → cause → fix

| Symptom | Likely cause | Fix |
|---------|--------------|-----|
| Site 404 at root URL | Wrong site type / basePath | Project site needs `basePath: "/repo-name"` |
| Homepage OK, assets 404 | basePath mismatch on assets | Re-sync; verify URLs include `/repo-name/content-assets/...` |
| All pages 404 | Pages source not "GitHub Actions" | Settings → Pages → Source: GitHub Actions |
| Workflow fails on `npm ci` | Lockfile out of sync | Run `npm install` locally, commit `package-lock.json` |
| Workflow fails on build | TypeScript or sync error | Run `npm run build` locally, fix errors |
| Stale images after rename | Old copies in public | Sync purges `public/content-assets/` — run `npm run sync-content` |
| Missing embeds on live site | Vault root not set in CI | Set `LEFOLIO_VAULT` or use vault-relative paths under content |
| CSS/JS 404 | basePath not applied | Check `engine.json` has correct basePath after sync |

## URL matrix

| Config | Live URL | Local dev |
|--------|----------|-----------|
| `basePath: "/lefolio-academic"` | `github.io/lefolio-academic/` | `localhost:3000/lefolio-academic/` |
| `basePath: ""` | `github.io/` | `localhost:3000/` |

## Custom domain (optional)

1. Add `CNAME` file or configure in GitHub Pages settings
2. Update `site.url` in config.yaml to custom domain
3. Set `basePath: ""` unless serving from subpath

## Clean rebuild

```bash
rm -rf out .next public/content-assets .content
npm run build
```

Use when debugging asset orphans or manifest corruption.

## CI build env vars

| Variable | When needed |
|----------|-------------|
| `LEFOLIO_CONTENT` | Content outside default `Content/` |
| `LEFOLIO_VAULT` | Parent Obsidian vault for embed resolution |

Default workflow needs no env vars when content lives in repo `Content/`.
