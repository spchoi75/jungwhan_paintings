'use client';

import { useEffect, useCallback } from 'react';
import { Artwork } from '@/types/artwork';
import ZoomableImage from './ZoomableImage';

interface ArtworkModalProps {
  artwork: Artwork;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  hasPrev?: boolean;
  hasNext?: boolean;
}

export default function ArtworkModal({
  artwork,
  onClose,
  onPrev,
  onNext,
  hasPrev = false,
  hasNext = false,
}: ArtworkModalProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          if (hasPrev && onPrev) onPrev();
          break;
        case 'ArrowRight':
          if (hasNext && onNext) onNext();
          break;
      }
    },
    [onClose, onPrev, onNext, hasPrev, hasNext]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [handleKeyDown]);

  const formatSize = () => {
    if (!artwork.width || !artwork.height) return null;
    return `${artwork.width} × ${artwork.height} cm`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black animate-fade-in">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-20 w-10 h-10 flex items-center justify-center text-white/70 hover:text-white transition-colors"
        aria-label="모달 닫기"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      {/* Navigation buttons */}
      {hasPrev && onPrev && (
        <button
          onClick={onPrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center text-white/70 hover:text-white transition-colors"
          aria-label="이전 작품"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
      )}

      {hasNext && onNext && (
        <button
          onClick={onNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center text-white/70 hover:text-white transition-colors"
          aria-label="다음 작품"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      )}

      {/* Image container */}
      <div className="absolute inset-0 top-0 bottom-24">
        <ZoomableImage src={artwork.image_url} alt={artwork.title} />
      </div>

      {/* Artwork info */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent pt-12 pb-6 px-6 max-h-[40%] overflow-y-auto">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-white text-xl font-medium">{artwork.title}</h2>
          <p className="text-white/60 text-sm mt-2">
            {artwork.year}
            {formatSize() && ` · ${formatSize()}`}
            {artwork.medium && ` · ${artwork.medium}`}
          </p>
          {artwork.description && (
            <p className="text-white/80 text-sm mt-4 leading-relaxed whitespace-pre-line">
              {artwork.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
