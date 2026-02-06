import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

interface ColorNode {
  id: string;
  title: string;
  title_en: string | null;
  year: number;
  thumbnail_url: string;
  width: number | null;
  height: number | null;
  dominant_color: string | null;
  hue: number | null; // 0-360 for color wheel positioning
}

// GET /api/portfolio/colors - Get all artworks with color data for color wheel view
export async function GET() {
  try {
    const { data: artworks, error } = await supabase
      .from('portfolio')
      .select('id, title, title_en, year, thumbnail_url, width, height, dominant_color')
      .order('year', { ascending: true });

    if (error) throw error;

    // Parse HSL and extract hue for positioning
    const nodes: ColorNode[] = (artworks || []).map(artwork => {
      let hue: number | null = null;

      if (artwork.dominant_color) {
        // Expected format: "hsl(120, 50%, 50%)" or just "120" (hue only)
        const hslMatch = artwork.dominant_color.match(/hsl\((\d+)/);
        if (hslMatch) {
          hue = parseInt(hslMatch[1], 10);
        } else if (/^\d+$/.test(artwork.dominant_color)) {
          hue = parseInt(artwork.dominant_color, 10);
        }
      }

      return {
        ...artwork,
        hue,
      };
    });

    // Group by hue ranges for color wheel segments
    const segments = Array.from({ length: 12 }, (_, i) => ({
      hueStart: i * 30,
      hueEnd: (i + 1) * 30,
      artworks: nodes.filter(n => {
        if (n.hue === null) return false;
        const normalizedHue = n.hue % 360;
        return normalizedHue >= i * 30 && normalizedHue < (i + 1) * 30;
      }),
    }));

    // Artworks without color data
    const unclassified = nodes.filter(n => n.hue === null);

    return NextResponse.json({
      nodes,
      segments,
      unclassified,
      total: nodes.length,
      classified: nodes.length - unclassified.length,
    });
  } catch (error) {
    console.error('Error fetching color data:', error);
    return NextResponse.json({ error: 'Failed to fetch color data' }, { status: 500 });
  }
}
