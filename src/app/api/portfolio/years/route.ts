import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

interface YearGroup {
  year: number;
  artworks: {
    id: string;
    title: string;
    title_en: string | null;
    thumbnail_url: string;
    width: number | null;
    height: number | null;
  }[];
}

// GET /api/portfolio/years - Get artworks grouped by year
// Query params: ?year=2024 (optional, get specific year only)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const yearFilter = searchParams.get('year');

    let query = supabase
      .from('portfolio')
      .select('id, title, title_en, year, thumbnail_url, width, height')
      .order('year', { ascending: false })
      .order('title', { ascending: true }); // 가나다순 (title 기준)

    if (yearFilter) {
      query = query.eq('year', parseInt(yearFilter, 10));
    }

    const { data: artworks, error } = await query;

    if (error) throw error;

    // Get list of unique years
    const { data: yearsData, error: yearsError } = await supabase
      .from('portfolio')
      .select('year')
      .order('year', { ascending: false });

    if (yearsError) throw yearsError;

    const uniqueYears = [...new Set(yearsData?.map(a => a.year))];

    // Group artworks by year
    const grouped: YearGroup[] = uniqueYears.map(year => ({
      year,
      artworks: (artworks || [])
        .filter(a => a.year === year)
        .sort((a, b) => a.title.localeCompare(b.title, 'ko')), // 가나다순
    }));

    return NextResponse.json({
      years: uniqueYears,
      groups: grouped,
      total: artworks?.length || 0,
    });
  } catch (error) {
    console.error('Error fetching years data:', error);
    return NextResponse.json({ error: 'Failed to fetch years data' }, { status: 500 });
  }
}
