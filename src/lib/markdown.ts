import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Article, ArticleMetadata } from './types';

const articlesDirectory = path.join(process.cwd(), 'content/articles');

/**
 * Gets all article slugs
 */
export function getAllArticleSlugs(): string[] {
  try {
    const fileNames = fs.readdirSync(articlesDirectory);
    return fileNames
      .filter(name => name.endsWith('.mdx'))
      .map(name => name.replace(/\.mdx$/, ''));
  } catch (error) {
    console.error('Error reading articles directory:', error);
    return [];
  }
}

/**
 * Gets article metadata and content by slug
 */
export function getArticleBySlug(slug: string): Article | null {
  try {
    const fullPath = path.join(articlesDirectory, `${slug}.mdx`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    
    return {
      slug,
      metadata: data as ArticleMetadata,
      content,
    };
  } catch (error) {
    console.error(`Error reading article ${slug}:`, error);
    return null;
  }
}

/**
 * Gets all articles sorted by date (newest first)
 */
export function getAllArticles(): Article[] {
  const slugs = getAllArticleSlugs();
  const articles = slugs
    .map(slug => getArticleBySlug(slug))
    .filter((article): article is Article => article !== null)
    .sort((a, b) => new Date(b.metadata.date).getTime() - new Date(a.metadata.date).getTime());
  
  return articles;
}
