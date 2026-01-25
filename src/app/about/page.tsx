import Image from 'next/image';
import Header from '@/components/common/Header';
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

  const artistName = aboutInfo?.artist_name || 'Jungwhan';
  const bioParagraphs = aboutInfo?.bio_paragraphs && aboutInfo.bio_paragraphs.length > 0
    ? aboutInfo.bio_paragraphs
    : ['작가 소개 텍스트를 여기에 입력하세요.', '작업 철학, 영감의 원천, 예술적 여정 등을 기술할 수 있습니다.'];
  const education = aboutInfo?.education || [];
  const exhibitions = aboutInfo?.exhibitions || [];
  const contactEmail = aboutInfo?.contact_email || '';
  const profileImageUrl = aboutInfo?.profile_image_url;
  const cvFileUrl = aboutInfo?.cv_file_url;

  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      <Header />

      <div className="max-w-4xl mx-auto px-6 pt-24 pb-16">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Profile Image */}
          <div className="aspect-[3/4] relative bg-gray-800">
            {profileImageUrl ? (
              <Image
                src={profileImageUrl}
                alt={artistName}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-gray-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="64"
                  height="64"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
            )}
          </div>

          {/* Bio */}
          <div>
            <h1 className="text-4xl font-light tracking-wide mb-6 text-white">
              {artistName}
            </h1>

            <div className="space-y-4 text-gray-300 leading-relaxed">
              {bioParagraphs.map((para, index) => (
                <p key={index}>{para}</p>
              ))}
            </div>

            {/* Education */}
            {education.length > 0 && (
              <div className="mt-10">
                <h3 className="text-lg font-medium mb-4 text-white">Education</h3>
                <ul className="space-y-2 text-gray-400">
                  {education.map((item, index) => (
                    <li key={index}>{item.year} — {item.description}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Exhibitions */}
            {exhibitions.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-medium mb-4 text-white">Exhibitions</h3>
                <ul className="space-y-2 text-gray-400">
                  {exhibitions.map((item, index) => (
                    <li key={index}>{item.year} — {item.description}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Contact */}
            {contactEmail && (
              <div className="mt-10 pt-8 border-t border-gray-700">
                <h3 className="text-lg font-medium mb-4 text-white">Contact</h3>
                <p className="text-gray-400">{contactEmail}</p>
              </div>
            )}

            {/* CV Download */}
            {cvFileUrl && (
              <div className="mt-8">
                <a
                  href={cvFileUrl}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-6 py-3 border border-white text-white text-sm tracking-wider hover:bg-white hover:text-black transition-colors"
                >
                  DOWNLOAD CV
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
