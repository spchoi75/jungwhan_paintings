import { supabase } from '@/lib/supabase/client';
import { Exhibition } from '@/types/artwork';
import Header from '@/components/common/Header';
import ExhibitionsContent from '@/components/exhibitions/ExhibitionsContent';

export const revalidate = 3600;

async function getExhibitions(): Promise<{ solo: Exhibition[]; group: Exhibition[] }> {
  const { data, error } = await supabase
    .from('exhibitions')
    .select('*')
    .order('year', { ascending: false })
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching exhibitions:', error);
    return { solo: [], group: [] };
  }

  const exhibitions = data || [];
  return {
    solo: exhibitions.filter((e: Exhibition) => e.type === 'solo'),
    group: exhibitions.filter((e: Exhibition) => e.type === 'group'),
  };
}

export default async function ExhibitionsPage() {
  const { solo, group } = await getExhibitions();

  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      <Header />
      <div className="pt-24 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <ExhibitionsContent solo={solo} group={group} />
        </div>
      </div>
    </main>
  );
}
