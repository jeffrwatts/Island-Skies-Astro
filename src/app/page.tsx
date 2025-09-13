import { getImages } from '@/lib/images';
import GalleryGrid from '@/components/GalleryGrid';

export default async function Home() {
  const images = await getImages();

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#1a1a1a' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <GalleryGrid images={images} />
      </div>
    </div>
  );
}
