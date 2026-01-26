import { supabase } from '@/lib/supabase/client';
import Header from '@/components/common/Header';
import ContactContent from '@/components/contact/ContactContent';

export const revalidate = 3600;

async function getContactInfo() {
  const { data, error } = await supabase
    .from('about_info')
    .select('contact_email, artist_name')
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
    <main className="min-h-screen bg-[#0a0a0a]">
      <Header />
      <div className="pt-24 pb-16 px-6">
        <div className="max-w-2xl mx-auto">
          <ContactContent contactEmail={contactInfo?.contact_email || null} />
        </div>
      </div>
    </main>
  );
}
