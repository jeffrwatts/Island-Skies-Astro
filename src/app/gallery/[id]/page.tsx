import { notFound } from 'next/navigation';
import { getImageById, getAllImageIds } from '@/lib/images';
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
    <GalleryPageClient 
      image={image} 
      prevId={prevId} 
      nextId={nextId} 
    />
  );
}

// Generate static params for all images
export async function generateStaticParams() {
  const imageIds = await getAllImageIds();
  return imageIds.map((id) => ({
    id,
  }));
}