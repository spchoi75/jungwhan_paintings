'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { TransformWrapper, TransformComponent, useControls } from 'react-zoom-pan-pinch';
import Image from 'next/image';

interface ZoomableImageProps {
  src: string;
  alt: string;
  onScaleChange?: (scale: number) => void;
}

const MAGNIFIER_SIZE = 400;
const MAGNIFIER_ZOOM = 2.5;

function ZoomControls() {
  const { zoomIn, zoomOut, resetTransform } = useControls();

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-full px-3 py-2 z-10">
      <button
        onClick={() => zoomOut()}
        className="w-8 h-8 flex items-center justify-center text-white hover:bg-white/20 rounded-full transition-colors"
        aria-label="축소"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>
      <button
        onClick={() => zoomIn()}
        className="w-8 h-8 flex items-center justify-center text-white hover:bg-white/20 rounded-full transition-colors"
        aria-label="확대"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>
      <button
        onClick={() => resetTransform()}
        className="w-8 h-8 flex items-center justify-center text-white hover:bg-white/20 rounded-full transition-colors"
        aria-label="원래 크기"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
          <path d="M3 3v5h5" />
        </svg>
      </button>
    </div>
  );
}

export default function ZoomableImage({ src, alt, onScaleChange }: ZoomableImageProps) {
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [magnifierPos, setMagnifierPos] = useState({ x: 0, y: 0 });
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0, naturalWidth: 0, naturalHeight: 0 });
  const [currentScale, setCurrentScale] = useState(1);
  const isZoomed = currentScale > 1.05;
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const updateImageDimensions = useCallback(() => {
    if (imageRef.current && imageContainerRef.current) {
      const container = imageContainerRef.current;
      const containerRect = container.getBoundingClientRect();
      const img = imageRef.current;

      const naturalWidth = img.naturalWidth;
      const naturalHeight = img.naturalHeight;

      const containerAspect = containerRect.width / containerRect.height;
      const imageAspect = naturalWidth / naturalHeight;

      let displayWidth, displayHeight;
      if (imageAspect > containerAspect) {
        displayWidth = containerRect.width;
        displayHeight = containerRect.width / imageAspect;
      } else {
        displayHeight = containerRect.height;
        displayWidth = containerRect.height * imageAspect;
      }

      setImageDimensions({
        width: displayWidth,
        height: displayHeight,
        naturalWidth,
        naturalHeight,
      });
    }
  }, []);

  const handleImageLoad = useCallback(() => {
    const imgElement = imageContainerRef.current?.querySelector('img');
    if (imgElement) {
      imageRef.current = imgElement;
      updateImageDimensions();
    }
  }, [updateImageDimensions]);

  useEffect(() => {
    window.addEventListener('resize', updateImageDimensions);
    return () => window.removeEventListener('resize', updateImageDimensions);
  }, [updateImageDimensions]);

  const updateMagnifierPosition = useCallback((clientX: number, clientY: number) => {
    if (!imageContainerRef.current) return;
    const container = imageContainerRef.current;
    const rect = container.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    setMagnifierPos({ x, y });
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (isZoomed) return;
    updateMagnifierPosition(e.clientX, e.clientY);
    setShowMagnifier(true);
  }, [updateMagnifierPosition, isZoomed]);

  const handleMouseUp = useCallback(() => {
    setShowMagnifier(false);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!showMagnifier) return;
    updateMagnifierPosition(e.clientX, e.clientY);
  }, [showMagnifier, updateMagnifierPosition]);

  const handleMouseLeave = useCallback(() => {
    setShowMagnifier(false);
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 1 && !isZoomed) {
      const touch = e.touches[0];
      updateMagnifierPosition(touch.clientX, touch.clientY);
      setShowMagnifier(true);
    }
  }, [updateMagnifierPosition, isZoomed]);

  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (!showMagnifier || e.touches.length !== 1 || isZoomed) return;
    const touch = e.touches[0];
    updateMagnifierPosition(touch.clientX, touch.clientY);
  }, [showMagnifier, updateMagnifierPosition, isZoomed]);

  const handleTouchEnd = useCallback(() => {
    setShowMagnifier(false);
  }, []);

  const getMagnifierStyle = useCallback(() => {
    if (!imageContainerRef.current || !imageDimensions.width) return {};

    const container = imageContainerRef.current;
    const containerRect = container.getBoundingClientRect();

    const imageOffsetX = (containerRect.width - imageDimensions.width) / 2;
    const imageOffsetY = (containerRect.height - imageDimensions.height) / 2;

    const relativeX = magnifierPos.x - imageOffsetX;
    const relativeY = magnifierPos.y - imageOffsetY;

    const percentX = (relativeX / imageDimensions.width) * 100;
    const percentY = (relativeY / imageDimensions.height) * 100;

    const bgWidth = imageDimensions.width * MAGNIFIER_ZOOM;
    const bgHeight = imageDimensions.height * MAGNIFIER_ZOOM;

    const bgPosX = (percentX / 100) * bgWidth - MAGNIFIER_SIZE / 2;
    const bgPosY = (percentY / 100) * bgHeight - MAGNIFIER_SIZE / 2;

    return {
      left: magnifierPos.x - MAGNIFIER_SIZE / 2,
      top: magnifierPos.y - MAGNIFIER_SIZE / 2,
      width: MAGNIFIER_SIZE,
      height: MAGNIFIER_SIZE,
      backgroundImage: `url(${src})`,
      backgroundSize: `${bgWidth}px ${bgHeight}px`,
      backgroundPosition: `-${bgPosX}px -${bgPosY}px`,
      backgroundRepeat: 'no-repeat',
    };
  }, [magnifierPos, imageDimensions, src]);

  return (
    <TransformWrapper
      initialScale={1}
      minScale={0.5}
      maxScale={4}
      centerOnInit
      wheel={{ smoothStep: 0.1 }}
      doubleClick={{ mode: 'toggle' }}
      panning={{ disabled: showMagnifier && !isZoomed }}
      onTransformed={(_ref, state) => {
        setCurrentScale(state.scale);
        onScaleChange?.(state.scale);
      }}
    >
      <div className="relative w-full h-full">
        <TransformComponent
          wrapperStyle={{ width: '100%', height: '100%' }}
          contentStyle={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <div
            ref={imageContainerRef}
            className="relative w-full h-full flex items-center justify-center cursor-crosshair"
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <Image
              src={src}
              alt={alt}
              fill
              sizes="100vw"
              className="object-contain"
              priority
              onLoad={handleImageLoad}
            />

            {showMagnifier && (
              <div
                className="absolute rounded-lg border-2 border-white/50 shadow-lg pointer-events-none z-20"
                style={getMagnifierStyle()}
              />
            )}
          </div>
        </TransformComponent>

        <ZoomControls />
      </div>
    </TransformWrapper>
  );
}
