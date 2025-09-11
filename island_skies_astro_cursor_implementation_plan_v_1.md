# Island Skies Astro — Cursor Implementation Plan (v1)

> **Scope**: Deliver an AstroBin‑style gallery + blog‑style Articles + visually distinct About page. Host on **Google Cloud**. Use a JSON index (`web_images.json`) in **GCS** as source‑of‑truth and generate **WebP thumbnails** behind **Cloud CDN**. Build with **Next.js (TypeScript, App Router)** + **Tailwind**.

---

## 0) TL;DR: What you’ll have after v1
- A deployed site at your custom domain (HTTPS), dark theme, with:
  - **Gallery grid** (clean, edge‑to‑edge). Clicking an item opens a **Details page** with an info panel (right/desktop, below/mobile portrait). Clicking the image enters **Full‑screen** (zoom/pan, no next/prev).
  - **Next/Previous** navigation **at the Details page level**.
  - **Articles** (chronological list → individual SEO pages, OG/Twitter cards).
  - **About** (short storytelling bio, DSO vs Planetary gear lists, your photo, locations, social links). Visual style distinct from Gallery/Articles.
  - **Images** served from **GCS + Cloud CDN**; **thumbnails** generated as **WebP** (~320/640/1280) with long cache.

---

## 1) Tech Choices
- **Framework**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS (dark theme first)
- **State/Utilities**: Minimal (Zustand optional only if needed)
- **Image delivery**: next/image using GCS public URLs; remotePatterns configured
- **Content**:
  - Gallery data from `web_images.json` in GCS
  - Articles in local **MDX** files (simple authoring & SEO); cross‑link to gallery
- **Hosting**: Google Cloud **Cloud Run** (containerized Next.js), public HTTPS LB
- **Media**: Google Cloud **Storage** (GCS) behind **Cloud CDN**
- **CI/CD**: **Cloud Build** trigger on `main` to build & deploy Cloud Run
- **Observability**: Cloud Logging + Error Reporting (via Cloud Run)

---

## 2) GCP: Project & Infra Setup (one‑time)
**Project**: `IslandSkiesAstro`

```bash
# Login & set project
gcloud auth login
gcloud projects create IslandSkiesAstro
gcloud config set project IslandSkiesAstro

# Enable services
gcloud services enable compute.googleapis.com run.googleapis.com \
  cloudbuild.googleapis.com artifactregistry.googleapis.com \
  storage.googleapis.com certificatemanager.googleapis.com \
  networkservices.googleapis.com networksecurity.googleapis.com

# Artifact Registry (Docker images)
gcloud artifacts repositories create web-repo \
  --repository-format=docker --location=us --description="Site images"

# Cloud Run service will be created by deploy step later

# Storage buckets (media + json index)
# Choose your location/dual-region (example: us or nam4)
export GCS_LOC=US
export MEDIA_BUCKET=islandskiesastro-media

gsutil mb -l $GCS_LOC gs://$MEDIA_BUCKET/
# Make objects public-read via signed URL alternative or uniform access; for simple public hosting:
gsutil iam ch allUsers:objectViewer gs://$MEDIA_BUCKET

# (Optional) Bucket for static JSON & assets separate from originals
export STATIC_BUCKET=islandskiesastro-static
gsutil mb -l $GCS_LOC gs://$STATIC_BUCKET/
gsutil iam ch allUsers:objectViewer gs://$STATIC_BUCKET

# Upload your initial web_images.json
# (Adjust path to your local file)
gsutil cp ./data/web_images.json gs://$STATIC_BUCKET/
```

### Cloud CDN for GCS media
> Simplest path: Use **GCS public URLs** directly with long cache headers; add CDN later. If you prefer CDN now:

```bash
# Create a backend bucket and enable Cloud CDN (using gcloud beta/Google Cloud Console is often easier)
# This section can be completed in Console: Network Services → Load Balancing → Create HTTP(S) LB
# - Backend: backend bucket → MEDIA_BUCKET with CDN enabled
# - Frontend: managed certificate for your media subdomain (e.g., media.islandskiesastro.com)
# - URL map/route, enable compression for text
```

### Managed SSL + Domain
- Use **Cloud DNS** (recommended) or your registrar.
- Create A/AAAA records pointing to the HTTPS load balancer for **app** and **media** subdomains if you front both.

---

## 3) Repository Structure (Cursor‑ready)
```
islandskiesastro/
  .env.example
  Dockerfile
  cloudbuild.yaml
  next.config.mjs
  package.json
  postcss.config.js
  tailwind.config.ts
  tsconfig.json
  public/
    favicon.ico
    logo.svg   # white w/ transparency if you want local fallback
  src/
    app/
      layout.tsx
      page.tsx                    # home → Gallery grid
      gallery/
        [id]/page.tsx             # Details page per image
      articles/
        page.tsx                  # Articles list
        [slug]/page.tsx           # Article page (MDX)
      about/
        page.tsx
      api/
        revalidate/route.ts       # (optional) webhook to revalidate
    components/
      GalleryGrid.tsx
      ImageCard.tsx
      ImageDetailsPanel.tsx
      FullscreenViewer.tsx
      Seo.tsx
      Navbar.tsx
      Footer.tsx
    lib/
      config.ts
      images.ts                   # fetch & normalize web_images.json
      types.ts
      markdown.ts                 # MDX loader helpers
    styles/
      globals.css
  content/
    articles/
      first-post.mdx
      second-post.mdx
```

---

## 4) Environment & Config
Create `.env.local` (Cursor can template from `.env.example`):
```
NEXT_PUBLIC_MEDIA_BASE_URL=https://storage.googleapis.com/islandskiesastro-media
NEXT_PUBLIC_STATIC_BASE_URL=https://storage.googleapis.com/islandskiesastro-static
WEB_IMAGES_INDEX=web_images.json
SITE_NAME=Island Skies Astro
```

**Caching**: set long cache on media. For JSON, you can keep a shorter TTL (e.g., 1 hour) and leverage Next.js **fetch cache**/ISR.

---

## 5) Next.js App — Key Implementation Notes

### 5.1 Global layout & dark theme
- Tailwind configured with `dark` class; body defaults to dark.
- Navbar: left logo (white PNG/SVG), right links: Gallery, Articles, About.

### 5.2 Gallery Grid (Home `/`)
- Fetch `web_images.json` from `NEXT_PUBLIC_STATIC_BASE_URL` at build time (SSG) with revalidate (e.g., `revalidate = 3600`).
- Render edge‑to‑edge responsive grid:
  - Use CSS grid with `grid-auto-rows` technique to maintain consistent gutters.
  - Each card shows only the image; on hover (desktop) or tap (mobile), overlay title/object name.
- Clicking goes to `/gallery/[id]` where `id` is the index or a stable slug derived from `objectId+filename`.

### 5.3 Details Page `/gallery/[id]`
- Layout splits image + info panel:
  - **Desktop/Landscape**: image left (flex-grow), info panel right (fixed width ~360–420px).
  - **Mobile Portrait**: image first, panel stacked below.
- Panel contents:
  - Title/displayName, RA/Dec, constellation, capture notes (optional), gear lists if available per image (optional), dimensions.
- **Next / Previous** navigation lives here (top or bottom of panel).
- Clicking the image opens **FullscreenViewer**.

### 5.4 Full‑screen Viewer
- Modal that hides info panel; keyboard shortcuts: arrows (ignored for nav per requirement), `+`/`-` zoom, drag/touch pan, `Esc` to exit.
- Zoom presets (fit, 1x, 2x). Use CSS transform with pointer events.

### 5.5 Articles
- Index page lists MDX articles (sorted by date desc). Card shows title, excerpt, date.
- Individual article page renders MDX with **SEO** metadata component (`<Seo />`) pulling title/description and OG image (optional frontmatter field).
- Support linking to gallery details via `/gallery/[id]` links.

### 5.6 About
- Distinct visual style (e.g., subtle starfield bg or different card treatment).
- Sections: short bio (story), photo of you, gear split into **DSO** vs **Planetary**, locations (Kona, Mauna Kea), social links (AstroBin, Instagram, GitHub).

### 5.7 SEO & Sitemap
- Use Next.js Metadata API for titles/descriptions per route.
- Add `/sitemap.xml` and `/robots.txt` routes.
- OG/Twitter cards per article; default site OG for other pages.

---

## 6) Data Model & Utilities

### 6.1 `web_images.json` schema
```json
[
  {
    "objectId": "m31",
    "displayName": "Andromeda Galaxy",
    "ra": 0.7123138889,
    "dec": 41.26875,
    "constellation": "Andromeda",
    "imageFilename": "m31.jpg",
    "height": 2800,
    "width": 4100
  }
]
```

### 6.2 Derived fields in app
- `id`: stable slug, e.g., `slug = `${objectId}__${imageFilename.replace(/\.[^.]+$/, '')}`
- `srcOriginal`: `${MEDIA_BASE}/${imageFilename}`
- `srcThumb`: `${MEDIA_BASE}/thumbs/1280/${basename}.webp` (or nearest size)

### 6.3 TypeScript types (`src/lib/types.ts`)
```ts
export type ImageItem = {
  objectId: string;
  displayName: string;
  ra: number;
  dec: number;
  constellation: string;
  imageFilename: string;
  height: number;
  width: number;
};
```

---

## 7) Thumbnail Pipeline (WebP 320/640/1280)
**Goal**: Generate WebP thumbnails alongside originals in the media bucket (`thumbs/{size}/{basename}.webp`).

### Option A — Cloud Run Job (Node + sharp)
- Container that:
  1) Reads the bucket,
  2) For each `imageFilename` in `web_images.json`, produces 320/640/1280 WebP,
  3) Uploads to `thumbs/` paths with `Cache-Control: public, max-age=31536000, immutable`.
- Trigger manually or via Cloud Build post‑deploy.

**Minimal script outline**
```
/thumbnailer
  package.json (sharp, @google-cloud/storage)
  index.ts (process list)
  Dockerfile
```

### Option B — Local script (run on your machine)
- Simple Node/TS script using `sharp` to generate WebP files and `gsutil` to upload. Faster to start, no GCP plumbing.

> **v1 recommendation**: Start with **Option B** (local) to get results quickly; upgrade to **Option A** later.

---

## 8) Caching & CDN
- **Images**: long cache (1 year) + immutable; version by filename (content hash optional later).
- **JSON**: modest cache (e.g., 3600s). Use Next.js revalidate on fetches.
- **Compression**: ensure gzip/br for JSON/HTML via Cloud Run.

---

## 9) Commands — Local Dev & Build
```bash
# 1) Bootstrap
pnpm i  # or npm/yarn

# 2) Dev
pnpm dev

# 3) Typecheck & Lint
pnpm typecheck && pnpm lint

# 4) Build
pnpm build && pnpm start
```

**Dockerfile** (multi‑stage, Next.js)
```Dockerfile
# syntax=docker/dockerfile:1
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml* package-lock.json* yarn.lock* ./
RUN npm i -g pnpm && pnpm i --frozen-lockfile || true

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm i -g pnpm && pnpm build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 8080
ENV PORT=8080
CMD ["node", ".next/standalone/server.js"]
```

---

## 10) Cloud Build → Cloud Run (CI/CD)
**cloudbuild.yaml**
```yaml
steps:
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-t', 'us-docker.pkg.dev/IslandSkiesAstro/web-repo/site:$_SHORT_SHA', '.']
  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', 'us-docker.pkg.dev/IslandSkiesAstro/web-repo/site:$_SHORT_SHA']
  - name: 'gcr.io/google.com/cloudsdktool/cloud-sdk'
    entrypoint: gcloud
    args:
      - run
      - deploy
      - islandskiesastro-web
      - --image=us-docker.pkg.dev/IslandSkiesAstro/web-repo/site:$_SHORT_SHA
      - --region=us-central1
      - --platform=managed
      - --allow-unauthenticated
      - --port=8080
substitutions:
  _SHORT_SHA: ${SHORT_SHA}
images:
  - us-docker.pkg.dev/IslandSkiesAstro/web-repo/site:$_SHORT_SHA
```

**Trigger**: On push to `main` branch.

---

## 11) Page/Component Stubs (what Cursor should generate)

### 11.1 `src/lib/images.ts`
- `getImages()` → fetch and parse `web_images.json` from `STATIC_BASE`
- `getImageById(id)` → map slug → item + prev/next ids

### 11.2 `GalleryGrid.tsx`
- Props: `images: NormalizedImage[]`
- Renders responsive grid; each card links to `/gallery/[id]`

### 11.3 `ImageCard.tsx`
- Shows image via `next/image` (thumb 640 by default, `sizes` for responsiveness)
- Hover overlay with `displayName`

### 11.4 `ImageDetailsPanel.tsx`
- Shows metadata (title, ra/dec, constellation, size)
- Next/Prev buttons link to neighbor detail pages

### 11.5 `FullscreenViewer.tsx`
- Modal; zoom (fit/1x/2x), pan, `Esc` to close. No next/prev.

### 11.6 Articles pages
- MDX loader; index sorts by date desc; article page sets `<Seo />` metadata

### 11.7 About page
- Distinct layout with your bio, photo, DSO & Planetary gear lists, social links

---

## 12) SEO & Analytics
- Add `metadata` exports per route (title/description)
- Generate `sitemap.xml` & `robots.txt`
- Insert analytics (GA4 or Plausible) via env toggle later; keep keys in Secret Manager if needed

---

## 13) Accessibility (v1)
- All images have meaningful `alt` (use `displayName` + objectId)
- Keyboard support for full‑screen modal and close
- Sufficient contrast in dark theme

---

## 14) Performance Targets (v1)
- **LCP**: < 2.0s on fast 4G for gallery pages
- **CLS**: ~0 (reserve dimensions via `next/image`)
- Lazy‑load offscreen images (default in next/image)
- Use WebP thumbs for grid & details; original only in full‑screen

---

## 15) Authoring Workflow
- **Gallery**: Update `web_images.json`; upload original JPG/PNG → run thumbnail script → commit (if JSON lives in repo) or upload to bucket (if remote). Site rebuild via CI.
- **Articles**: Add MDX files under `content/articles/` with frontmatter (title, date, description, ogImage optional).
- **About**: Edit static page content and gear lists.

---

## 16) Nice‑to‑haves (v2)
- Faceted filters (object type, constellation, camera, telescope)
- On‑the‑fly image resizing via Image CDN (Cloudflare Images or Cloud Run image proxy)
- Search across Articles + Gallery
- EXIF/processing notes per image
- Staging environment with separate buckets

---

## 17) Cut‑and‑Paste Tasks for Cursor

### A) Scaffold the project
1. **Init Next.js + Tailwind**
   - Create Next.js (App Router, TS), add Tailwind, set dark theme defaults.
2. **Add pages**: `/`, `/gallery/[id]`, `/articles`, `/articles/[slug]`, `/about`.
3. **Add components**: Grid, Card, DetailsPanel, FullscreenViewer, Navbar, Footer, Seo.
4. **Lib**: `images.ts`, `markdown.ts`, `config.ts`, `types.ts`.

### B) Wire data & rendering
1. Fetch `web_images.json` from `NEXT_PUBLIC_STATIC_BASE_URL`.
2. Normalize items and create stable `id` slugs.
3. Grid uses `thumbs/640` by default (sizes attr for responsive).
4. Details page uses `thumbs/1280`; click image → Full‑screen uses original.
5. Next/Prev in Details page only.

### C) Article system (MDX)
1. MDX loader with frontmatter (title, date, description, ogImage).
2. Articles list w/ excerpt; article page with `<Seo />`.

### D) About page
1. Distinct background or card style.
2. Sections for bio, photo, gear lists (DSO/Planetary), locations, social links.

### E) SEO & sitemap
1. Metadata per route.
2. `sitemap.ts` and `robots.ts` in `app/`.

### F) Build & deploy
1. Add `Dockerfile` (multi‑stage) + `cloudbuild.yaml`.
2. Cloud Build trigger on `main` → deploy Cloud Run service.
3. Point DNS; set managed SSL; (optionally) front media bucket with CDN.

### G) Thumbnail pipeline (local first)
1. Node script using `sharp` to create WebP at 320/640/1280.
2. Upload to `gs://islandskiesastro-media/thumbs/{size}/{basename}.webp` with long cache.

---

## 18) Acceptance Checklist (v1)
- [ ] Gallery grid displays all items from `web_images.json`
- [ ] Detail page layout matches desktop/landscape vs mobile/portrait rules
- [ ] Clicking image opens full‑screen; zoom/pan works; `Esc` closes
- [ ] Next/Prev only on detail pages
- [ ] Articles list & pages render; SEO tags present; sitemap works
- [ ] About page visually distinct; gear lists separated (DSO vs Planetary)
- [ ] Media loads from GCS; thumbs are WebP; cache headers set
- [ ] Deployed on Cloud Run with HTTPS

---

## 19) Open Decisions (safe defaults applied in v1)
- **Staging env**: v1 ships with **prod only**. Can add staging later.
- **CDN**: v1 can use direct GCS (fast enough); can front with CDN later.
- **Analytics**: placeholder only; add GA4/Plausible after launch.
- **Image hash versioning**: not required in v1; filenames act as versions.

---

## 20) Quick Tips
- Keep `web_images.json` clean (no trailing commas; consistent fields). Duplicate `objectId` for variants is fine (use filename to disambiguate).
- Prefer **landscape 3:2** thumbs for grid uniformity; let detail/full‑screen honor original aspect.
- Always set `alt` = `${displayName} (${objectId})` for accessibility.

---

**End of v1 plan.**

