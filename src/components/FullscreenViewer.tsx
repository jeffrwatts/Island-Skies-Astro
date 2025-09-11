'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { NormalizedImage } from '@/lib/types';

interface FullscreenViewerProps {
  image: NormalizedImage | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function FullscreenViewer({ image, isOpen, onClose }: FullscreenViewerProps) {
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case '+':
        case '=':
          e.preventDefault();
          setZoom(prev => Math.min(prev * 1.2, 4));
          break;
        case '-':
          e.preventDefault();
          setZoom(prev => Math.max(prev / 1.2, 0.1));
          break;
        case '0':
          e.preventDefault();
          setZoom(1);
          setPosition({ x: 0, y: 0 });
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom(prev => Math.max(0.1, Math.min(4, prev * delta)));
  };

  if (!isOpen || !image) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-95 flex items-center justify-center">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 text-white hover:text-gray-300 transition-colors"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Zoom controls */}
      <div className="absolute top-4 left-4 z-10 flex space-x-2">
        <button
          onClick={() => setZoom(prev => Math.min(prev * 1.2, 4))}
          className="px-3 py-1 bg-gray-800 hover:bg-gray-700 text-white rounded text-sm transition-colors"
        >
          +
        </button>
        <button
          onClick={() => setZoom(prev => Math.max(prev / 1.2, 0.1))}
          className="px-3 py-1 bg-gray-800 hover:bg-gray-700 text-white rounded text-sm transition-colors"
        >
          -
        </button>
        <button
          onClick={() => {
            setZoom(1);
            setPosition({ x: 0, y: 0 });
          }}
          className="px-3 py-1 bg-gray-800 hover:bg-gray-700 text-white rounded text-sm transition-colors"
        >
          Fit
        </button>
      </div>

      {/* Image container */}
      <div
        className="relative max-w-full max-h-full cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        style={{
          transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
          transition: isDragging ? 'none' : 'transform 0.1s ease-out',
        }}
      >
        <Image
          src={image.srcOriginal}
          alt={`${image.displayName} (${image.objectId})`}
          width={image.width}
          height={image.height}
          className="max-w-none"
          priority
        />
      </div>

      {/* Image info */}
      <div className="absolute bottom-4 left-4 z-10 text-white">
        <p className="text-sm">{image.displayName}</p>
        <p className="text-xs text-gray-400">{image.constellation}</p>
      </div>
    </div>
  );
}
