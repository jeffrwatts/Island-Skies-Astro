import { ImageItem, NormalizedImage } from './types';
import { config } from './config';

/**
 * Creates a stable slug from objectId and filename
 */
function createImageId(objectId: string, filename: string): string {
  const basename = filename.replace(/\.[^.]+$/, '');
  return `${objectId}__${basename}`;
}

/**
 * Normalizes an ImageItem with derived fields
 */
function normalizeImage(item: ImageItem): NormalizedImage {
  const id = createImageId(item.objectId, item.imageFilename);
  const basename = item.imageFilename.replace(/\.[^.]+$/, '');
  
  // For local development, use generated thumbnails
  const isLocalDev = config.mediaBaseUrl.startsWith('/');
  const thumbnailUrl = isLocalDev 
    ? `${config.mediaBaseUrl}/thumbs/${config.defaultThumbnailSize}/${basename}.webp`
    : `${config.mediaBaseUrl}/thumbs/${config.defaultThumbnailSize}/${basename}.webp`;
  
  return {
    ...item,
    id,
    srcOriginal: `${config.mediaBaseUrl}/${item.imageFilename}`,
    srcThumb: thumbnailUrl,
    srcThumb640: `${config.mediaBaseUrl}/thumbs/640/${basename}.webp`,
    srcThumb1080: `${config.mediaBaseUrl}/thumbs/1080/${basename}.webp`,
  };
}

/**
 * Fetches and parses web_images.json from static bucket
 */
export async function getImages(): Promise<NormalizedImage[]> {
  try {
    const url = config.staticBaseUrl.startsWith('http') 
      ? `${config.staticBaseUrl}/${config.webImagesIndex}`
      : `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}${config.staticBaseUrl}/${config.webImagesIndex}`;
    
    const response = await fetch(url, {
      next: { revalidate: config.revalidate },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch images: ${response.statusText}`);
    }
    
    const images: ImageItem[] = await response.json();
    return images.map(normalizeImage);
  } catch (error) {
    console.error('Error fetching images:', error);
    return [];
  }
}

/**
 * Gets a specific image by ID and includes prev/next navigation
 */
export async function getImageById(id: string): Promise<{
  image: NormalizedImage | null;
  prevId: string | null;
  nextId: string | null;
}> {
  const images = await getImages();
  const currentIndex = images.findIndex(img => img.id === id);
  
  if (currentIndex === -1) {
    return { image: null, prevId: null, nextId: null };
  }
  
  const image = images[currentIndex];
  const prevId = currentIndex > 0 ? images[currentIndex - 1].id : null;
  const nextId = currentIndex < images.length - 1 ? images[currentIndex + 1].id : null;
  
  return { image, prevId, nextId };
}

/**
 * Gets all image IDs for sitemap generation
 */
export async function getAllImageIds(): Promise<string[]> {
  const images = await getImages();
  return images.map(img => img.id);
}
