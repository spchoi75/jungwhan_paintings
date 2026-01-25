'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Artwork } from '@/types/artwork';

interface SlideshowProps {
  artworks: Artwork[];
}

export default function Slideshow({ artworks }: SlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goToNext = useCallback(() => {
    if (artworks.length <= 1) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % artworks.length);
      setIsTransitioning(false);
    }, 500);
  }, [artworks.length]);

  const goToPrev = useCallback(() => {
    if (artworks.length <= 1) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + artworks.length) % artworks.length);
      setIsTransitioning(false);
    }, 500);
  }, [artworks.length]);

  useEffect(() => {
    if (artworks.length <= 1) return;
    const interval = setInterval(goToNext, 5000);
    return () => clearInterval(interval);
  }, [artworks.length, goToNext]);

  if (artworks.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center pt-16">
        <p className="text-gray-400 text-lg">No artworks to display</p>
      </div>
    );
  }

  const currentArtwork = artworks[currentIndex];

  return (
    <div className="h-screen pt-16 flex flex-col">
      <div className="flex-1 relative overflow-hidden">
        {/* Main Image */}
        <div
          className={`absolute inset-0 flex items-center justify-center p-8 transition-opacity duration-500 ${
            isTransitioning ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <div className="relative w-full h-full max-w-5xl mx-auto">
            <Image
              src={currentArtwork.image_url}
              alt={currentArtwork.title}
              fill
              className="object-contain"
              priority
              sizes="(max-width: 768px) 100vw, 80vw"
            />
          </div>
        </div>

        {/* Navigation Arrows */}
        {artworks.length > 1 && (
          <>
            <button
              onClick={goToPrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 text-gray-500 hover:text-white transition-colors"
              aria-label="Previous artwork"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1}
                stroke="currentColor"
                className="w-8 h-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5L8.25 12l7.5-7.5"
                />
              </svg>
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 text-gray-500 hover:text-white transition-colors"
              aria-label="Next artwork"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1}
                stroke="currentColor"
                className="w-8 h-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 4.5l7.5 7.5-7.5 7.5"
                />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Artwork Info */}
      <div className="py-6 px-8 text-center">
        <h2 className="text-lg font-light tracking-wide text-white">
          {currentArtwork.title}
        </h2>
        <p className="text-sm text-gray-400 mt-1">
          {currentArtwork.year}
        </p>
      </div>

      {/* Dots Indicator */}
      {artworks.length > 1 && (
        <div className="pb-8 flex justify-center gap-2">
          {artworks.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setIsTransitioning(true);
                setTimeout(() => {
                  setCurrentIndex(index);
                  setIsTransitioning(false);
                }, 500);
              }}
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
