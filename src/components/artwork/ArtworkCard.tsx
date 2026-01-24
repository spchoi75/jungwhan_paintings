'use client';

import Image from 'next/image';
import { Artwork } from '@/types/artwork';

interface ArtworkCardProps {
  artwork: Artwork;
  onClick: () => void;
  priority?: boolean;
}

export default function ArtworkCard({ artwork, onClick, priority = false }: ArtworkCardProps) {
  return (
    <button
      onClick={onClick}
      className="group relative aspect-[4/5] w-full overflow-hidden bg-[var(--border)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2"
      aria-label={`작품 상세 보기: ${artwork.title}`}
    >
      <Image
        src={artwork.thumbnail_url}
        alt={artwork.title}
        fill
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        priority={priority}
      />
      <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/40" />
      <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
        <p className="text-white text-sm font-medium">{artwork.title}</p>
        <p className="text-white/70 text-xs mt-1">{artwork.year}</p>
      </div>
    </button>
  );
}
