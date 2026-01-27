'use client';

import { useState, useEffect } from 'react';
import { News, NewsFormData } from '@/types/artwork';
import Button from '@/components/common/Button';

const NEWS_TYPES = [
  { value: 'article', label: '기사' },
  { value: 'interview', label: '인터뷰' },
  { value: 'artist_note', label: '작가노트' },
  { value: 'review', label: '리뷰' },
] as const;

interface NewsFormProps {
  news?: News;
  onSubmit: (data: NewsFormData) => Promise<void>;
  onCancel: () => void;
}

export default function NewsForm({ news, onSubmit, onCancel }: NewsFormProps) {
  const [formData, setFormData] = useState<NewsFormData>({
    title: news?.title || '',
    title_en: news?.title_en || '',
    content: news?.content || '',
    content_en: news?.content_en || '',
    thumbnail_url: news?.thumbnail_url || '',
    link_url: news?.link_url || '',
    pdf_url: news?.pdf_url || '',
    type: news?.type || 'article',
    published_at: news?.published_at
      ? new Date(news.published_at).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (news) {
      setFormData({
        title: news.title || '',
        title_en: news.title_en || '',
        content: news.content || '',
        content_en: news.content_en || '',
        thumbnail_url: news.thumbnail_url || '',
        link_url: news.link_url || '',
        pdf_url: news.pdf_url || '',
        type: news.type || 'article',
        published_at: news.published_at
          ? new Date(news.published_at).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
      });
    }
  }, [news]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await onSubmit({
        ...formData,
        published_at: formData.published_at
          ? new Date(formData.published_at).toISOString()
          : undefined,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : '저장 실패');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-900/30 text-red-400 text-sm rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            제목 *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-white bg-[#1a1a1a] text-white placeholder-gray-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            제목 (영문)
          </label>
          <input
            type="text"
            value={formData.title_en || ''}
            onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
            className="w-full px-3 py-2 border border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-white bg-[#1a1a1a] text-white placeholder-gray-500"
            placeholder="News Title"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            내용 *
          </label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            className="w-full h-40 px-3 py-2 border border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-white resize-none bg-[#1a1a1a] text-white placeholder-gray-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            내용 (영문)
          </label>
          <textarea
            value={formData.content_en || ''}
            onChange={(e) => setFormData({ ...formData, content_en: e.target.value })}
            className="w-full h-40 px-3 py-2 border border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-white resize-none bg-[#1a1a1a] text-white placeholder-gray-500"
            placeholder="News content in English"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            유형 *
          </label>
          <select
            value={formData.type}
            onChange={(e) =>
              setFormData({
                ...formData,
                type: e.target.value as NewsFormData['type'],
              })
            }
            className="w-full px-3 py-2 border border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-white bg-[#1a1a1a] text-white"
          >
            {NEWS_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            발행일
          </label>
          <input
            type="date"
            value={formData.published_at || ''}
            onChange={(e) => setFormData({ ...formData, published_at: e.target.value })}
            className="w-full px-3 py-2 border border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-white bg-[#1a1a1a] text-white"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          썸네일 URL
        </label>
        <input
          type="url"
          value={formData.thumbnail_url || ''}
          onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
          placeholder="https://..."
          className="w-full px-3 py-2 border border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-white bg-[#1a1a1a] text-white placeholder-gray-500"
        />
        <p className="text-xs text-gray-500 mt-1">외부 이미지 URL을 입력하세요</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            외부 링크 URL
          </label>
          <input
            type="url"
            value={formData.link_url || ''}
            onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
            placeholder="https://..."
            className="w-full px-3 py-2 border border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-white bg-[#1a1a1a] text-white placeholder-gray-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            PDF URL
          </label>
          <input
            type="url"
            value={formData.pdf_url || ''}
            onChange={(e) => setFormData({ ...formData, pdf_url: e.target.value })}
            placeholder="https://..."
            className="w-full px-3 py-2 border border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-white bg-[#1a1a1a] text-white placeholder-gray-500"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          취소
        </Button>
        <Button type="submit" loading={loading}>
          {news ? '수정' : '추가'}
        </Button>
      </div>
    </form>
  );
}
