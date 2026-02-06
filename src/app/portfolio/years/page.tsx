import { supabase } from '@/lib/supabase/client';
import { Artwork } from '@/types/artwork';
import YearView from '@/components/portfolio/YearView';

export const revalidate = 3600;

async function getArtworksByYear(): Promise<Record<number, Artwork[]>> {
  const { data, error } = await supabase
    .from('portfolio')
    .select('*')
    .order('year', { ascending: false })
    .order('title', { ascending: true });

  if (error) {
    console.error('Error fetching artworks:', error);
    return {};
  }

  // 연도별로 그룹화
  const grouped: Record<number, Artwork[]> = {};
  (data || []).forEach((artwork) => {
    if (!grouped[artwork.year]) {
      grouped[artwork.year] = [];
    }
    grouped[artwork.year].push(artwork);
  });

  return grouped;
}

export default async function YearsPage() {
  const artworksByYear = await getArtworksByYear();
  const years = Object.keys(artworksByYear)
    .map(Number)
    .sort((a, b) => b - a);

  return <YearView artworksByYear={artworksByYear} years={years} />;
}
