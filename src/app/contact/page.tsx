import { supabase } from '@/lib/supabase/client';
import Header from '@/components/common/Header';

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
    <main className="min-h-screen bg-white">
      <Header />
      <div className="pt-24 pb-16 px-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-light tracking-wide mb-12">
            Contact
          </h1>

          <div className="space-y-8">
            {/* Email */}
            <div>
              <h2 className="text-sm text-gray-500 uppercase tracking-wider mb-2">
                Email
              </h2>
              {contactInfo?.contact_email ? (
                <a
                  href={`mailto:${contactInfo.contact_email}`}
                  className="text-lg hover:text-gray-600 transition-colors"
                >
                  {contactInfo.contact_email}
                </a>
              ) : (
                <p className="text-gray-400">Contact information not available</p>
              )}
            </div>

            {/* Inquiry notice */}
            <div className="pt-8 border-t border-gray-100">
              <p className="text-gray-500 text-sm leading-relaxed">
                For inquiries about artworks, exhibitions, or collaborations,
                please feel free to reach out via email.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
