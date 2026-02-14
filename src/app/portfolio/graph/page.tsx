'use client';

import dynamic from 'next/dynamic';

// react-force-graph는 클라이언트 전용 (Canvas/WebGL)
const GraphView = dynamic(
  () => import('@/components/portfolio/GraphView'),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--foreground)] mx-auto mb-4" />
          <p className="text-[var(--foreground)]/60">그래프 뷰 로딩 중...</p>
        </div>
      </div>
    ),
  }
);

export default function GraphPage() {
  return <GraphView />;
}
