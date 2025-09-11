import { NormalizedImage } from '@/lib/types';
import ImageCard from './ImageCard';

interface GalleryGridProps {
  images: NormalizedImage[];
}

export default function GalleryGrid({ images }: GalleryGridProps) {
  if (images.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 text-lg">No images found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
      {images.map((image) => (
        <ImageCard key={image.id} image={image} />
      ))}
    </div>
  );
}
