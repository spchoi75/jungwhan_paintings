'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const tabs = [
  { href: '/portfolio/mindmap', label: '마인드맵' },
  { href: '/portfolio/colors', label: '색상' },
  { href: '/portfolio/years', label: '연도' },
];

export default function ViewTabs() {
  const pathname = usePathname();
  
  // 카테고리 상세 페이지에서는 탭 숨김
  if (pathname.startsWith('/portfolio/') && 
      !tabs.some(tab => tab.href === pathname)) {
    return null;
  }

  return (
    <div className="flex justify-center gap-1 mb-8">
      {tabs.map((tab) => {
        const isActive = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`px-6 py-2 text-sm font-medium transition-colors rounded-full ${
              isActive
                ? 'bg-[var(--foreground)] text-[var(--background)]'
                : 'text-[var(--foreground)] hover:bg-[var(--foreground)]/10'
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
