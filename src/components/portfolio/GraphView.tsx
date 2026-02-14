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
  image_url?: string;
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
  nodeSize: number;          // 노드 크기 배율
}

const DEFAULT_PHYSICS: PhysicsSettings = {
  chargeStrength: 100,      // 양수로 표시 (내부에서 음수로 변환)
  centerStrength: 0.3,      // 중심으로 당기는 힘
  linkDistance: 20,         // 가장 짧게
  linkStrength: 0.5,
  collisionRadius: 1.5,
  nodeSize: 1.0,            // 기본 크기
};

// ===== 색상 설정 =====
const COLORS = {
  artwork: 'rgb(128, 128, 0)',      // olive
  artworkDimmed: 'rgba(128, 128, 0, 0.65)',
  tag: 'rgb(178, 34, 34)',          // firebrick
  tagDimmed: 'rgba(178, 34, 34, 0.65)',
  link: 'rgba(100, 100, 100, 0.3)',
  linkHighlight: 'rgba(100, 100, 100, 0.45)',
  linkDimmed: 'rgba(100, 100, 100, 0.2)',
  background: 'rgb(245, 245, 245)', // whitesmoke
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
  const [highlightNodes, setHighlightNodes] = useState<Set<string>>(new Set());
  const [highlightLinks, setHighlightLinks] = useState<Set<string>>(new Set());
  const [imageCache, setImageCache] = useState<Map<string, HTMLImageElement>>(new Map());
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  // 고정 크기 (4:3 비율)
  const FIXED_WIDTH = 900;
  const FIXED_HEIGHT = 675; // 900 * 3/4
  const [physics, setPhysics] = useState<PhysicsSettings>(DEFAULT_PHYSICS);
  const [isMounted, setIsMounted] = useState(false);
  const [hasInitialCentered, setHasInitialCentered] = useState(false);
  const [showPhysicsPanel, setShowPhysicsPanel] = useState(true); // 모바일에서 토글 가능

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

  // 썸네일 이미지 프리로드
  useEffect(() => {
    const cache = new Map<string, HTMLImageElement>();
    
    nodes.forEach(node => {
      if (node.type === 'artwork' && node.image_url) {
        const img = new window.Image();
        img.crossOrigin = 'anonymous';
        img.src = node.image_url || '';
        img.onload = () => {
          cache.set(node.id, img);
          setImageCache(new Map(cache));
        };
      }
    });
  }, [nodes]);

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

  // 노드 커스텀 렌더링 (기본 노드 + 태그 이름)
  const nodeCanvasObject = useCallback((node: GraphNode, ctx: CanvasRenderingContext2D) => {
    const nodeSize = Math.sqrt(node.val || 10) * 2 * physics.nodeSize;
    const x = node.x || 0;
    const y = node.y || 0;
    
    // 노드 색상 계산
    let nodeColor: string;
    if (highlightNodes.size > 0 && !highlightNodes.has(node.id)) {
      nodeColor = node.type === 'artwork' ? COLORS.artworkDimmed : COLORS.tagDimmed;
    } else {
      nodeColor = node.type === 'artwork' ? COLORS.artwork : COLORS.tag;
    }
    
    // 기본 노드 원 그리기
    ctx.beginPath();
    ctx.arc(x, y, nodeSize, 0, 2 * Math.PI);
    ctx.fillStyle = nodeColor;
    ctx.fill();
    
    // 작품 호버 시 → 연결된 태그 이름 표시
    if (highlightNodes.size > 0 && highlightNodes.has(node.id) && hoveredNode && hoveredNode.id !== node.id) {
      if (hoveredNode.type === 'artwork' && node.type === 'tag') {
        const tagName = node.name || '';
        const fontSize = 11;
        ctx.font = `${fontSize}px Sans-Serif`;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        
        const textWidth = ctx.measureText(tagName).width;
        const textX = x + nodeSize + 6;
        const textY = y;
        
        // 배경
        ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
        ctx.fillRect(textX - 3, textY - fontSize/2 - 2, textWidth + 6, fontSize + 4);
        
        // 텍스트
        ctx.fillStyle = COLORS.tag;
        ctx.fillText(tagName, textX, textY);
      }
    }
  }, [highlightNodes, hoveredNode, physics.nodeSize]);
  
  // 연결된 작품들 가져오기 (태그 호버 시)
  const connectedArtworks = useMemo(() => {
    if (!hoveredNode || hoveredNode.type !== 'tag') return [];
    
    return nodes.filter(n => 
      n.type === 'artwork' && highlightNodes.has(n.id) && n.id !== hoveredNode.id
    );
  }, [hoveredNode, nodes, highlightNodes]);
  
  // 현재 호버된 작품 정보 (작품 호버 시)
  const hoveredArtwork = useMemo(() => {
    if (!hoveredNode || hoveredNode.type !== 'artwork') return null;
    return hoveredNode;
  }, [hoveredNode]);

  // 노드 호버 시 연결된 노드/링크 하이라이트
  const handleNodeHover = useCallback((node: GraphNode | null) => {
    setHoveredNode(node);
    
    if (node) {
      const connectedNodes = new Set<string>();
      const connectedLinks = new Set<string>();
      
      connectedNodes.add(node.id);
      
      links.forEach(link => {
        const sourceId = typeof link.source === 'object' ? (link.source as GraphNode).id : link.source;
        const targetId = typeof link.target === 'object' ? (link.target as GraphNode).id : link.target;
        
        if (sourceId === node.id) {
          connectedNodes.add(targetId);
          connectedLinks.add(`${sourceId}-${targetId}`);
        } else if (targetId === node.id) {
          connectedNodes.add(sourceId);
          connectedLinks.add(`${sourceId}-${targetId}`);
        }
      });
      
      setHighlightNodes(connectedNodes);
      setHighlightLinks(connectedLinks);
    } else {
      setHighlightNodes(new Set());
      setHighlightLinks(new Set());
      setMousePos(null);
    }
  }, [links]);
  
  // 마우스 위치 추적 (컨테이너 기준)
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }, []);

  const getNodeColor = useCallback((node: GraphNode) => {
    // 호버 중이고 연결 안 된 노드면 살짝만 흐리게
    if (highlightNodes.size > 0 && !highlightNodes.has(node.id)) {
      return node.type === 'artwork' ? COLORS.artworkDimmed : COLORS.tagDimmed;
    }
    return node.type === 'artwork' ? COLORS.artwork : COLORS.tag;
  }, [highlightNodes]);

  // 노드 라벨 (3D용)
  const getNodeLabel = useCallback((node: GraphNode) => {
    if (node.type === 'artwork') {
      const title = (locale === 'en' && node.title_en) ? node.title_en : (node.title || 'Untitled');
      return `🎨 ${title}${node.year ? ` (${node.year})` : ''}`;
    }
    return `🏷️ ${node.name} (${node.artwork_count})`;
  }, [locale]);

  const getLinkColor = useCallback((link: { source: GraphNode | string; target: GraphNode | string }) => {
    if (highlightLinks.size === 0) return COLORS.link;
    
    const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
    const targetId = typeof link.target === 'object' ? link.target.id : link.target;
    const linkId = `${sourceId}-${targetId}`;
    const linkIdReverse = `${targetId}-${sourceId}`;
    
    if (highlightLinks.has(linkId) || highlightLinks.has(linkIdReverse)) {
      return COLORS.linkHighlight;
    }
    return COLORS.linkDimmed;
  }, [highlightLinks]);

  const getLinkWidth = useCallback((link: { source: GraphNode | string; target: GraphNode | string }) => {
    if (highlightLinks.size === 0) return 1.5;
    
    const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
    const targetId = typeof link.target === 'object' ? link.target.id : link.target;
    const linkId = `${sourceId}-${targetId}`;
    const linkIdReverse = `${targetId}-${sourceId}`;
    
    if (highlightLinks.has(linkId) || highlightLinks.has(linkIdReverse)) {
      return 1.8;  // 살짝만 굵게
    }
    return 1.2;    // 기본보다 살짝만 얇게
  }, [highlightLinks]);

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
      {/* 헤더 - 작품 숫자 제거 */}

      <div className="flex flex-col md:flex-row gap-4">
        {/* 그래프 + 오버레이 래퍼 */}
        <div className="relative w-full md:w-auto overflow-x-auto" style={{ minWidth: GRAPH_WIDTH, height: GRAPH_HEIGHT }}>
          {/* 그래프 컨테이너 - 고정 영역 */}
          <div
            ref={containerRef}
            className="rounded-lg border border-[var(--foreground)]/10 overflow-hidden absolute inset-0"
            style={{ backgroundColor: COLORS.background }}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setMousePos(null)}
          >
          {viewMode === '2d' && (
            <ForceGraph2D
              key="graph-2d"
              ref={graphRef}
              graphData={graphData}
              width={GRAPH_WIDTH}
              height={GRAPH_HEIGHT}
              backgroundColor={COLORS.background}
              nodeCanvasObject={nodeCanvasObject}
              nodePointerAreaPaint={(node: GraphNode, color: string, ctx: CanvasRenderingContext2D) => {
                const nodeSize = Math.sqrt(node.val || 10) * 2 * physics.nodeSize;
                ctx.beginPath();
                ctx.arc(node.x || 0, node.y || 0, nodeSize, 0, 2 * Math.PI);
                ctx.fillStyle = color;
                ctx.fill();
              }}
              linkColor={getLinkColor}
              linkWidth={getLinkWidth}
              onNodeClick={handleNodeClick}
              onNodeHover={handleNodeHover}
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
              backgroundColor={COLORS.background}
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
          {/* 그래프 컨테이너 닫힘 - 아래 오버레이는 overflow-hidden 영향 안 받음 */}
          
          {/* 태그 호버 시 - 연결된 작품 썸네일을 가장자리에 표시 */}
          {/* 태그 호버 시 - 연결된 작품들 이미지 표시 (핀터레스트 스타일) */}
          {connectedArtworks.length > 0 && (
            <div 
              className="absolute top-2 left-2 pointer-events-none z-10"
              style={{
                width: 'calc(100% - 16px)',
                columnCount: Math.min(connectedArtworks.length, 8),
                columnGap: '2px',
              }}
            >
              {connectedArtworks.map((artwork, index) => {
                const aspectRatio = (artwork.width && artwork.height) ? artwork.width / artwork.height : 1;
                return (
                  <div
                    key={artwork.id}
                    className="mb-0.5"
                    style={{
                      animation: `fadeIn 150ms ease-out ${index * 30}ms both`,
                      breakInside: 'avoid',
                    }}
                  >
                    {artwork.image_url && (
                      <div 
                        className="relative w-full"
                        style={{ paddingBottom: `${(1 / aspectRatio) * 100}%` }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={artwork.image_url || ''}
                          alt={artwork.title || ''}
                          className="absolute inset-0 w-full h-full object-contain"
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
          
          {/* 작품 호버 시 - 마우스 근처에 해당 작품 이미지 표시 */}
          {hoveredArtwork && mousePos && hoveredArtwork.image_url && (() => {
            const aspectRatio = (hoveredArtwork.width && hoveredArtwork.height) ? hoveredArtwork.width / hoveredArtwork.height : 1;
            const itemWidth = 100;
            return (
              <div
                className="absolute pointer-events-none z-20 bg-[var(--background)] p-1 shadow-lg"
                style={{
                  left: Math.min(mousePos.x + 15, GRAPH_WIDTH - itemWidth - 20),
                  top: Math.min(mousePos.y + 15, GRAPH_HEIGHT - itemWidth / aspectRatio - 40),
                  width: itemWidth,
                }}
              >
                <div 
                  className="relative w-full"
                  style={{ paddingBottom: `${(1 / aspectRatio) * 100}%` }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={hoveredArtwork.image_url || ''}
                    alt={hoveredArtwork.title || ''}
                    className="absolute inset-0 w-full h-full object-contain"
                  />
                </div>
                <div className="text-xs text-center mt-1 text-[var(--foreground)]/70 truncate">
                  {hoveredArtwork.title}
                </div>
              </div>
            );
          })()}
        </div>

        {/* 물리 설정 패널 - 모바일에서 토글 가능 */}
        <div className="shrink-0 rounded-lg border border-[var(--foreground)]/10 bg-[var(--background)]" style={{ width: PANEL_WIDTH }}>
          <button
            onClick={() => setShowPhysicsPanel(!showPhysicsPanel)}
            className="w-full p-4 flex items-center justify-between md:cursor-default"
          >
            <h3 className="text-sm font-medium">{t.graph.physicsSettings}</h3>
            <div className="flex items-center gap-2">
              {showPhysicsPanel && (
                <button
                  onClick={(e) => { e.stopPropagation(); resetPhysics(); }}
                  className="text-xs text-[var(--foreground)]/50 hover:text-[var(--foreground)]"
                >
                  {t.graph.reset}
                </button>
              )}
              <span className="md:hidden text-[var(--foreground)]/50">{showPhysicsPanel ? '▲' : '▼'}</span>
            </div>
          </button>
          
          {showPhysicsPanel && (
          <div className="px-4 pb-4 space-y-4">

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

            <Slider
              label="점 크기"
              value={physics.nodeSize}
              onChange={(v) => updatePhysics('nodeSize', v)}
              min={0.5}
              max={2}
              step={0.1}
              leftLabel="작게"
              rightLabel="크게"
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
          )}
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

      {/* 작품 모달 */}
      {modalOpen && selectedArtwork && (
        <ArtworkModal
          artwork={selectedArtwork}
          onClose={() => setModalOpen(false)}
        />
      )}
      
      {/* fadeIn 애니메이션 */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
