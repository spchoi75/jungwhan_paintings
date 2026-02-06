'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { Artwork } from '@/types/artwork';
import ArtworkModal from '@/components/artwork/ArtworkModal';
import { useLocale } from '@/i18n';
import { getLocalizedValue } from '@/lib/i18n-utils';

interface ArtworkListProps {
  artworks: Artwork[];
}

export default function ArtworkList({ artworks }: ArtworkListProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const { locale } = useLocale();

  const selectedArtwork = selectedIndex !== null ? artworks[selectedIndex] : null;

  const handlePrev = useCallback(() => {
    if (selectedIndex !== null && selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
    }
  }, [selectedIndex]);

  const handleNext = useCallback(() => {
    if (selectedIndex !== null && selectedIndex < artworks.length - 1) {
      setSelectedIndex(selectedIndex + 1);
    }
  }, [selectedIndex, artworks.length]);

  const hasPrev = selectedIndex !== null && selectedIndex > 0;
  const hasNext = selectedIndex !== null && selectedIndex < artworks.length - 1;

  if (artworks.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-[var(--text-secondary)]">No artworks in this category</p>
      </div>
    );
  }

  return (
    <>
      {/* Responsive grid: 2 cols (mobile) → 3 cols (tablet) → 4 cols (desktop) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {artworks.map((artwork, index) => (
          <button
            key={artwork.id}
            onClick={() => setSelectedIndex(index)}
            className="group block aspect-square relative overflow-hidden bg-[var(--border)] text-left"
          >
            {/* Image */}
            <Image
              src={artwork.thumbnail_url || artwork.image_url}
              alt={getLocalizedValue(locale, artwork.title, artwork.title_en)}
              fill
              loading="lazy"
              className="object-contain transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 25vw"
            />

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300" />

            {/* Artwork info (visible on hover) */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="text-[var(--foreground)] text-center text-sm font-light tracking-wider">
                {getLocalizedValue(locale, artwork.title, artwork.title_en)}
              </span>
              <span className="text-[var(--foreground)]/70 text-xs mt-1">
                {artwork.year}
              </span>
            </div>
          </button>
        ))}
      </div>

      {selectedArtwork && (
        <ArtworkModal
          artwork={selectedArtwork}
          onClose={() => setSelectedIndex(null)}
          onPrev={handlePrev}
          onNext={handleNext}
          hasPrev={hasPrev}
          hasNext={hasNext}
        />
      )}
    </>
  );
}
