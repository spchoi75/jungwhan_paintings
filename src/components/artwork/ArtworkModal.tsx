'use client';

import { useEffect, useCallback, useState, useRef } from 'react';
import { Artwork } from '@/types/artwork';
import ZoomableImage from './ZoomableImage';
import { useLocale } from '@/i18n';
import { getLocalizedValue } from '@/lib/i18n-utils';

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
  const { locale, t } = useLocale();
  const [showCopyrightPopup, setShowCopyrightPopup] = useState(false);
  const [contactEmail, setContactEmail] = useState<string | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right' | null>(null);
  const swipeRef = useRef<{ startX: number; startY: number; startTime: number } | null>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          if (showCopyrightPopup) {
            setShowCopyrightPopup(false);
          } else {
            onClose();
          }
          break;
        case 'ArrowLeft':
          if (hasPrev && onPrev && !showCopyrightPopup) {
            setSlideDirection('right');
            onPrev();
          }
          break;
        case 'ArrowRight':
          if (hasNext && onNext && !showCopyrightPopup) {
            setSlideDirection('left');
            onNext();
          }
          break;
      }
    },
    [onClose, onPrev, onNext, hasPrev, hasNext, showCopyrightPopup]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [handleKeyDown]);

  // 브라우저 기본 우클릭 메뉴 차단 및 저작권 팝업 표시
  // 모바일에서는 contextmenu가 ~1초에 발동되므로 팝업 표시하지 않음
  // 모바일 저작권 팝업은 ZoomableImage의 3초 onLongPress 콜백으로 처리
  useEffect(() => {
    const handleContextMenuEvent = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      // 포인터 디바이스(마우스)에서만 저작권 팝업 표시
      const isPointerFine = window.matchMedia('(pointer: fine)').matches;
      if (isPointerFine) {
        setShowCopyrightPopup(true);
      }
      return false;
    };
    document.addEventListener('contextmenu', handleContextMenuEvent, true);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenuEvent, true);
    };
  }, []);

  useEffect(() => {
    const fetchContactEmail = async () => {
      try {
        const res = await fetch('/api/about');
        if (res.ok) {
          const data = await res.json();
          setContactEmail(data.contact_email);
        }
      } catch {
        // Ignore errors
      }
    };
    fetchContactEmail();
  }, []);

  const handleSwipeStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length !== 1 || isZoomed) return;
    swipeRef.current = {
      startX: e.touches[0].clientX,
      startY: e.touches[0].clientY,
      startTime: Date.now(),
    };
  }, [isZoomed]);

  const handleSwipeEnd = useCallback((e: React.TouchEvent) => {
    if (!swipeRef.current || isZoomed) {
      swipeRef.current = null;
      return;
    }
    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - swipeRef.current.startX;
    const deltaY = touch.clientY - swipeRef.current.startY;
    const elapsed = Date.now() - swipeRef.current.startTime;
    swipeRef.current = null;

    const SWIPE_THRESHOLD = 50;
    const SWIPE_MAX_TIME = 500;

    if (elapsed > SWIPE_MAX_TIME) return;
    if (Math.abs(deltaX) < SWIPE_THRESHOLD) return;
    if (Math.abs(deltaX) < Math.abs(deltaY)) return;

    if (deltaX < 0 && hasNext && onNext) {
      setSlideDirection('left');
      onNext();
    } else if (deltaX > 0 && hasPrev && onPrev) {
      setSlideDirection('right');
      onPrev();
    }
  }, [isZoomed, hasNext, hasPrev, onNext, onPrev]);

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowCopyrightPopup(true);
    return false;
  }, []);

  const formatSize = () => {
    // variable_size가 true이면 가변크기 표시
    if (artwork.variable_size) {
      return locale === 'en' ? 'Variable dimensions' : '가변크기';
    }
    if (!artwork.width || !artwork.height) return null;
    // 세로(height) x 가로(width) 순서
    if (locale === 'en') {
      // cm to inch 변환 (1cm = 0.393701 inch)
      const heightInch = (artwork.height * 0.393701).toFixed(1);
      const widthInch = (artwork.width * 0.393701).toFixed(1);
      return `${artwork.height} × ${artwork.width} cm (${heightInch} × ${widthInch} in)`;
    }
    return `${artwork.height} × ${artwork.width} cm`;
  };

  const getMedium = () => {
    return getLocalizedValue(locale, artwork.medium, artwork.medium_en);
  };

  const getCollection = () => {
    return getLocalizedValue(locale, artwork.collection, artwork.collection_en);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black animate-fade-in" onContextMenu={handleContextMenu}>
      {/* Copyright popup */}
      {showCopyrightPopup && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-6 max-w-md mx-4 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-yellow-500">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M14.83 14.83a4 4 0 1 1 0-5.66" />
                </svg>
              </div>
              <h3 className="text-[var(--foreground)] text-lg font-medium">
                {locale === 'en' ? 'Copyright Notice' : '저작권 안내'}
              </h3>
            </div>
            <div className="text-[var(--text-secondary)] text-sm space-y-3">
              <p>
                {locale === 'en'
                  ? 'All artworks displayed on this website are protected by copyright law. Unauthorized copying, reproduction, distribution, or commercial use is strictly prohibited.'
                  : '본 웹사이트에 게시된 모든 작품은 저작권법에 의해 보호됩니다. 무단 복제, 배포, 상업적 이용은 법적 제재를 받을 수 있습니다.'}
              </p>
              <p>
                {locale === 'en'
                  ? 'For licensing inquiries or permission requests, please contact:'
                  : '작품 사용 및 라이선스 문의는 아래로 연락해 주세요:'}
              </p>
              {contactEmail && (
                <a
                  href={`mailto:${contactEmail}`}
                  className="inline-flex items-center gap-2 text-[var(--foreground)] hover:text-[var(--text-secondary)] transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                  {contactEmail}
                </a>
              )}
            </div>
            <button
              onClick={() => setShowCopyrightPopup(false)}
              className="mt-6 w-full py-2 bg-white text-black rounded hover:bg-gray-200 transition-colors text-sm font-medium"
            >
              {locale === 'en' ? 'Close' : '확인'}
            </button>
          </div>
        </div>
      )}

      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-20 w-10 h-10 flex items-center justify-center text-[var(--foreground)]/70 hover:text-[var(--foreground)] transition-colors"
        aria-label={t.aria.closeModal}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      {/* Navigation buttons */}
      {hasPrev && onPrev && (
        <button
          onClick={() => { setSlideDirection('right'); onPrev(); }}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-14 h-14 landscape:w-10 landscape:h-10 flex items-center justify-center rounded-full bg-white/10 text-[var(--foreground)]/70 hover:bg-white/30 hover:text-[var(--foreground)] hover:scale-110 transition-all duration-300 backdrop-blur-sm"
          aria-label={t.aria.prevArtwork}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
      )}

      {hasNext && onNext && (
        <button
          onClick={() => { setSlideDirection('left'); onNext(); }}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-14 h-14 landscape:w-10 landscape:h-10 flex items-center justify-center rounded-full bg-white/10 text-[var(--foreground)]/70 hover:bg-white/30 hover:text-[var(--foreground)] hover:scale-110 transition-all duration-300 backdrop-blur-sm"
          aria-label={t.aria.nextArtwork}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      )}

      {/* Image container */}
      <div
        key={artwork.id}
        className={`absolute inset-0 top-0 bottom-24 landscape:bottom-16 ${
          slideDirection === 'left' ? 'animate-slide-in-right' :
          slideDirection === 'right' ? 'animate-slide-in-left' : ''
        }`}
        onTouchStart={handleSwipeStart}
        onTouchEnd={handleSwipeEnd}
        onAnimationEnd={() => setSlideDirection(null)}
      >
        <ZoomableImage
          src={artwork.image_url}
          alt={getLocalizedValue(locale, artwork.title, artwork.title_en)}
          onScaleChange={(scale) => setIsZoomed(scale > 1.05)}
          onLongPress={() => setShowCopyrightPopup(true)}
        />
        {/* Copyright watermark overlay - 4 quadrants */}
        {(artwork.show_watermark ?? true) && (
          <div className="absolute inset-0 pointer-events-none grid grid-cols-2 grid-rows-2">
            <div className="flex items-center justify-center">
              <span className="text-[var(--foreground)]/10 text-3xl md:text-5xl font-bold select-none rotate-[-30deg]">
                COPYRIGHT
              </span>
            </div>
            <div className="flex items-center justify-center">
              <span className="text-[var(--foreground)]/10 text-3xl md:text-5xl font-bold select-none rotate-[-30deg]">
                COPYRIGHT
              </span>
            </div>
            <div className="flex items-center justify-center">
              <span className="text-[var(--foreground)]/10 text-3xl md:text-5xl font-bold select-none rotate-[-30deg]">
                COPYRIGHT
              </span>
            </div>
            <div className="flex items-center justify-center">
              <span className="text-[var(--foreground)]/10 text-3xl md:text-5xl font-bold select-none rotate-[-30deg]">
                COPYRIGHT
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Artwork info */}
      <div
        key={`info-${artwork.id}`}
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent pt-12 pb-6 px-6 max-h-[40%] overflow-y-auto landscape:pt-4 landscape:pb-3 landscape:px-4 landscape:max-h-[30%] ${
          slideDirection === 'left' ? 'animate-slide-in-right' :
          slideDirection === 'right' ? 'animate-slide-in-left' : ''
        }`}
      >
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-[var(--foreground)] text-xl font-medium">{getLocalizedValue(locale, artwork.title, artwork.title_en)}</h2>
          <p className="text-[var(--foreground)]/60 text-sm mt-2">
            {artwork.year}
            {formatSize() && ` · ${formatSize()}`}
            {getMedium() && ` · ${getMedium()}`}
          </p>
          {getCollection() && (
            <p className="text-[var(--foreground)]/50 text-sm mt-1">
              {t.artwork.collection}: {getCollection()}
            </p>
          )}
          {getLocalizedValue(locale, artwork.description, artwork.description_en) && (
            <p className="text-[var(--foreground)]/80 text-sm mt-4 leading-relaxed whitespace-pre-line">
              {getLocalizedValue(locale, artwork.description, artwork.description_en)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
