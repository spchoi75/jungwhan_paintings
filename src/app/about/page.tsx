import Header from '@/components/common/Header';
import AboutContent from '@/components/about/AboutContent';
import { supabaseAdmin } from '@/lib/supabase/server';
import { AboutInfo, Exhibition } from '@/types/artwork';

export const revalidate = 3600;

async function getAboutInfo(): Promise<AboutInfo | null> {
  const { data, error } = await supabaseAdmin
    .from('about_info')
    .select('*')
    .single();

  if (error) {
    console.error('Error fetching about info:', error);
    return null;
  }

  return data;
}

async function getExhibitions(): Promise<Exhibition[]> {
  const { data, error } = await supabaseAdmin
    .from('exhibitions')
    .select('*')
    .order('year', { ascending: false })
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching exhibitions:', error);
    return [];
  }

  return data || [];
}

export default async function AboutPage() {
  const [aboutInfo, exhibitions] = await Promise.all([
    getAboutInfo(),
    getExhibitions(),
  ]);

  return (
    <main className="min-h-screen bg-[var(--background)]">
      <Header />

      <div className="max-w-4xl mx-auto px-6 pt-24 pb-16">
        <AboutContent aboutInfo={aboutInfo} exhibitions={exhibitions} />
      </div>
    </main>
  );
}
