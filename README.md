# Island Skies Astro

An AstroBin-style gallery website built with Next.js, TypeScript, and Tailwind CSS, hosted on Google Cloud Platform.

## Features

- **Gallery Grid**: Clean, responsive grid layout with hover effects
- **Image Details**: Dedicated pages with metadata panels and navigation
- **Fullscreen Viewer**: Zoom, pan, and keyboard controls for detailed viewing
- **Articles**: MDX-based blog system with SEO optimization
- **About Page**: Distinctive design with equipment lists and social links
- **SEO Optimized**: Sitemap, robots.txt, and metadata for all pages
- **Cloud Deployment**: Ready for Google Cloud Run deployment

## Tech Stack

- **Framework**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS (dark theme)
- **Content**: MDX for articles, JSON for gallery data
- **Deployment**: Google Cloud Run + Cloud Storage + Cloud CDN
- **CI/CD**: Google Cloud Build

## Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   Create `.env.local` with:
   ```
   NEXT_PUBLIC_MEDIA_BASE_URL=https://storage.googleapis.com/islandskiesastro-media
   NEXT_PUBLIC_STATIC_BASE_URL=https://storage.googleapis.com/islandskiesastro-static
   WEB_IMAGES_INDEX=web_images.json
   SITE_NAME=Island Skies Astro
   ```

3. **Run development server**:
   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```

## Project Structure

```
islandskiesastro/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── gallery/[id]/       # Gallery detail pages
│   │   ├── articles/           # Article pages
│   │   └── about/              # About page
│   ├── components/             # React components
│   └── lib/                    # Utilities and types
├── content/
│   └── articles/               # MDX article files
├── data/
│   └── web_images.json         # Gallery data
├── scripts/
│   └── generate-thumbnails.ts  # Thumbnail generation
├── Dockerfile                  # Container configuration
└── cloudbuild.yaml            # CI/CD pipeline
```

## Gallery Data Format

The gallery uses `data/web_images.json` with this structure:

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

## Thumbnail Generation

Generate WebP thumbnails for your images:

```bash
# Generate thumbnails (requires original images in data/images/)
npx tsx scripts/generate-thumbnails.ts

# Upload to Google Cloud Storage
npx tsx scripts/generate-thumbnails.ts upload
```

## Deployment

### Google Cloud Setup

1. **Create GCP project**:
   ```bash
   gcloud projects create IslandSkiesAstro
   gcloud config set project IslandSkiesAstro
   ```

2. **Enable services**:
   ```bash
   gcloud services enable run.googleapis.com cloudbuild.googleapis.com storage.googleapis.com
   ```

3. **Create storage buckets**:
   ```bash
   gsutil mb gs://islandskiesastro-media
   gsutil mb gs://islandskiesastro-static
   gsutil iam ch allUsers:objectViewer gs://islandskiesastro-media
   gsutil iam ch allUsers:objectViewer gs://islandskiesastro-static
   ```

4. **Upload gallery data**:
   ```bash
   gsutil cp data/web_images.json gs://islandskiesastro-static/
   ```

5. **Deploy with Cloud Build**:
   ```bash
   gcloud builds submit --config cloudbuild.yaml
   ```

## Development

- **Type checking**: `npm run typecheck`
- **Linting**: `npm run lint`
- **Build**: `npm run build`
- **Start**: `npm start`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details.