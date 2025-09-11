import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllArticleSlugs, getArticleBySlug } from '@/lib/markdown';
import { MDXRemote } from 'next-mdx-remote/rsc';

interface ArticlePageProps {
  params: {
    slug: string;
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <Link 
            href="/articles" 
            className="text-gray-400 hover:text-white transition-colors"
          >
            ← Back to Articles
          </Link>
        </nav>

        {/* Article header */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            {article.metadata.title}
          </h1>
          <time className="text-gray-400">
            {new Date(article.metadata.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
        </header>

        {/* Article content */}
        <article className="prose prose-invert max-w-none">
          <MDXRemote source={article.content} />
        </article>
      </div>
    </div>
  );
}

// Generate static params for all articles
export async function generateStaticParams() {
  const slugs = await getAllArticleSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  
  if (!article) {
    return {
      title: 'Article Not Found',
    };
  }

  return {
    title: article.metadata.title,
    description: article.metadata.description,
    openGraph: {
      title: article.metadata.title,
      description: article.metadata.description,
      images: article.metadata.ogImage ? [article.metadata.ogImage] : [],
    },
  };
}
