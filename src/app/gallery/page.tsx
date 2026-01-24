'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import { Artwork } from '@/types/artwork';
import ArtworkGrid from '@/components/artwork/ArtworkGrid';
import ArtworkModal from '@/components/artwork/ArtworkModal';

export default function GalleryPage() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    async function fetchArtworks() {
      const { data, error } = await supabase
        .from('artworks')
        .select('*')
        .order('order', { ascending: true });

      if (error) {
        setError('작품을 불러올 수 없습니다');
        console.error('Error fetching artworks:', error);
      } else {
        setArtworks(data || []);
      }
      setLoading(false);
    }

    fetchArtworks();
  }, []);

  const selectedArtwork = selectedIndex !== null ? artworks[selectedIndex] : null;

  const handlePrev = () => {
    if (selectedIndex !== null && selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
    }
  };

  const handleNext = () => {
    if (selectedIndex !== null && selectedIndex < artworks.length - 1) {
      setSelectedIndex(selectedIndex + 1);
    }
  };

  return (
    <>
      <main className="min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-[var(--background)]/80 backdrop-blur-sm border-b border-[var(--border)]">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link
              href="/"
              className="font-[family-name:var(--font-cormorant)] text-xl"
            >
              Jungwhan
            </Link>
            <div className="flex items-center gap-6">
              <span className="text-sm text-[var(--foreground)]">Gallery</span>
              <Link
                href="/about"
                className="text-sm text-[var(--text-secondary)] hover:text-[var(--foreground)] transition-colors"
              >
                About
              </Link>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="aspect-[4/5] bg-[var(--border)] animate-pulse"
                />
              ))}
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20">
              <p className="text-[var(--text-secondary)] mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="text-[var(--accent)] hover:underline"
              >
                다시 시도
              </button>
            </div>
          ) : (
            <ArtworkGrid
              artworks={artworks}
              onSelect={(_, index) => setSelectedIndex(index)}
            />
          )}
        </div>
      </main>

      {selectedArtwork && (
        <ArtworkModal
          artwork={selectedArtwork}
          onClose={() => setSelectedIndex(null)}
          onPrev={handlePrev}
          onNext={handleNext}
          hasPrev={selectedIndex !== null && selectedIndex > 0}
          hasNext={selectedIndex !== null && selectedIndex < artworks.length - 1}
        />
      )}
    </>
  );
}
