'use client';

import { useState } from 'react';
import Link from 'next/link';
import SidePanel from './SidePanel';

export default function Header() {
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 bg-[#0a0a0a]/90 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Hamburger Menu Button - Left */}
          <button
            onClick={() => setIsSidePanelOpen(true)}
            className="p-2 text-gray-400 hover:text-white transition-colors"
            aria-label="메뉴 열기"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          {/* Logo - Right with Oriental serif font */}
          <Link
            href="/"
            className="text-2xl tracking-wider font-medium text-white"
            style={{ fontFamily: 'var(--font-noto-serif), serif' }}
          >
            정환
          </Link>
        </div>
      </header>

      {/* Side Panel */}
      <SidePanel
        isOpen={isSidePanelOpen}
        onClose={() => setIsSidePanelOpen(false)}
        onOpen={() => setIsSidePanelOpen(true)}
      />
    </>
  );
}
