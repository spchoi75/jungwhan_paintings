'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import Image from 'next/image';
import ArtworkModal from '@/components/artwork/ArtworkModal';
import { Artwork } from '@/types/artwork';

interface DominantColor {
  h: number;
  s: number;
  l: number;
  isAchromatic: boolean;
}

interface ColorArtwork {
  id: string;
  title: string;
  title_en: string | null;
  year: number;
  image_url: string;
  thumbnail_url: string;
  width: number | null;
  height: number | null;
  dominant_color: DominantColor | null;
}

function getHueBucket(h: number): number {
  if (h >= 330 || h < 30) return 0;
  if (h < 60) return 1;
  if (h < 90) return 2;
  if (h < 150) return 3;
  if (h < 210) return 4;
  if (h < 270) return 5;
  return 6;
}

export default function ColorDistributionView() {
  const [artworks, setArtworks] = useState<ColorArtwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const ITEM_WIDTH = 80; // 각 이미지 너비

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/portfolio');
        if (!res.ok) throw new Error('Failed to fetch data');
        
        const data = await res.json();
        
        const parsed = data.map((a: Record<string, unknown>) => {
          let dominantColor: DominantColor | null = null;
          
          if (a.dominant_color) {
            if (typeof a.dominant_color === 'string') {
              try {
                dominantColor = JSON.parse(a.dominant_color);
              } catch {
                dominantColor = null;
              }
            } else {
              dominantColor = a.dominant_color as DominantColor;
            }
          }
          
          return {
            id: a.id as string,
            title: a.title as string,
            title_en: a.title_en as string | null,
            year: a.year as number,
            image_url: a.image_url as string,
            thumbnail_url: a.thumbnail_url as string,
            width: a.width as number | null,
            height: a.height as number | null,
            dominant_color: dominantColor,
          };
        });
        
        setArtworks(parsed);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('데이터를 로드하는 데 실패했습니다.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 색상 버킷별로 그룹화 + 명도순 정렬
  const { sortedArtworks, achromaticArtworks } = useMemo(() => {
    const chromatic: ColorArtwork[] = [];
    const achromatic: ColorArtwork[] = [];
    
    artworks.forEach(a => {
      if (!a.dominant_color) return;
      
      if (a.dominant_color.isAchromatic) {
        achromatic.push(a);
      } else {
        chromatic.push(a);
      }
    });
    
    // 색상(H) → 명도(L, 밝은 것 먼저) 정렬
    chromatic.sort((a, b) => {
      const bucketA = getHueBucket(a.dominant_color?.h || 0);
      const bucketB = getHueBucket(b.dominant_color?.h || 0);
      if (bucketA !== bucketB) return bucketA - bucketB;
      return (b.dominant_color?.l || 0) - (a.dominant_color?.l || 0);
    });
    
    // 무채색도 명도순 정렬
    achromatic.sort((a, b) => (b.dominant_color?.l || 0) - (a.dominant_color?.l || 0));
    
    return { sortedArtworks: chromatic, achromaticArtworks: achromatic };
  }, [artworks]);

  const fetchArtworkDetail = useCallback(async (artworkId: string) => {
    try {
      const res = await fetch(`/api/portfolio/${artworkId}`);
      if (res.ok) {
        const artwork = await res.json();
        setSelectedArtwork(artwork);
        setModalOpen(true);
      }
    } catch (err) {
      console.error('Error fetching artwork:', err);
    }
  }, []);

  // 이미지 비율 계산 (원본 비율 유지)
  const getAspectRatio = (artwork: ColorArtwork) => {
    if (artwork.width && artwork.height) {
      return artwork.width / artwork.height;
    }
    return 1; // 기본값
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--foreground)] mx-auto mb-4"></div>
          <p className="text-[var(--foreground)]/60">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <p className="text-[var(--foreground)]/60">{error}</p>
      </div>
    );
  }

  const allArtworks = [...sortedArtworks, ...achromaticArtworks];

  return (
    <div className="relative">
      {/* Y축 명도 아이콘 */}
      <div className="flex gap-2">
        <div className="flex flex-col justify-between items-center py-2">
          <span className="text-2xl">☀</span>
          <span className="text-xs">☀</span>
        </div>

        {/* 핀터레스트 스타일 Masonry */}
        <div 
          className="flex-1"
          style={{
            columnCount: Math.floor(900 / ITEM_WIDTH),
            columnGap: '2px',
          }}
        >
          {allArtworks.map((artwork) => {
            const aspectRatio = getAspectRatio(artwork);
            const itemHeight = ITEM_WIDTH / aspectRatio;
            
            return (
              <div
                key={artwork.id}
                className="cursor-pointer hover:ring-2 hover:ring-gray-400 transition-all mb-0.5"
                onClick={() => fetchArtworkDetail(artwork.id)}
                style={{ 
                  breakInside: 'avoid',
                  width: '100%',
                }}
              >
                <div 
                  className="relative w-full"
                  style={{ 
                    paddingBottom: `${(1 / aspectRatio) * 100}%`,
                  }}
                >
                  <Image
                    src={artwork.image_url}
                    alt={artwork.title}
                    fill
                    className="object-contain"
                    sizes={`${ITEM_WIDTH}px`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 모달 */}
      {modalOpen && selectedArtwork && (
        <ArtworkModal
          artwork={selectedArtwork}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}
