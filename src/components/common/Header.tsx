'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import MenuButton from './MenuButton';
import SidePanel from './SidePanel';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/artworks', label: 'Portfolio' },
  { href: '/about', label: 'About' },
  { href: '/exhibitions', label: 'Exhibitions' },
  { href: '/contact', label: 'Contact' },
];

export default function Header() {
  const pathname = usePathname();
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Mobile menu button */}
          <MenuButton onClick={() => setIsSidePanelOpen(true)} />

          {/* Logo */}
          <Link href="/" className="text-2xl tracking-wider font-light">
            JUNGWHAN
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm tracking-wide transition-colors ${
                  isActive(item.href)
                    ? 'text-black'
                    : 'text-gray-500 hover:text-black'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Spacer for mobile layout balance */}
          <div className="w-10 md:hidden" />
        </div>
      </header>

      {/* Side Panel */}
      <SidePanel
        isOpen={isSidePanelOpen}
        onClose={() => setIsSidePanelOpen(false)}
      />
    </>
  );
}
