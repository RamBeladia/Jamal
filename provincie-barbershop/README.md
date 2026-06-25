# Provincie Barbershop — Next.js

A single-page site for **Provincie Barbershop** (Jamal Ali · Provinciestraat 226, 2018 Antwerpen),
migrated from a single static `index.html` to **Next.js 14 (App Router) + Tailwind CSS + shadcn/ui**,
structured for **zero-config deployment on Vercel**.

## Run locally

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm start        # serve the production build
```

## Deploy to Vercel

Push this folder to a GitHub repo and import it on Vercel. No extra configuration is needed —
Vercel auto-detects Next.js (build `next build`, output `.next`). `next/image` and `next/font`
are optimized automatically.

## Design tokens

The brand palette lives in **one place** — `tailwind.config.ts` (named colors) mirrored as CSS
variables in `src/app/globals.css`. Use `ink / paper / paper-2 / paper-3 / brass / brass-soft /
brass-deep / warm`, never raw hex.

| Token | Value |
|-------|-------|
| ink | `#121212` |
| paper / paper-2 / paper-3 | `#F1F0ED` / `#E9E7E0` / `#FBFAF7` |
| brass / soft / deep | `#B08D3E` / `#cda758` / `#7d6126` |
| warm | `#67655E` |

Fonts are loaded via `next/font/google` in `src/app/layout.tsx`: **Fraunces** (display),
**Archivo** (body), **IBM Plex Mono** (labels/data) — exposed as `--font-display/-body/-mono`.

## Structure

```
src/
  app/            layout.tsx (fonts, metadata, providers) · page.tsx · globals.css
  components/      header, hero, services, gallery, reviews, story, booking, hours, footer,
                  cursor, divider, lang-toggle, scroll-reveal · ui/button.tsx (shadcn)
  lib/            i18n (NL default), content (all real data), hooks, scroll, utils
public/photos/    gallery-fade.jpg, gallery-kids.jpg (the two real shop photos)
```

## STEP 1 — 21st.dev registry components

Two real 21st.dev components were selected for the kinetic hero text and the reviews carousel:

- Hero text-reveal — `npx shadcn@latest add https://21st.dev/r/isaiahbjork/reveal-text`
- Draggable carousel — `npx shadcn@latest add https://21st.dev/r/ruixen.ui/card-stack`

**These registry items are gated behind 21st.dev authentication** (`[Authentication required]`),
so the CLI pull needs a 21st.dev API key. Run, with your key:

```bash
REGISTRY_TOKEN=<your-21st.dev-key> npx shadcn@latest add https://21st.dev/r/isaiahbjork/reveal-text
REGISTRY_TOKEN=<your-21st.dev-key> npx shadcn@latest add https://21st.dev/r/ruixen.ui/card-stack
```

Until then, brand-styled equivalents ship in-repo and are wired up:
- `components/hero.tsx` — per-word kinetic headline reveal (+ curtain, ring, ambient drift,
  mouse-parallax, CTA shine/breathing glow, scroll cue)
- `components/reviews.tsx` — draggable, idle-drifting card carousel with the real Google reviews

## Still placeholder (needs Jamal)

- **Story copy** — generic holding text (`components/story.tsx`)
- **Hours** — Tue–Sat 10:00–19:00 is an estimate (`lib/content.ts`)
- **Service durations** — all `~min` values are estimates
- **Instagram URL** — `CONTACT.instagramHref` is `#`
- The booking flow is a front-end demo (no backend) — wire a real calendar before going live.
