'use client';

import Image from 'next/image';
import Link from 'next/link';
import { News } from '@/types/artwork';
import { useLocale } from '@/i18n';
import { getLocalizedValue } from '@/lib/i18n-utils';

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
        className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-8"
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
        <span className="text-xs text-gray-500 uppercase tracking-wider">
          {t.news.types[news.type]}
        </span>
        <h1 className="text-3xl font-light text-white mt-2 mb-4">
          {title}
        </h1>
        <p className="text-gray-500">
          {formatDate(news.published_at)}
        </p>
      </header>

      {/* Thumbnail */}
      {news.thumbnail_url && (
        <div className="aspect-video relative bg-gray-800 mb-8 overflow-hidden">
          <Image
            src={news.thumbnail_url}
            alt={title || ''}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Content */}
      <div className="prose prose-invert prose-gray max-w-none">
        {content?.split('\n').map((paragraph, index) => (
          <p key={index} className="text-gray-300 leading-relaxed mb-4">
            {paragraph}
          </p>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-4 mt-10 pt-8 border-t border-gray-800">
        {news.link_url && (
          <a
            href={news.link_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-5 py-2.5 border border-white text-white text-sm tracking-wider hover:bg-white hover:text-black transition-colors"
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
            className="inline-flex items-center px-5 py-2.5 border border-gray-600 text-gray-300 text-sm tracking-wider hover:border-white hover:text-white transition-colors"
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
