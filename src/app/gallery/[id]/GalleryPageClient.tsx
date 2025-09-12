'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { NormalizedImage } from '@/lib/types';
import { config } from '@/lib/config';
import ScrollLock from '@/components/ScrollLock';
import ImageDetailsPanel from '@/components/ImageDetailsPanel';
import DetailPaneCloseButton from '@/components/DetailPaneCloseButton';

interface GalleryPageClientProps {
  image: NormalizedImage;
  prevId: string | null;
  nextId: string | null;
}

export default function GalleryPageClient({ image, prevId, nextId }: GalleryPageClientProps) {
  const router = useRouter();

  return (
    <>
      <ScrollLock />
      <style dangerouslySetInnerHTML={{
        __html: `
          .gallery-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100dvh;
            background-color: #1f2937;
            padding: 0.5rem;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: flex-start;
            overflow: hidden;
          }
          
          .image-container {
            flex: 1;
            display: flex;
            align-items: flex-start;
            justify-content: center;
            min-height: 0;
            width: 100%;
            position: relative;
          }
          
          .details-container {
            flex-shrink: 0;
            width: 100%;
            max-height: 40vh;
            overflow-y: auto;
            margin-top: 0.5rem;
            position: relative;
          }
          
          .portrait-control-bar {
            position: absolute;
            top: 0.5rem;
            right: 0.5rem;
            z-index: 20;
          }
          
          .nav-arrow {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            z-index: 20;
            color: white;
            text-decoration: none;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 40px;
            height: 80px;
            border-radius: 20px;
            background-color: rgba(0, 0, 0, 0.2);
            backdrop-filter: blur(6px);
            opacity: 0.4;
            transition: all 0.2s ease;
            pointer-events: auto;
            border: 1px solid rgba(255, 255, 255, 0.15);
          }
          
          .nav-arrow-left {
            left: 1rem;
          }
          
          .nav-arrow-right {
            right: 1rem;
          }
          
          .nav-arrow:hover {
            opacity: 0.7;
            background-color: rgba(0, 0, 0, 0.3);
            transform: translateY(-50%) scale(1.05);
          }
          
          .nav-arrow:active {
            transform: translateY(-50%) scale(0.95);
          }
          
          @media (orientation: landscape), (min-width: 768px) {
            .gallery-container {
              flex-direction: row;
              align-items: center;
              justify-content: flex-start;
            }
            
            .image-container {
              flex: 1;
              height: 100%;
              align-items: center;
              justify-content: center;
            }
            
            .details-container {
              flex: 0 0 50%;
              max-height: 100vh;
              margin-top: 0;
              margin-left: 0.5rem;
            }
            
            .portrait-control-bar {
              display: none;
            }
          }
          
        `
      }} />
      <div className="gallery-container">
        <div className="image-container">
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <img
              src={`${config.mediaBaseUrl}/thumbs/${config.thumbnailSizes.large}/${image.imageFilename.replace(/\.[^.]+$/, '')}.webp`}
              alt={`${image.displayName} (${image.objectId})`}
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain'
              }}
            />
            
            {/* Navigation arrows - transparent in landscape, hidden in portrait */}
            {prevId && (
              <Link 
                href={`/gallery/${prevId}`}
                className="nav-arrow nav-arrow-left"
                aria-label="Previous image"
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m15 18-6-6 6-6"/>
                </svg>
              </Link>
            )}

            {nextId && (
              <Link 
                href={`/gallery/${nextId}`}
                className="nav-arrow nav-arrow-right"
                aria-label="Next image"
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m9 18 6-6-6-6"/>
                </svg>
              </Link>
            )}
          </div>
          
          {/* Portrait control bar */}
          <div className="portrait-control-bar">
            <DetailPaneCloseButton onClose={() => router.push('/')} />
          </div>
        </div>
        
        <div className="details-container">
          <DetailPaneCloseButton onClose={() => router.push('/')} />
          <ImageDetailsPanel 
            image={image} 
          />
        </div>
      </div>
    </>
  );
}
