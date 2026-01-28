'use client';

import { Fragment, useEffect, useRef, useCallback } from 'react';
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSidePanel } from '@/contexts/SidePanelContext';
import { useLocale } from '@/i18n';

export default function SidePanel() {
  const pathname = usePathname();
  const { isOpen, open, close } = useSidePanel();
  const { t } = useLocale();
  const edgeSwipeRef = useRef<{ startX: number; startY: number } | null>(null);

  const handleEdgeTouchStart = useCallback((e: TouchEvent) => {
    if (e.touches.length !== 1) return;
    const startX = e.touches[0].clientX;
    if (startX <= 30) {
      edgeSwipeRef.current = { startX, startY: e.touches[0].clientY };
    }
  }, []);

  const handleEdgeTouchEnd = useCallback((e: TouchEvent) => {
    if (!edgeSwipeRef.current) return;
    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - edgeSwipeRef.current.startX;
    const deltaY = touch.clientY - edgeSwipeRef.current.startY;
    edgeSwipeRef.current = null;

    if (deltaX > 50 && Math.abs(deltaX) > Math.abs(deltaY)) {
      open();
    }
  }, [open]);

  useEffect(() => {
    if (isOpen) return;
    document.addEventListener('touchstart', handleEdgeTouchStart, { passive: true });
    document.addEventListener('touchend', handleEdgeTouchEnd, { passive: true });
    return () => {
      document.removeEventListener('touchstart', handleEdgeTouchStart);
      document.removeEventListener('touchend', handleEdgeTouchEnd);
    };
  }, [isOpen, handleEdgeTouchStart, handleEdgeTouchEnd]);

  const navItems = [
    { href: '/', label: t.nav.home },
    { href: '/portfolio', label: t.nav.portfolio },
    { href: '/about', label: t.nav.about },
    { href: '/news', label: t.nav.news },
    { href: '/contact', label: t.nav.contact },
  ];

  return (
    <>
      {/* Always visible handle - vertical grip bar when closed */}
      {!isOpen && (
        <button
          onClick={open}
          className="fixed left-0 top-1/2 -translate-y-1/2 z-50 rounded-r-md px-1.5 py-6 hover:brightness-110 transition-all shadow-md group"
          style={{
            background: 'linear-gradient(to right, #1f1f1f, #2a2a2a)',
          }}
          aria-label={t.aria.openMenu}
        >
          <div className="flex flex-col gap-1.5">
            <div className="w-1 h-1 rounded-full bg-gray-500 group-hover:bg-gray-300 transition-colors" />
            <div className="w-1 h-1 rounded-full bg-gray-500 group-hover:bg-gray-300 transition-colors" />
            <div className="w-1 h-1 rounded-full bg-gray-500 group-hover:bg-gray-300 transition-colors" />
          </div>
        </button>
      )}

      <Transition show={isOpen} as={Fragment}>
        <Dialog onClose={() => {}} className="relative z-50">
          {/* Overlay - clicking this closes the panel */}
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div
              className="fixed inset-0 bg-black/50 cursor-pointer"
              aria-hidden="true"
              onClick={close}
            />
          </TransitionChild>

          {/* Panel */}
          <TransitionChild
            as={Fragment}
            enter="transform transition ease-out duration-300"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transform transition ease-in duration-200"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <DialogPanel
              className="fixed left-0 top-0 h-full w-56 sm:w-72 shadow-xl"
              style={{
                background: 'linear-gradient(to right, #141414, #1f1f1f)',
              }}
            >
              {/* Close button */}
              <div className="flex justify-end p-4 sm:p-6">
                <button
                  onClick={close}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                  aria-label={t.aria.closeMenu}
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Navigation links - clicking these does NOT close the panel */}
              <nav className="px-4 sm:px-6">
                <ul className="space-y-1">
                  {navItems.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={`block py-3 text-lg tracking-wide transition-colors ${
                          pathname === item.href ||
                          (item.href !== '/' && pathname.startsWith(item.href))
                            ? 'text-white font-medium'
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              {/* Footer */}
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 border-t border-gray-700/50">
                <p className="text-xs text-gray-500 tracking-wide">
                  {t.common.logo}
                </p>
              </div>

              {/* Handle on right edge - vertical grip bar when open */}
              <button
                onClick={close}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full rounded-r-md px-1.5 py-6 hover:brightness-110 transition-all shadow-md group"
                style={{
                  background: 'linear-gradient(to right, #1f1f1f, #2a2a2a)',
                }}
                aria-label="메뉴 닫기"
              >
                <div className="flex flex-col gap-1.5">
                  <div className="w-1 h-1 rounded-full bg-gray-500 group-hover:bg-gray-300 transition-colors" />
                  <div className="w-1 h-1 rounded-full bg-gray-500 group-hover:bg-gray-300 transition-colors" />
                  <div className="w-1 h-1 rounded-full bg-gray-500 group-hover:bg-gray-300 transition-colors" />
                </div>
              </button>
            </DialogPanel>
          </TransitionChild>
        </Dialog>
      </Transition>
    </>
  );
}
