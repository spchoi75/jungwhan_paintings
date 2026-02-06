import { supabase } from '@/lib/supabase/client';
import Header from '@/components/common/Header';
import ContactContent from '@/components/contact/ContactContent';

export const revalidate = 3600;

async function getContactInfo() {
  const { data, error } = await supabase
    .from('about_info')
    .select(`
      artist_name,
      artist_name_en,
      bio_paragraphs,
      bio_paragraphs_en,
      contact_email,
      social_links,
      studio_address,
      studio_address_en
    `)
    .single();

  if (error) {
    console.error('Error fetching contact info:', error);
    return null;
  }

  return data;
}

export default async function ContactPage() {
  const contactInfo = await getContactInfo();

  return (
    <main className="min-h-screen bg-[var(--background)]">
      <Header />
      <div className="pt-24 pb-16 px-6">
        <div className="max-w-2xl mx-auto">
          <ContactContent contactInfo={contactInfo} />
        </div>
      </div>
    </main>
  );
}
