'use client';

import { Exhibition } from '@/types/artwork';

interface ExhibitionListProps {
  exhibitions: Exhibition[];
}

function groupByYear(exhibitions: Exhibition[]): Record<number, Exhibition[]> {
  return exhibitions.reduce((acc, exhibition) => {
    const year = exhibition.year;
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(exhibition);
    return acc;
  }, {} as Record<number, Exhibition[]>);
}

export default function ExhibitionList({ exhibitions }: ExhibitionListProps) {
  if (exhibitions.length === 0) {
    return (
      <p className="text-gray-400 text-sm">No exhibitions to display</p>
    );
  }

  const grouped = groupByYear(exhibitions);
  const years = Object.keys(grouped)
    .map(Number)
    .sort((a, b) => b - a); // Descending order (newest first)

  return (
    <div className="space-y-8">
      {years.map((year) => (
        <div key={year}>
          <h3 className="text-lg font-medium mb-4 text-white">{year}</h3>
          <ul className="space-y-3">
            {grouped[year].map((exhibition) => (
              <li key={exhibition.id} className="text-gray-300">
                {exhibition.external_url ? (
                  <a
                    href={exhibition.external_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white hover:underline transition-colors"
                  >
                    {exhibition.title}
                  </a>
                ) : (
                  <span>{exhibition.title}</span>
                )}
                <span className="text-gray-500">
                  {' '}— {exhibition.venue}
                  {exhibition.location && `, ${exhibition.location}`}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
