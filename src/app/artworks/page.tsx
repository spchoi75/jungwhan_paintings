import { supabase } from '@/lib/supabase/client';
import { Category } from '@/types/artwork';
import Header from '@/components/common/Header';
import CategoryGrid from '@/components/portfolio/CategoryGrid';

export const revalidate = 3600;

async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('order', { ascending: true });

  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }

  return data || [];
}

export default async function ArtworksPage() {
  const categories = await getCategories();

  return (
    <main className="min-h-screen bg-white">
      <Header />
      <div className="pt-24 pb-16 px-6">
        <h1 className="text-3xl font-light tracking-wide text-center mb-12">
          Portfolio
        </h1>
        <CategoryGrid categories={categories} />
      </div>
    </main>
  );
}
