'use client';

import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';
import * as d3 from 'd3-force';
import ArtworkModal from '@/components/artwork/ArtworkModal';
import { Artwork } from '@/types/artwork';
import { useLocale } from '@/i18n';

// 2D/3D 그래프 컴포넌트 동적 로딩 (SSR 비활성화)
const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), {
  ssr: false,
  loading: () => <GraphLoading />,
}) as React.ComponentType<Record<string, unknown>>;

const ForceGraph3D = dynamic(() => import('react-force-graph-3d'), {
  ssr: false,
  loading: () => <GraphLoading />,
}) as React.ComponentType<Record<string, unknown>>;

function GraphLoading({ text = 'Loading...' }: { text?: string }) {
  return (
    <div className="flex items-center justify-center h-full bg-[var(--background)]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--foreground)] mx-auto mb-4" />
        <p className="text-[var(--foreground)]/60">{text}</p>
      </div>
    </div>
  );
}

// ===== 타입 =====
type ViewMode = '2d' | '3d';

interface GraphNode {
  id: string;
  type: 'artwork' | 'tag';
  title?: string;
  title_en?: string | null;
  year?: number;
  thumbnail_url?: string;
  width?: number | null;
  height?: number | null;
  connection_count?: number;
  name?: string;
  artwork_count?: number;
  val?: number;
  color?: string;
  x?: number;
  y?: number;
  z?: number;
  linkCount?: number;
}

interface GraphLink {
  source: string;
  target: string;
}

interface ApiResponse {
  nodes: GraphNode[];
  edges: GraphLink[];
  stats: {
    artworks: number;
    tags: number;
    edges: number;
  };
}

interface ProcessedGraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

interface PhysicsSettings {
  chargeStrength: number;    // 노드 간 반발력 (음수)
  centerStrength: number;    // 중심으로 당기는 힘
  linkDistance: number;      // 링크 거리
  linkStrength: number;      // 링크 강도
  collisionRadius: number;   // 충돌 반경 배율
}

const DEFAULT_PHYSICS: PhysicsSettings = {
  chargeStrength: 100,      // 양수로 표시 (내부에서 음수로 변환)
  centerStrength: 0.3,      // 중심으로 당기는 힘
  linkDistance: 20,         // 가장 짧게
  linkStrength: 0.5,
  collisionRadius: 1.5,
};

// ===== 색상 설정 =====
const COLORS = {
  artwork: '#2563eb',
  tag: '#a855f7',
  link: 'rgba(100, 100, 100, 0.4)',
  background3D: '#0a0a0a',
};

// ===== 슬라이더 컴포넌트 =====
function Slider({ 
  label, 
  value, 
  onChange, 
  min, 
  max, 
  step = 1,
  leftLabel,
  rightLabel,
  slightly,
  quite,
  normal,
}: { 
  label: string; 
  value: number; 
  onChange: (v: number) => void; 
  min: number; 
  max: number; 
  step?: number;
  leftLabel: string;
  rightLabel: string;
  slightly: string;
  quite: string;
  normal: string;
}) {
  // 0~100% 위치 기준 자연어 표시
  const percent = ((value - min) / (max - min)) * 100;
  const getStrengthLabel = () => {
    if (percent <= 20) return leftLabel;
    if (percent <= 40) return `${slightly} ${rightLabel}`;
    if (percent <= 60) return normal;
    if (percent <= 80) return `${quite} ${rightLabel}`;
    return rightLabel;
  };

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-[var(--foreground)]/70">{label}</span>
        <span className="text-[var(--foreground)]/50">{getStrengthLabel()}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 bg-[var(--foreground)]/20 rounded-lg appearance-none cursor-pointer
          [&::-webkit-slider-thumb]:appearance-none
          [&::-webkit-slider-thumb]:w-3
          [&::-webkit-slider-thumb]:h-3
          [&::-webkit-slider-thumb]:bg-[var(--foreground)]
          [&::-webkit-slider-thumb]:rounded-full
          [&::-webkit-slider-thumb]:cursor-pointer"
      />
      <div className="flex justify-between text-[10px] text-[var(--foreground)]/30">
        <span>{leftLabel}</span>
        <span>{rightLabel}</span>
      </div>
    </div>
  );
}

// ===== 메인 컴포넌트 =====
export default function GraphView() {
  const { t, locale } = useLocale();
  const containerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<unknown>(null);
  
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [links, setLinks] = useState<GraphLink[]>([]);
  const [stats, setStats] = useState({ artworks: 0, tags: 0, edges: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('2d');
  const [render3D, setRender3D] = useState(false);
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  // 고정 크기 (4:3 비율)
  const FIXED_WIDTH = 900;
  const FIXED_HEIGHT = 675; // 900 * 3/4
  const [physics, setPhysics] = useState<PhysicsSettings>(DEFAULT_PHYSICS);
  const [isMounted, setIsMounted] = useState(false);
  const [hasInitialCentered, setHasInitialCentered] = useState(false);

  // 마운트 상태만 관리
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 데이터 로딩
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/portfolio/graph');
        if (!res.ok) throw new Error('Failed to fetch data');
        const apiData: ApiResponse = await res.json();
        
        const linkCount = new Map<string, number>();
        apiData.edges.forEach((edge) => {
          linkCount.set(edge.source, (linkCount.get(edge.source) || 0) + 1);
          linkCount.set(edge.target, (linkCount.get(edge.target) || 0) + 1);
        });

        const maxLinks = Math.max(...Array.from(linkCount.values()), 1);
        
        const processedNodes = apiData.nodes.map((node) => {
          const nodeLinks = linkCount.get(node.id) || 0;
          const normalizedSize = nodeLinks / maxLinks;
          
          let val: number;
          if (node.type === 'artwork') {
            val = 10 + normalizedSize * 40;
          } else {
            val = 8 + normalizedSize * 52;
          }
          
          return {
            ...node,
            val,
            color: node.type === 'artwork' ? COLORS.artwork : COLORS.tag,
            linkCount: nodeLinks,
          };
        });

        setNodes(processedNodes);
        setLinks(apiData.edges);
        setStats(apiData.stats);
      } catch (err) {
        console.error('Error fetching graph data:', err);
        setError('그래프 데이터를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 그래프 초기화 - forceX, forceY 추가 및 화면 맞춤
  const [graphInitialized, setGraphInitialized] = useState(false);
  
  // viewMode 변경 시 graphInitialized 리셋 + 3D 렌더링 지연
  useEffect(() => {
    setGraphInitialized(false);
    setHasInitialCentered(false);
    
    if (viewMode === '3d') {
      setRender3D(false);
      // Three.js 초기화를 위해 약간 지연
      const timer = setTimeout(() => setRender3D(true), 100);
      return () => clearTimeout(timer);
    } else {
      setRender3D(false);
    }
  }, [viewMode]);
  
  useEffect(() => {
    // 3D 모드에서는 d3Force 커스터마이징 건너뛰기 (Three.js 사용)
    if (!graphRef.current || graphInitialized || viewMode === '3d') return;
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fg = graphRef.current as any;
    
    // 약간 딜레이 후 force 추가 (그래프 완전 초기화 대기)
    const timer = setTimeout(() => {
      try {
        // 중심(0,0)으로 당기는 forceX, forceY 추가
        fg.d3Force('x', d3.forceX(0).strength(physics.centerStrength));
        fg.d3Force('y', d3.forceY(0).strength(physics.centerStrength));
        
        // 기본 설정 적용
        fg.d3Force('charge')?.strength(-physics.chargeStrength);
        fg.d3Force('link')?.distance(physics.linkDistance);
        fg.d3Force('link')?.strength(physics.linkStrength);
        
        fg.d3ReheatSimulation?.();
        setGraphInitialized(true);
        
        // 시뮬레이션 안정화 후 화면 중앙에 맞춤
        setTimeout(() => {
          // graphRef.current를 직접 참조 (클로저 stale 방지)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const currentFg = graphRef.current as any;
          if (currentFg?.zoomToFit) {
            currentFg.zoomToFit(400, 80);
            console.log('zoomToFit called');
          }
        }, 1000);
      } catch (err) {
        console.log('Force init error:', err);
      }
    }, 300);
    
    return () => clearTimeout(timer);
  }, [graphRef.current, graphInitialized, viewMode]);
  
  // 물리 설정 변경 시 그래프 업데이트 (2D 모드에서만)
  useEffect(() => {
    if (!graphRef.current || !graphInitialized || viewMode === '3d') return;
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fg = graphRef.current as any;
    
    try {
      // charge force (반발력) - 양수 입력을 음수로 변환 (d3는 음수가 반발)
      fg.d3Force('charge')?.strength(-physics.chargeStrength);
      
      // 중심 인력 (forceX, forceY)
      fg.d3Force('x')?.strength(physics.centerStrength);
      fg.d3Force('y')?.strength(physics.centerStrength);
      
      // link force
      fg.d3Force('link')?.distance(physics.linkDistance);
      fg.d3Force('link')?.strength(physics.linkStrength);
      
      // 시뮬레이션 재가열
      fg.d3ReheatSimulation?.();
    } catch (err) {
      console.log('Force update error:', err);
    }
  }, [physics, graphInitialized, viewMode]);

  const graphData: ProcessedGraphData = useMemo(() => ({
    nodes,
    links,
  }), [nodes, links]);

  const handleNodeClick = useCallback(async (node: GraphNode) => {
    if (!node || !node.id) return;
    
    if (node.type === 'artwork') {
      const artworkId = node.id.replace('artwork:', '');
      
      try {
        const res = await fetch(`/api/portfolio/${artworkId}`);
        if (res.ok) {
          const artwork = await res.json();
          setSelectedArtwork(artwork);
          setModalOpen(true);
        }
      } catch (err) {
        console.error('Error fetching artwork:', err);
      }
    }
  }, []);

  const getNodeLabel = useCallback((node: GraphNode) => {
    if (node.type === 'artwork') {
      const title = (locale === 'en' && node.title_en) ? node.title_en : (node.title || 'Untitled');
      return `🎨 ${title}${node.year ? ` (${node.year})` : ''}`;
    }
    return `🏷️ ${node.name} (${node.artwork_count})`;
  }, [locale]);

  const getNodeColor = useCallback((node: GraphNode) => {
    return node.color || (node.type === 'artwork' ? COLORS.artwork : COLORS.tag);
  }, []);

  const updatePhysics = (key: keyof PhysicsSettings, value: number) => {
    setPhysics(prev => ({ ...prev, [key]: value }));
  };

  const resetPhysics = () => {
    setPhysics(DEFAULT_PHYSICS);
  };

  if (loading || !isMounted) {
    return <GraphLoading text={t.graph.loading} />;
  }

  // 그래프 영역 크기 (고정, 4:3 비율)
  const PANEL_WIDTH = 200;
  const GRAPH_WIDTH = FIXED_WIDTH;
  const GRAPH_HEIGHT = FIXED_HEIGHT;

  if (error) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <p className="text-[var(--foreground)]/60">{t.graph.error}</p>
      </div>
    );
  }

  if (nodes.length === 0) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <p className="text-[var(--foreground)]/60">{t.graph.noData}</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-[var(--foreground)]/60">
          {t.graph.artworks} {stats.artworks} · {t.graph.tags} {stats.tags} · {t.graph.connections} {stats.edges}
        </div>
      </div>

      <div className="flex gap-4">
        {/* 그래프 컨테이너 - 고정 영역 */}
        <div
          ref={containerRef}
          className="rounded-lg border border-[var(--foreground)]/10 overflow-hidden bg-slate-950"
          style={{ width: GRAPH_WIDTH, height: GRAPH_HEIGHT }}
        >
          {viewMode === '2d' && (
            <ForceGraph2D
              key="graph-2d"
              ref={graphRef}
              graphData={graphData}
              width={GRAPH_WIDTH}
              height={GRAPH_HEIGHT}
              backgroundColor="#0f172a"
              nodeLabel={getNodeLabel}
              nodeColor={getNodeColor}
              nodeVal="val"
              nodeRelSize={1}
              linkColor={() => COLORS.link}
              linkWidth={1.5}
              onNodeClick={handleNodeClick}
              onNodeHover={(node: GraphNode | null) => setHoveredNode(node)}
              cooldownTicks={200}
              d3AlphaDecay={0.02}
              d3VelocityDecay={0.3}
              d3AlphaMin={0.001}
              enableZoomInteraction={true}
              enablePanInteraction={true}
              enableNodeDrag={true}
              onEngineStop={() => {
                // 최초 시뮬레이션 멈추면 화면에 맞춤 (한 번만)
                if (!hasInitialCentered) {
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  const currentFg = graphRef.current as any;
                  if (currentFg?.zoomToFit) {
                    currentFg.zoomToFit(400, 80);
                    console.log('onEngineStop: zoomToFit called');
                  }
                  setHasInitialCentered(true);
                }
              }}
            />
          )}
          {viewMode === '3d' && render3D && (
            <ForceGraph3D
              key="graph-3d"
              ref={graphRef}
              graphData={graphData}
              width={GRAPH_WIDTH}
              height={GRAPH_HEIGHT}
              backgroundColor={COLORS.background3D}
              nodeLabel={getNodeLabel}
              nodeColor={getNodeColor}
              nodeVal="val"
              nodeRelSize={1}
              nodeOpacity={0.9}
              linkColor={() => COLORS.link}
              linkWidth={1.5}
              linkOpacity={0.5}
              onNodeClick={handleNodeClick}
              onNodeHover={(node: GraphNode | null) => setHoveredNode(node)}
              cooldownTicks={200}
              d3AlphaDecay={0.02}
              d3VelocityDecay={0.3}
              enableNodeDrag={true}
              enableNavigationControls={true}
              controlType="orbit"
              showNavInfo={false}
            />
          )}
          {viewMode === '3d' && !render3D && (
            <GraphLoading text={t.graph.loading} />
          )}
        </div>

        {/* 물리 설정 패널 - 항상 표시 */}
        <div className="shrink-0 p-4 rounded-lg border border-[var(--foreground)]/10 bg-[var(--background)] space-y-4" style={{ width: PANEL_WIDTH }}>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">{t.graph.physicsSettings}</h3>
            <button
              onClick={resetPhysics}
              className="text-xs text-[var(--foreground)]/50 hover:text-[var(--foreground)]"
            >
              {t.graph.reset}
            </button>
          </div>

            <Slider
              label={t.graph.repulsion}
              value={physics.chargeStrength}
              onChange={(v) => updatePhysics('chargeStrength', v)}
              min={10}
              max={300}
              step={10}
              leftLabel={t.graph.weak}
              rightLabel={t.graph.strong}
              slightly={t.graph.slightly}
              quite={t.graph.quite}
              normal={t.graph.normal}
            />

            <Slider
              label={t.graph.centerForce}
              value={physics.centerStrength}
              onChange={(v) => updatePhysics('centerStrength', v)}
              min={0}
              max={0.5}
              step={0.02}
              leftLabel={t.graph.weak}
              rightLabel={t.graph.strong}
              slightly={t.graph.slightly}
              quite={t.graph.quite}
              normal={t.graph.normal}
            />

            <Slider
              label={t.graph.linkDistance}
              value={physics.linkDistance}
              onChange={(v) => updatePhysics('linkDistance', v)}
              min={20}
              max={150}
              step={5}
              leftLabel={t.graph.short}
              rightLabel={t.graph.long}
              slightly={t.graph.slightly}
              quite={t.graph.quite}
              normal={t.graph.normal}
            />

            <Slider
              label={t.graph.linkStrength}
              value={physics.linkStrength}
              onChange={(v) => updatePhysics('linkStrength', v)}
              min={0}
              max={1}
              step={0.05}
              leftLabel={t.graph.weak}
              rightLabel={t.graph.strong}
              slightly={t.graph.slightly}
              quite={t.graph.quite}
              normal={t.graph.normal}
            />

          <div className="pt-2 border-t border-[var(--foreground)]/10">
            <p className="text-xs text-[var(--foreground)]/40 leading-relaxed">
              {t.graph.physicsHelp.repulsion}<br/>
              {t.graph.physicsHelp.center}<br/>
              {t.graph.physicsHelp.distance}<br/>
              {t.graph.physicsHelp.strength}
            </p>
          </div>
        </div>
      </div>

      {/* 범례 + 조작 안내 */}
      <div className="flex items-center justify-between mt-4 text-xs text-[var(--foreground)]/50">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS.artwork }} />
            <span>{t.graph.artwork}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS.tag }} />
            <span>{t.graph.tag}</span>
          </div>
        </div>
        <div>
          {viewMode === '2d' ? t.graph.help2d : t.graph.help3d}
        </div>
      </div>

      {/* 호버 툴팁 */}
      {hoveredNode && (
        <div className="absolute top-16 left-4 bg-[var(--background)] border border-[var(--foreground)]/20 rounded-lg p-3 shadow-lg max-w-xs z-10">
          <div className="flex items-center gap-2 mb-1">
            <span>{hoveredNode.type === 'artwork' ? '🎨' : '🏷️'}</span>
            <span className="font-medium">
              {hoveredNode.type === 'artwork' 
                ? ((locale === 'en' && hoveredNode.title_en) ? hoveredNode.title_en : hoveredNode.title)
                : hoveredNode.name}
            </span>
          </div>
          <div className="text-sm text-[var(--foreground)]/60">
            {hoveredNode.type === 'artwork' ? (
              <>
                {hoveredNode.year && <span>{hoveredNode.year}{t.graph.year}</span>}
                {hoveredNode.linkCount !== undefined && (
                  <span> · {hoveredNode.linkCount} {t.graph.linkedCount}</span>
                )}
              </>
            ) : (
              <span>{hoveredNode.artwork_count}{t.graph.artworksLinked}</span>
            )}
          </div>
          <p className="text-xs text-[var(--foreground)]/40 mt-1">
            {hoveredNode.type === 'artwork' ? t.graph.clickToView : ''}
          </p>
        </div>
      )}

      {/* 작품 모달 */}
      {modalOpen && selectedArtwork && (
        <ArtworkModal
          artwork={selectedArtwork}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}
