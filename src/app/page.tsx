import { supabase } from '@/lib/supabase/client';
import { Artwork } from '@/types/artwork';
import Hero from '@/components/landing/Hero';
import FeaturedWorks from '@/components/landing/FeaturedWorks';

export const revalidate = 3600;

async function getFeaturedArtworks(): Promise<Artwork[]> {
  const { data, error } = await supabase
    .from('artworks')
    .select('*')
    .eq('is_featured', true)
    .order('order', { ascending: true })
    .limit(6);

  if (error) {
    console.error('Error fetching featured artworks:', error);
    return [];
  }

  return data || [];
}

export default async function Home() {
  const featuredArtworks = await getFeaturedArtworks();
  const heroArtwork = featuredArtworks[0];

  return (
    <main>
      <Hero featuredArtwork={heroArtwork} />
      <FeaturedWorks artworks={featuredArtworks} />
    </main>
  );
}
