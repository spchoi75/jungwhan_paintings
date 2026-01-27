import Header from '@/components/common/Header';
import NewsDetail from '@/components/news/NewsDetail';
import { supabaseAdmin } from '@/lib/supabase/server';
import { News } from '@/types/artwork';
import { notFound } from 'next/navigation';

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getNewsById(id: string): Promise<News | null> {
  const { data, error } = await supabaseAdmin
    .from('news')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching news:', error);
    return null;
  }

  return data;
}

export default async function NewsDetailPage({ params }: PageProps) {
  const { id } = await params;
  const news = await getNewsById(id);

  if (!news) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      <Header />

      <div className="max-w-4xl mx-auto px-6 pt-24 pb-16">
        <NewsDetail news={news} />
      </div>
    </main>
  );
}
