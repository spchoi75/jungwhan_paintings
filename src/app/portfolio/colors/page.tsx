'use client';

import dynamic from 'next/dynamic';

const ColorDistributionView = dynamic(
  () => import('@/components/portfolio/ColorDistributionView'),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--foreground)] mx-auto mb-4"></div>
          <p className="text-[var(--foreground)]/60">색상 분포 로딩 중...</p>
        </div>
      </div>
    ),
  }
);

export default function ColorsPage() {
  return <ColorDistributionView />;
}
