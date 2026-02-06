'use client';

import Link from 'next/link';
import { News } from '@/types/artwork';
import { useLocale } from '@/i18n';
import { getLocalizedValue } from '@/lib/i18n-utils';

interface NewsContentProps {
  news: News[];
}

export default function NewsContent({ news }: NewsContentProps) {
  const { locale, t } = useLocale();

  if (news.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-[var(--text-secondary)]">{t.news.noNews}</p>
      </div>
    );
  }

  const featuredNews = news[0];
  const restNews = news.slice(1);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale === 'ko' ? 'ko-KR' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div>
      <h1 className="text-3xl font-light tracking-wide mb-10 text-[var(--foreground)]">
        {t.news.title}
      </h1>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Featured News (Left) */}
        <Link href={`/news/${featuredNews.id}`} className="group">
          <article className="h-full">
            {featuredNews.thumbnail_url && (
              <div className="aspect-[4/3] relative bg-[var(--border)] mb-4 overflow-hidden">
                <img
                  src={featuredNews.thumbnail_url}
                  alt={getLocalizedValue(locale, featuredNews.title, featuredNews.title_en) || ''}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            )}
            <div className="space-y-2">
              <span className="text-xs text-[var(--text-secondary)] uppercase tracking-wider">
                {t.news.types[featuredNews.type]}
              </span>
              <h2 className="text-xl font-light text-[var(--foreground)] group-hover:text-[var(--text-secondary)] transition-colors">
                {getLocalizedValue(locale, featuredNews.title, featuredNews.title_en)}
              </h2>
              <p className="text-sm text-[var(--text-secondary)]">
                {formatDate(featuredNews.published_at)}
              </p>
              <p className="text-[var(--text-secondary)] line-clamp-3">
                {getLocalizedValue(locale, featuredNews.content, featuredNews.content_en)}
              </p>
            </div>
          </article>
        </Link>

        {/* News List (Right) */}
        <div className="space-y-6">
          {restNews.map((item) => (
            <Link key={item.id} href={`/news/${item.id}`} className="group block">
              <article className="flex gap-4">
                {item.thumbnail_url && (
                  <div className="w-24 h-24 flex-shrink-0 relative bg-[var(--border)] overflow-hidden">
                    <img
                      src={item.thumbnail_url}
                      alt={getLocalizedValue(locale, item.title, item.title_en) || ''}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <span className="text-xs text-[var(--text-secondary)] uppercase tracking-wider">
                    {t.news.types[item.type]}
                  </span>
                  <h3 className="text-[var(--foreground)] font-light group-hover:text-[var(--text-secondary)] transition-colors line-clamp-2">
                    {getLocalizedValue(locale, item.title, item.title_en)}
                  </h3>
                  <p className="text-sm text-[var(--text-secondary)] mt-1">
                    {formatDate(item.published_at)}
                  </p>
                </div>
              </article>
            </Link>
          ))}

          {restNews.length === 0 && (
            <p className="text-[var(--text-secondary)] text-center py-8">
              {t.news.noNews}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
