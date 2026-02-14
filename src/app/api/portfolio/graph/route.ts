import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

// 이분 그래프 구조: artwork ↔ tag 연결
interface MindmapNode {
  id: string;
  type: 'artwork' | 'tag';
  // artwork 전용
  title?: string;
  title_en?: string | null;
  year?: number;
  image_url?: string;
  width?: number | null;
  height?: number | null;
  connection_count?: number;
  // tag 전용
  name?: string;
  artwork_count?: number;
}

interface MindmapEdge {
  source: string;
  target: string;
}

// GET /api/portfolio/mindmap - 이분 그래프 데이터 (artwork ↔ tag)
export async function GET() {
  try {
    // 1. 모든 작품 조회
    const { data: artworks, error: artworksError } = await supabase
      .from('portfolio')
      .select('id, title, title_en, year, image_url, thumbnail_url, width, height')
      .order('year', { ascending: true });

    if (artworksError) throw artworksError;

    // 2. 모든 태그 조회
    const { data: tags, error: tagsError } = await supabase
      .from('tags')
      .select('id, name');

    if (tagsError) throw tagsError;

    // 3. artwork-tag 관계 조회
    const { data: artworkTags, error: relError } = await supabase
      .from('artwork_tags')
      .select('artwork_id, tag_id');

    if (relError) throw relError;

    const totalArtworks = artworks?.length || 0;

    // 4. 태그별 작품 수 계산
    const tagArtworkCount = new Map<string, number>();
    artworkTags?.forEach(at => {
      tagArtworkCount.set(at.tag_id, (tagArtworkCount.get(at.tag_id) || 0) + 1);
    });

    // 5. 유니버설 태그 (모든 작품에 있는 태그) 필터링
    const universalTags = new Set<string>();
    tagArtworkCount.forEach((count, tagId) => {
      if (count === totalArtworks && totalArtworks > 0) {
        universalTags.add(tagId);
      }
    });

    // 6. 작품별 연결 수 (태그 수 기준)
    const artworkConnectionCount = new Map<string, number>();
    artworkTags?.forEach(at => {
      if (universalTags.has(at.tag_id)) return;
      artworkConnectionCount.set(
        at.artwork_id, 
        (artworkConnectionCount.get(at.artwork_id) || 0) + 1
      );
    });

    // 7. 노드 생성
    const nodes: MindmapNode[] = [];

    // artwork 노드
    (artworks || []).forEach(artwork => {
      nodes.push({
        id: `artwork:${artwork.id}`,
        type: 'artwork',
        title: artwork.title,
        title_en: artwork.title_en,
        year: artwork.year,
        image_url: artwork.image_url,
        width: artwork.width,
        height: artwork.height,
        connection_count: artworkConnectionCount.get(artwork.id) || 0,
      });
    });

    // tag 노드 (유니버설 태그 제외, 연결된 작품이 있는 태그만)
    (tags || []).forEach(tag => {
      if (universalTags.has(tag.id)) return;
      const count = tagArtworkCount.get(tag.id) || 0;
      if (count === 0) return;

      nodes.push({
        id: `tag:${tag.id}`,
        type: 'tag',
        name: tag.name,
        artwork_count: count,
      });
    });

    // 8. 엣지 생성 (artwork ↔ tag)
    const edges: MindmapEdge[] = [];
    artworkTags?.forEach(at => {
      if (universalTags.has(at.tag_id)) return;

      edges.push({
        source: `artwork:${at.artwork_id}`,
        target: `tag:${at.tag_id}`,
      });
    });

    return NextResponse.json({
      nodes,
      edges,
      stats: {
        artworks: artworks?.length || 0,
        tags: nodes.filter(n => n.type === 'tag').length,
        edges: edges.length,
        universal_tags_excluded: universalTags.size,
      },
    });
  } catch (error) {
    console.error('Error fetching mindmap data:', error);
    return NextResponse.json({ error: 'Failed to fetch mindmap data' }, { status: 500 });
  }
}
