'use client';

import Image from 'next/image';
import { AboutInfo, Exhibition } from '@/types/artwork';
import { useLocale } from '@/i18n';
import { getLocalizedValue } from '@/lib/i18n-utils';

interface AboutContentProps {
  aboutInfo: AboutInfo | null;
  exhibitions: Exhibition[];
}

export default function AboutContent({ aboutInfo, exhibitions }: AboutContentProps) {
  const { locale, t } = useLocale();

  const artistName = aboutInfo
    ? getLocalizedValue(locale, aboutInfo.artist_name, aboutInfo.artist_name_en)
    : 'Jungwhan';

  const bioParagraphs = aboutInfo
    ? getLocalizedValue(
        locale,
        aboutInfo.bio_paragraphs && aboutInfo.bio_paragraphs.length > 0
          ? aboutInfo.bio_paragraphs
          : t.about.defaultBio,
        aboutInfo.bio_paragraphs_en && aboutInfo.bio_paragraphs_en.length > 0
          ? aboutInfo.bio_paragraphs_en
          : null
      )
    : t.about.defaultBio;

  const education = aboutInfo?.education || [];
  const profileImageUrl = aboutInfo?.profile_image_url;
  const cvFileUrl = aboutInfo?.cv_file_url;

  // Group exhibitions by type
  const soloExhibitions = exhibitions.filter(e => e.type === 'solo');
  const groupExhibitions = exhibitions.filter(e => e.type === 'group');

  return (
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
            <h3 className="text-lg font-medium mb-4 text-white">{t.about.education}</h3>
            <ul className="space-y-2 text-gray-400">
              {education.map((item, index) => (
                <li key={index}>
                  {item.year} — {getLocalizedValue(locale, item.description, item.description_en)}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Solo Exhibitions */}
        {soloExhibitions.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-medium mb-4 text-white">
              {locale === 'en' ? 'Solo Exhibitions' : '개인전'}
            </h3>
            <ul className="space-y-2 text-gray-400">
              {soloExhibitions.map((exhibition) => (
                <li key={exhibition.id}>
                  {exhibition.year} — {getLocalizedValue(locale, exhibition.title, exhibition.title_en)}
                  {(exhibition.venue || exhibition.venue_en) && (
                    <span className="text-gray-500">
                      , {getLocalizedValue(locale, exhibition.venue, exhibition.venue_en)}
                    </span>
                  )}
                  {(exhibition.location || exhibition.location_en) && (
                    <span className="text-gray-500">
                      , {getLocalizedValue(locale, exhibition.location, exhibition.location_en)}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Group Exhibitions */}
        {groupExhibitions.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-medium mb-4 text-white">
              {locale === 'en' ? 'Group Exhibitions' : '단체전'}
            </h3>
            <ul className="space-y-2 text-gray-400">
              {groupExhibitions.map((exhibition) => (
                <li key={exhibition.id}>
                  {exhibition.year} — {getLocalizedValue(locale, exhibition.title, exhibition.title_en)}
                  {(exhibition.venue || exhibition.venue_en) && (
                    <span className="text-gray-500">
                      , {getLocalizedValue(locale, exhibition.venue, exhibition.venue_en)}
                    </span>
                  )}
                  {(exhibition.location || exhibition.location_en) && (
                    <span className="text-gray-500">
                      , {getLocalizedValue(locale, exhibition.location, exhibition.location_en)}
                    </span>
                  )}
                </li>
              ))}
            </ul>
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
              {t.about.downloadCv}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
