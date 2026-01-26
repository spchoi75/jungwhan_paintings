import Header from '@/components/common/Header';
import AboutContent from '@/components/about/AboutContent';
import { supabaseAdmin } from '@/lib/supabase/server';
import { AboutInfo } from '@/types/artwork';

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

export default async function AboutPage() {
  const aboutInfo = await getAboutInfo();

  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      <Header />

      <div className="max-w-4xl mx-auto px-6 pt-24 pb-16">
        <AboutContent aboutInfo={aboutInfo} />
      </div>
    </main>
  );
}
