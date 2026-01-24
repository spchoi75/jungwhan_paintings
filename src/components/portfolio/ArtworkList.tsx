'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Artwork } from '@/types/artwork';
import ArtworkModal from '@/components/artwork/ArtworkModal';

interface ArtworkListProps {
  artworks: Artwork[];
}

export default function ArtworkList({ artworks }: ArtworkListProps) {
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);

  if (artworks.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-400">No artworks in this category</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {artworks.map((artwork) => (
          <button
            key={artwork.id}
            onClick={() => setSelectedArtwork(artwork)}
            className="group text-left"
          >
            <div className="aspect-[4/3] relative overflow-hidden bg-gray-100">
              <Image
                src={artwork.thumbnail_url || artwork.image_url}
                alt={artwork.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            <div className="mt-3">
              <h3 className="text-base tracking-wide font-light">
                {artwork.title}
              </h3>
              <p className="text-sm text-gray-500 mt-0.5">{artwork.year}</p>
            </div>
          </button>
        ))}
      </div>

      {selectedArtwork && (
        <ArtworkModal
          artwork={selectedArtwork}
          onClose={() => setSelectedArtwork(null)}
        />
      )}
    </>
  );
}
