'use client';

import { useEffect, useCallback, useState } from 'react';
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
          if (hasPrev && onPrev && !showCopyrightPopup) onPrev();
          break;
        case 'ArrowRight':
          if (hasNext && onNext && !showCopyrightPopup) onNext();
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
  useEffect(() => {
    const handleContextMenuEvent = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setShowCopyrightPopup(true);
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

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowCopyrightPopup(true);
    return false;
  }, []);

  const formatSize = () => {
    if (!artwork.width || !artwork.height) return null;
    return `${artwork.width} × ${artwork.height} cm`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black animate-fade-in" onContextMenu={handleContextMenu}>
      {/* Copyright popup */}
      {showCopyrightPopup && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#1a1a1a] border border-gray-700 rounded-lg p-6 max-w-md mx-4 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-yellow-500">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M14.83 14.83a4 4 0 1 1 0-5.66" />
                </svg>
              </div>
              <h3 className="text-white text-lg font-medium">
                {locale === 'en' ? 'Copyright Notice' : '저작권 안내'}
              </h3>
            </div>
            <div className="text-gray-300 text-sm space-y-3">
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
                  className="inline-flex items-center gap-2 text-white hover:text-gray-300 transition-colors"
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
        className="absolute top-4 right-4 z-20 w-10 h-10 flex items-center justify-center text-white/70 hover:text-white transition-colors"
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
          onClick={onPrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-14 h-14 flex items-center justify-center rounded-full bg-white/10 text-white/70 hover:bg-white/30 hover:text-white hover:scale-110 transition-all duration-300 backdrop-blur-sm"
          aria-label={t.aria.prevArtwork}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
      )}

      {hasNext && onNext && (
        <button
          onClick={onNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-14 h-14 flex items-center justify-center rounded-full bg-white/10 text-white/70 hover:bg-white/30 hover:text-white hover:scale-110 transition-all duration-300 backdrop-blur-sm"
          aria-label={t.aria.nextArtwork}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      )}

      {/* Image container */}
      <div className="absolute inset-0 top-0 bottom-24">
        <ZoomableImage src={artwork.image_url} alt={getLocalizedValue(locale, artwork.title, artwork.title_en)} />
        {/* Copyright watermark overlay - 4 quadrants */}
        {(artwork.show_watermark ?? true) && (
          <div className="absolute inset-0 pointer-events-none grid grid-cols-2 grid-rows-2">
            <div className="flex items-center justify-center">
              <span className="text-white/10 text-3xl md:text-5xl font-bold select-none rotate-[-30deg]">
                COPYRIGHT
              </span>
            </div>
            <div className="flex items-center justify-center">
              <span className="text-white/10 text-3xl md:text-5xl font-bold select-none rotate-[-30deg]">
                COPYRIGHT
              </span>
            </div>
            <div className="flex items-center justify-center">
              <span className="text-white/10 text-3xl md:text-5xl font-bold select-none rotate-[-30deg]">
                COPYRIGHT
              </span>
            </div>
            <div className="flex items-center justify-center">
              <span className="text-white/10 text-3xl md:text-5xl font-bold select-none rotate-[-30deg]">
                COPYRIGHT
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Artwork info */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent pt-12 pb-6 px-6 max-h-[40%] overflow-y-auto">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-white text-xl font-medium">{getLocalizedValue(locale, artwork.title, artwork.title_en)}</h2>
          <p className="text-white/60 text-sm mt-2">
            {artwork.year}
            {formatSize() && ` · ${formatSize()}`}
            {artwork.medium && ` · ${artwork.medium}`}
          </p>
          {getLocalizedValue(locale, artwork.description, artwork.description_en) && (
            <p className="text-white/80 text-sm mt-4 leading-relaxed whitespace-pre-line">
              {getLocalizedValue(locale, artwork.description, artwork.description_en)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
