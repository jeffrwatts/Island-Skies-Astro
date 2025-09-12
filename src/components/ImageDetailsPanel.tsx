import { NormalizedImage } from '@/lib/types';

interface ImageDetailsPanelProps {
  image: NormalizedImage;
}

export default function ImageDetailsPanel({ 
  image
}: ImageDetailsPanelProps) {
  const formatCoordinate = (coord: number, isRA: boolean) => {
    if (isRA) {
      const hours = Math.floor(coord);
      const minutes = Math.floor((coord - hours) * 60);
      const seconds = ((coord - hours) * 60 - minutes) * 60;
      return `${hours}h ${minutes}m ${seconds.toFixed(1)}s`;
    } else {
      const degrees = Math.floor(Math.abs(coord));
      const minutes = Math.floor((Math.abs(coord) - degrees) * 60);
      const seconds = ((Math.abs(coord) - degrees) * 60 - minutes) * 60;
      const sign = coord >= 0 ? '+' : '-';
      return `${sign}${degrees}° ${minutes}' ${seconds.toFixed(1)}"`;
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 h-fit">
      {/* Title */}
      <h1 className="text-2xl font-bold text-white mb-2">{image.displayName}</h1>
      <p className="text-gray-400 mb-6">{image.constellation}</p>
      
      {/* Coordinates */}
      <div className="space-y-3 mb-6">
        <div>
          <span className="text-gray-500 text-sm">Right Ascension</span>
          <p className="text-white font-mono">{formatCoordinate(image.ra, true)}</p>
        </div>
        <div>
          <span className="text-gray-500 text-sm">Declination</span>
          <p className="text-white font-mono">{formatCoordinate(image.dec, false)}</p>
        </div>
      </div>
      
      {/* Image dimensions */}
      <div className="mb-6">
        <span className="text-gray-500 text-sm">Dimensions</span>
        <p className="text-white">{image.width} × {image.height} pixels</p>
      </div>
    </div>
  );
}
