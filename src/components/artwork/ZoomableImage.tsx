'use client';

import { TransformWrapper, TransformComponent, useControls } from 'react-zoom-pan-pinch';
import Image from 'next/image';

interface ZoomableImageProps {
  src: string;
  alt: string;
}

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

export default function ZoomableImage({ src, alt }: ZoomableImageProps) {
  return (
    <TransformWrapper
      initialScale={1}
      minScale={0.5}
      maxScale={4}
      centerOnInit
      wheel={{ smoothStep: 0.1 }}
      doubleClick={{ mode: 'toggle' }}
    >
      <div className="relative w-full h-full">
        <TransformComponent
          wrapperStyle={{ width: '100%', height: '100%' }}
          contentStyle={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <div className="relative w-full h-full flex items-center justify-center">
            <Image
              src={src}
              alt={alt}
              fill
              sizes="100vw"
              className="object-contain"
              priority
            />
          </div>
        </TransformComponent>
        <ZoomControls />
      </div>
    </TransformWrapper>
  );
}
