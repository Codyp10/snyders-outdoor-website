# Snyder's Outdoor Solutions — Website

Local service site for Snyder's Outdoor Solutions (Hagerstown, MD).
Astro 5 · Tailwind 4 · Vercel (static).

## Stack

| Layer | Tool |
|---|---|
| Framework | Astro 5 (static output, zero JS by default) |
| Styling | Tailwind CSS 4 (via `@tailwindcss/vite`) |
| Fonts | `@fontsource-variable/inter` (self-hosted) |
| Sitemap | `@astrojs/sitemap` |
| Hosting | Vercel (no adapter — pure static deploy) |
| Tracking | Google Tag Manager only (GA4, CallRail DNI, Microsoft Clarity all fire via GTM) |

## Local dev

```sh
corepack enable pnpm
pnpm install
pnpm dev      # http://localhost:4321
pnpm build    # static output → ./dist
pnpm preview  # serve built output locally
```

Node 20+ required. `.node-version` pins the target.

## Environment variables

Copy `.env.example` → `.env.local` for local dev, and set the same keys in the Vercel
project settings for production.

| Key | Required? | Notes |
|---|---|---|
| `PUBLIC_GTM_ID` | at launch | GTM container ID (`GTM-XXXXXXX`). Tracking no-ops until set. |

## Single source of truth: `src/data/business.json`

Name, Address, Phone, hours, geo, social links. Every component that displays NAP
data (footer, schema, contact page, location pages) reads from this file.

**Do not hardcode NAP anywhere else.** Any `NAP_PENDING` value in this file must be
replaced before DNS cutover — stale NAP in production schema breaks the Logic Loop.

## Project structure

```
src/
├── components/        Header, Footer, MobileCTABar, (schema components coming)
├── content/           Content collections (tree-services/, locations/, outdoor-services/)
├── data/              business.json, navigation.json
├── layouts/           BaseLayout.astro, ServiceLayout/LocationLayout (coming)
├── pages/             Route files — mirror the public URL structure
└── styles/            global.css (Tailwind entry + theme tokens)

public/                robots.txt, favicon.svg, (OG image coming)
```

## Deployment

Vercel auto-detects Astro. No `vercel.json` needed for the static build.

1. Import `Codyp10/snyders-outdoor-website` into Vercel
2. Framework preset: Astro (auto-detected)
3. Build command: `pnpm build`
4. Output directory: `dist`
5. Add env vars (see above) in Project Settings → Environment Variables

## Built but hidden

Work that is **finished and in the repo** but deliberately not visible on the live site.
Nothing here needs rebuilding — each item is a small, reversible change.

### Outdoor services (hidden Aug 2026)

Snyder's does not currently offer wood products, plant health care / pest control,
holiday lights / chimney / stove, lightning protection, or utility & rail work.
Advertising them generated leads the crew can't fulfill, so the whole surface is hidden
rather than deleted.

| What | Where | How it's hidden |
|---|---|---|
| Outdoor Services page (5 service cards, full copy) | `src/pages/outdoor-services/index.astro` | `noindex` prop on `BaseLayout` + excluded from sitemap |
| Homepage "We Do More Than Trees" band | `src/pages/index.astro` | Commented out in place |
| Nav link | `src/data/navigation.json` | `"hidden": true` |
| Dustin's story mention | `src/pages/about.astro` | Rewritten to be tree-only |
| Phase 2 content collection (schema, no entries) | `src/content.config.ts` | Unused, harmless |

**To bring it back** when the services are real:

1. Uncomment the teaser block in `src/pages/index.astro` (search `HIDDEN until Phase 2`)
2. Remove `noindex` from `src/pages/outdoor-services/index.astro`
3. Drop `outdoor-services` from the sitemap filter in `astro.config.mjs`
4. Set `"hidden": false` on the Outdoor Services nav item in `src/data/navigation.json`
5. Optionally restore the outdoor-solutions sentence in `src/pages/about.astro` (see git history)
6. Redeploy, then request indexing for `/outdoor-services` in Search Console

Add or remove individual services by editing the `services` array in
`src/pages/outdoor-services/index.astro` — do not re-enable a service Dustin isn't
actively selling.

## Build phases

- **Phase 1 (current build):** 14 launch pages — Home, About, Tree Services hub,
  Outdoor Services hub (overview), Service Areas, Contact, 6 tree services, 3 locations.
- **Phase 2 (post-launch):** 7 outdoor service pages added as markdown files under
  the existing `outdoor-services` collection — no template work needed.

See the four source-of-truth docs:
`Snyders_Strategy_Document.md`, `Snyders_Developer_Brief.md`,
`Snyders_Tech_Stack_Spec.md`, `Snyders_Design_Spec.md`.
