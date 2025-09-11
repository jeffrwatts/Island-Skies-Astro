import { MetadataRoute } from 'next';
import { getAllImageIds } from '@/lib/images';
import { getAllArticleSlugs } from '@/lib/markdown';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://islandskiesastro.com'; // Update with your actual domain
  
  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/articles`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
  ];

  // Gallery pages
  const imageIds = await getAllImageIds();
  const galleryPages = imageIds.map((id) => ({
    url: `${baseUrl}/gallery/${id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Article pages
  const articleSlugs = await getAllArticleSlugs();
  const articlePages = articleSlugs.map((slug) => ({
    url: `${baseUrl}/articles/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...staticPages, ...galleryPages, ...articlePages];
}
