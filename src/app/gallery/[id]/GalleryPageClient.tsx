'use client';

import { useState } from 'react';
import { NormalizedImage } from '@/lib/types';
import ImageDetailsPanel from '@/components/ImageDetailsPanel';
import FullscreenViewer from '@/components/FullscreenViewer';

interface GalleryPageClientProps {
  image: NormalizedImage;
  prevId: string | null;
  nextId: string | null;
}

export default function GalleryPageClient({ image, prevId, nextId }: GalleryPageClientProps) {
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);

  const handleImageClick = () => {
    setIsFullscreenOpen(true);
  };

  return (
    <>
      <ImageDetailsPanel
        image={image}
        prevId={prevId}
        nextId={nextId}
        onImageClick={handleImageClick}
      />
      
      <FullscreenViewer
        image={image}
        isOpen={isFullscreenOpen}
        onClose={() => setIsFullscreenOpen(false)}
      />
    </>
  );
}
