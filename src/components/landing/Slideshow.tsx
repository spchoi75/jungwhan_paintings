'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { Artwork } from '@/types/artwork';
import { useLocale } from '@/i18n';
import { getLocalizedValue } from '@/lib/i18n-utils';

interface SlideshowProps {
  artworks: Artwork[];
}

export default function Slideshow({ artworks }: SlideshowProps) {
  const { locale, t } = useLocale();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const dragStartX = useRef(0);
  const dragStartTime = useRef(0);
  const autoPlayTimer = useRef<NodeJS.Timeout | null>(null);

  const goToNext = useCallback(() => {
    if (artworks.length <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % artworks.length);
  }, [artworks.length]);

  const goToPrev = useCallback(() => {
    if (artworks.length <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + artworks.length) % artworks.length);
  }, [artworks.length]);

  // 자동 재생
  const startAutoPlay = useCallback(() => {
    if (artworks.length <= 1) return;
    if (autoPlayTimer.current) clearInterval(autoPlayTimer.current);
    autoPlayTimer.current = setInterval(goToNext, 5000);
  }, [artworks.length, goToNext]);

  const stopAutoPlay = useCallback(() => {
    if (autoPlayTimer.current) {
      clearInterval(autoPlayTimer.current);
      autoPlayTimer.current = null;
    }
  }, []);

  useEffect(() => {
    startAutoPlay();
    return () => stopAutoPlay();
  }, [startAutoPlay, stopAutoPlay]);

  // 드래그 시작
  const handleDragStart = (clientX: number) => {
    if (artworks.length <= 1) return;
    stopAutoPlay();
    setIsDragging(true);
    dragStartX.current = clientX;
    dragStartTime.current = Date.now();
  };

  // 드래그 중 - 실시간으로 따라감
  const handleDragMove = (clientX: number) => {
    if (!isDragging) return;
    const diff = clientX - dragStartX.current;
    setDragOffset(diff);
  };

  // 드래그 종료
  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const containerWidth = containerRef.current?.offsetWidth || window.innerWidth;
    const dragDistance = Math.abs(dragOffset);
    const dragDuration = Date.now() - dragStartTime.current;
    const velocity = dragDistance / dragDuration;

    // 충분히 드래그했거나 빠르게 스와이프
    const threshold = containerWidth * 0.2;
    const fastSwipe = velocity > 0.3 && dragDistance > 30;

    if (dragOffset > threshold || (dragOffset > 0 && fastSwipe)) {
      goToPrev();
    } else if (dragOffset < -threshold || (dragOffset < 0 && fastSwipe)) {
      goToNext();
    }

    setDragOffset(0);
    setTimeout(startAutoPlay, 3000);
  };

  // 마우스 이벤트
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleDragStart(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    handleDragMove(e.clientX);
  };

  const handleMouseUp = () => {
    handleDragEnd();
  };

  const handleMouseLeave = () => {
    if (isDragging) handleDragEnd();
  };

  // 터치 이벤트
  const handleTouchStart = (e: React.TouchEvent) => {
    handleDragStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    handleDragMove(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    handleDragEnd();
  };

  if (artworks.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center pt-16">
        <p className="text-[var(--text-secondary)] text-lg">No artworks to display</p>
      </div>
    );
  }

  const currentArtwork = artworks[currentIndex];
  const prevIndex = (currentIndex - 1 + artworks.length) % artworks.length;
  const nextIndex = (currentIndex + 1) % artworks.length;
  const title = getLocalizedValue(locale, currentArtwork.title, currentArtwork.title_en);
  const containerWidth = containerRef.current?.offsetWidth || (typeof window !== 'undefined' ? window.innerWidth : 1000);

  return (
    <div className="h-screen pt-16 flex flex-col">
      <div 
        ref={containerRef}
        className="flex-1 relative overflow-hidden cursor-grab active:cursor-grabbing select-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* 슬라이드 트랙 - 3장의 이미지가 나란히 */}
        <div 
          className="absolute inset-0 flex"
          style={{
            transform: `translateX(calc(-100% + ${dragOffset}px))`,
            transition: isDragging ? 'none' : 'transform 0.3s ease-out',
          }}
        >
          {/* 이전 이미지 */}
          {artworks.length > 1 && (
            <div className="flex-shrink-0 w-full h-full flex items-center justify-center p-8">
              <div className="relative w-full h-full max-w-5xl mx-auto">
                <Image
                  src={artworks[prevIndex].image_url}
                  alt={artworks[prevIndex].title}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 80vw"
                  draggable={false}
                />
              </div>
            </div>
          )}

          {/* 현재 이미지 */}
          <div className="flex-shrink-0 w-full h-full flex items-center justify-center p-8">
            <div className="relative w-full h-full max-w-5xl mx-auto">
              <Image
                src={currentArtwork.image_url}
                alt={title}
                fill
                className="object-contain"
                priority
                sizes="(max-width: 768px) 100vw, 80vw"
                draggable={false}
              />
            </div>
          </div>

          {/* 다음 이미지 */}
          {artworks.length > 1 && (
            <div className="flex-shrink-0 w-full h-full flex items-center justify-center p-8">
              <div className="relative w-full h-full max-w-5xl mx-auto">
                <Image
                  src={artworks[nextIndex].image_url}
                  alt={artworks[nextIndex].title}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 80vw"
                  draggable={false}
                />
              </div>
            </div>
          )}
        </div>

        {/* Navigation Arrows */}
        {artworks.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); goToPrev(); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 text-[var(--text-secondary)] hover:text-[var(--foreground)] transition-colors z-10"
              aria-label={t.aria.prevArtwork}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1}
                stroke="currentColor"
                className="w-8 h-8"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); goToNext(); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 text-[var(--text-secondary)] hover:text-[var(--foreground)] transition-colors z-10"
              aria-label={t.aria.nextArtwork}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1}
                stroke="currentColor"
                className="w-8 h-8"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Artwork Info */}
      <div className="py-6 px-8 text-center">
        <h2 className="text-lg font-light tracking-wide text-[var(--foreground)]">
          {title}
        </h2>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          {currentArtwork.year}
        </p>
      </div>

      {/* Dots Indicator */}
      {artworks.length > 1 && (
        <div className="pb-8 flex justify-center gap-2">
          {artworks.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex ? 'bg-white' : 'bg-gray-600'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
