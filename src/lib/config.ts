export const config = {
  siteName: process.env.SITE_NAME || 'Island Skies Astro',
  // Always use Google Cloud Storage URLs in production
  mediaBaseUrl: process.env.NEXT_PUBLIC_MEDIA_BASE_URL || 'https://storage.googleapis.com/islandskiesastro-media',
  staticBaseUrl: process.env.NEXT_PUBLIC_STATIC_BASE_URL || 'https://storage.googleapis.com/islandskiesastro-static',
  webImagesIndex: process.env.WEB_IMAGES_INDEX || 'web_images.json',
  
  // Thumbnail sizes
  thumbnailSizes: {
    medium: 640,
    large: 1080,
  },

  // Default thumbnail size for grid
  defaultThumbnailSize: 640,
  
  // Cache settings
  revalidate: 3600, // 1 hour
} as const;