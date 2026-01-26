'use client';

import { Exhibition } from '@/types/artwork';
import { useLocale } from '@/i18n';
import { getLocalizedValue } from '@/lib/i18n-utils';

interface ExhibitionsContentProps {
  solo: Exhibition[];
  group: Exhibition[];
}

export default function ExhibitionsContent({ solo, group }: ExhibitionsContentProps) {
  const { locale, t } = useLocale();

  const renderExhibition = (exhibition: Exhibition) => {
    const title = getLocalizedValue(locale, exhibition.title, exhibition.title_en);
    const venue = getLocalizedValue(locale, exhibition.venue, exhibition.venue_en);
    const location = exhibition.location
      ? getLocalizedValue(locale, exhibition.location, exhibition.location_en)
      : null;

    return (
      <li key={exhibition.id} className="flex items-baseline gap-4">
        <span className="text-gray-500 w-16 flex-shrink-0">{exhibition.year}</span>
        <div>
          <span className="text-gray-300">{title}</span>
          <span className="text-gray-500">
            {' — '}{venue}
            {location && `, ${location}`}
          </span>
        </div>
      </li>
    );
  };

  return (
    <>
      <h1 className="text-3xl font-light tracking-wide mb-12 text-white">
        {t.exhibitions.title}
      </h1>

      {/* Solo Exhibitions */}
      <section className="mb-16">
        <h2 className="text-xl font-medium mb-6 pb-2 border-b border-gray-700 text-white">
          {t.exhibitions.soloExhibitions}
        </h2>
        {solo.length > 0 ? (
          <ul className="space-y-3">
            {solo.map(renderExhibition)}
          </ul>
        ) : (
          <p className="text-gray-500">{t.exhibitions.noExhibitions}</p>
        )}
      </section>

      {/* Group Exhibitions */}
      <section>
        <h2 className="text-xl font-medium mb-6 pb-2 border-b border-gray-700 text-white">
          {t.exhibitions.groupExhibitions}
        </h2>
        {group.length > 0 ? (
          <ul className="space-y-3">
            {group.map(renderExhibition)}
          </ul>
        ) : (
          <p className="text-gray-500">{t.exhibitions.noExhibitions}</p>
        )}
      </section>
    </>
  );
}
