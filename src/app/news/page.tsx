import Header from '@/components/common/Header';
import NewsContent from '@/components/news/NewsContent';
import { supabaseAdmin } from '@/lib/supabase/server';
import { News } from '@/types/artwork';

export const revalidate = 3600;

async function getNews(): Promise<News[]> {
  const { data, error } = await supabaseAdmin
    .from('news')
    .select('*')
    .order('published_at', { ascending: false });

  if (error) {
    console.error('Error fetching news:', error);
    return [];
  }

  return data || [];
}

export default async function NewsPage() {
  const news = await getNews();

  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      <Header />

      <div className="max-w-6xl mx-auto px-6 pt-24 pb-16">
        <NewsContent news={news} />
      </div>
    </main>
  );
}
