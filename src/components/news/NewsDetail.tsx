'use client';

import { News } from '@/types/artwork';
import { useLocale } from '@/i18n';
import { getLocalizedValue } from '@/lib/i18n-utils';
import Link from 'next/link';

interface NewsDetailProps {
  news: News;
}

export default function NewsDetail({ news }: NewsDetailProps) {
  const { locale, t } = useLocale();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale === 'ko' ? 'ko-KR' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const title = getLocalizedValue(locale, news.title, news.title_en);
  const content = getLocalizedValue(locale, news.content, news.content_en);

  return (
    <article>
      {/* Back Link */}
      <Link
        href="/news"
        className="inline-flex items-center text-[var(--text-secondary)] hover:text-[var(--foreground)] transition-colors mb-8"
      >
        <svg
          className="w-4 h-4 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        {t.news.title}
      </Link>

      {/* Header */}
      <header className="mb-8">
        <span className="text-xs text-[var(--text-secondary)] uppercase tracking-wider">
          {t.news.types[news.type]}
        </span>
        <h1 className="text-3xl font-light text-[var(--foreground)] mt-2 mb-4">
          {title}
        </h1>
        <p className="text-[var(--text-secondary)]">
          {formatDate(news.published_at)}
        </p>
      </header>

      {/* Thumbnail - 외부 이미지용 img 태그 사용 */}
      {news.thumbnail_url && (
        <div className="aspect-video relative bg-[var(--border)] mb-8 overflow-hidden">
          <img
            src={news.thumbnail_url}
            alt={title || ''}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Content */}
      <div className="max-w-none">
        {content?.split('\n').map((paragraph, index) => (
          <p key={index} className="text-[var(--foreground)] leading-relaxed mb-4">
            {paragraph}
          </p>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-4 mt-10 pt-8 border-t border-[var(--border)]">
        {news.link_url && (
          <a
            href={news.link_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-5 py-2.5 border border-[var(--foreground)] text-[var(--foreground)] text-sm tracking-wider hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-colors"
          >
            {t.news.externalLink}
            <svg
              className="w-4 h-4 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        )}
        {news.pdf_url && (
          <a
            href={news.pdf_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-5 py-2.5 border border-[var(--border)] text-[var(--text-secondary)] text-sm tracking-wider hover:border-[var(--foreground)] hover:text-[var(--foreground)] transition-colors"
          >
            {t.news.downloadPdf}
            <svg
              className="w-4 h-4 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </a>
        )}
      </div>
    </article>
  );
}
