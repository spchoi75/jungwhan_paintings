import { supabase } from '@/lib/supabase/client';
import { Artwork } from '@/types/artwork';
import Slideshow from '@/components/landing/Slideshow';
import Header from '@/components/common/Header';

export const revalidate = 3600;

async function getFeaturedArtworks(): Promise<Artwork[]> {
  const { data, error } = await supabase
    .from('portfolio')
    .select('*')
    .eq('is_featured', true)
    .order('order', { ascending: true })
    .limit(10);

  if (error) {
    console.error('Error fetching featured artworks:', error);
    return [];
  }

  return data || [];
}

export default async function Home() {
  const featuredArtworks = await getFeaturedArtworks();

  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      <Header />
      <Slideshow artworks={featuredArtworks} />
    </main>
  );
}
