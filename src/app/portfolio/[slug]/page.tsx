import { supabase } from '@/lib/supabase/client';
import { notFound } from 'next/navigation';
import { Category, Artwork } from '@/types/artwork';
import Header from '@/components/common/Header';
import CategoryContent from '@/components/portfolio/CategoryContent';

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    return null;
  }

  return data;
}

async function getArtworksByCategory(categoryId: string): Promise<Artwork[]> {
  const { data, error } = await supabase
    .from('portfolio')
    .select('*')
    .eq('category_id', categoryId)
    .order('year', { ascending: false });

  if (error) {
    console.error('Error fetching artworks:', error);
    return [];
  }

  return data || [];
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const category = await getCategoryBySlug(decodedSlug);

  if (!category) {
    notFound();
  }

  const artworks = await getArtworksByCategory(category.id);

  return (
    <main className="min-h-screen bg-[var(--background)]">
      <Header />
      <div className="pt-24 pb-16 px-6">
        <CategoryContent category={category} artworks={artworks} />
      </div>
    </main>
  );
}
