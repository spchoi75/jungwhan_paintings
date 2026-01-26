import { supabase } from '@/lib/supabase/client';
import { notFound } from 'next/navigation';
import { Category, Artwork } from '@/types/artwork';
import Header from '@/components/common/Header';
import ArtworkList from '@/components/portfolio/ArtworkList';
import Link from 'next/link';

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
    <main className="min-h-screen bg-[#0a0a0a]">
      <Header />
      <div className="pt-24 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          <Link
            href="/portfolio"
            className="inline-flex items-center text-sm text-gray-400 hover:text-white transition-colors mb-8"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4 mr-1"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
            Back to Portfolio
          </Link>

          <h1 className="text-3xl font-light tracking-wide mb-2 text-white">
            {category.name}
          </h1>
          {category.description && (
            <p className="text-gray-400 mb-12">{category.description}</p>
          )}

          <ArtworkList artworks={artworks} />
        </div>
      </div>
    </main>
  );
}
