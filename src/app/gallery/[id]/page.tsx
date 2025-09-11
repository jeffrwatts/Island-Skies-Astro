import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getImageById, getAllImageIds } from '@/lib/images';
import { config } from '@/lib/config';
import GalleryPageClient from './GalleryPageClient';

interface GalleryPageProps {
  params: {
    id: string;
  };
}

export default async function GalleryPage({ params }: GalleryPageProps) {
  const { id } = await params;
  const { image, prevId, nextId } = await getImageById(id);

  if (!image) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <Link 
            href="/" 
            className="text-gray-400 hover:text-white transition-colors"
          >
            ← Back to Gallery
          </Link>
        </nav>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Image */}
          <div className="lg:col-span-2">
            <div className="relative rounded-lg overflow-hidden bg-gray-800">
              <Image
                src={`${config.mediaBaseUrl}/thumbs/${config.thumbnailSizes.large}/${image.imageFilename.replace(/\.[^.]+$/, '')}.webp`}
                alt={`${image.displayName} (${image.objectId})`}
                width={image.width}
                height={image.height}
                className="w-full h-auto"
                sizes="(max-width: 1024px) 100vw, 66vw"
              />
            </div>
          </div>

          {/* Details Panel */}
          <div className="lg:col-span-1">
            <GalleryPageClient
              image={image}
              prevId={prevId}
              nextId={nextId}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Generate static params for all images
export async function generateStaticParams() {
  const imageIds = await getAllImageIds();
  return imageIds.map((id) => ({
    id,
  }));
}
