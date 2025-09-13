import Image from 'next/image';
import Link from 'next/link';
import { NormalizedImage } from '@/lib/types';

interface ImageCardProps {
  image: NormalizedImage;
}

export default function ImageCard({ image }: ImageCardProps) {
  return (
    <Link href={`/gallery/${image.id}`} className="group block w-full">
      <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-gray-800 w-full">
        <Image
          src={image.srcThumb}
          alt={`${image.displayName} (${image.objectId})`}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
        />
        
        {/* Overlay with title */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-end">
          <div className="p-3 sm:p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <h3 className="font-semibold text-sm sm:text-lg leading-tight text-gray-300">{image.displayName}</h3>
            <p className="text-xs sm:text-sm text-gray-300">{image.constellation}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
