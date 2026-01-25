import { supabase } from '@/lib/supabase/client';
import { Exhibition } from '@/types/artwork';
import Header from '@/components/common/Header';
import ExhibitionList from '@/components/exhibitions/ExhibitionList';

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
    <main className="min-h-screen bg-white">
      <Header />
      <div className="pt-24 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-light tracking-wide mb-12">
            Exhibitions
          </h1>

          {/* Solo Exhibitions */}
          <section className="mb-16">
            <h2 className="text-xl font-medium mb-6 pb-2 border-b border-gray-200">
              Selected Solo Exhibitions
            </h2>
            <ExhibitionList exhibitions={solo} />
          </section>

          {/* Group Exhibitions */}
          <section>
            <h2 className="text-xl font-medium mb-6 pb-2 border-b border-gray-200">
              Selected Group Exhibitions
            </h2>
            <ExhibitionList exhibitions={group} />
          </section>
        </div>
      </div>
    </main>
  );
}
