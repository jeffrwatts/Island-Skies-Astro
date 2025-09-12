'use client';

interface DetailPaneCloseButtonProps {
  onClose: () => void;
}

export default function DetailPaneCloseButton({ onClose }: DetailPaneCloseButtonProps) {
  return (
    <button
      onClick={onClose}
      className="absolute top-2 right-2 z-20 bg-gray-800 hover:bg-gray-700 text-white rounded-full w-8 h-8 flex items-center justify-center transition-colors border border-gray-600"
      aria-label="Close details"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m18 6-12 12"/>
        <path d="m6 6 12 12"/>
      </svg>
    </button>
  );
}
