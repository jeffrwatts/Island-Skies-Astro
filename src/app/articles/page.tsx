import Link from 'next/link';
import { getAllArticles } from '@/lib/markdown';

export default async function ArticlesPage() {
  const articles = await getAllArticles();

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Articles</h1>
          <p className="text-gray-400">
            Thoughts on astrophotography, equipment, and techniques
          </p>
        </div>

        {articles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No articles found.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {articles.map((article) => (
              <article key={article.slug} className="bg-gray-800 rounded-lg p-6">
                <Link href={`/articles/${article.slug}`} className="group">
                  <h2 className="text-xl font-semibold text-white group-hover:text-blue-400 transition-colors mb-2">
                    {article.metadata.title}
                  </h2>
                  <p className="text-gray-400 mb-3">
                    {article.metadata.description}
                  </p>
                  <time className="text-sm text-gray-500">
                    {new Date(article.metadata.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
