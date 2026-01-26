'use client';

import { useState } from 'react';
import { Exhibition, ExhibitionFormData } from '@/types/artwork';
import Button from '@/components/common/Button';

interface ExhibitionFormProps {
  exhibition?: Exhibition;
  onSubmit: (data: ExhibitionFormData) => Promise<void>;
  onCancel: () => void;
}

export default function ExhibitionForm({
  exhibition,
  onSubmit,
  onCancel,
}: ExhibitionFormProps) {
  const [formData, setFormData] = useState<ExhibitionFormData>({
    title: exhibition?.title || '',
    title_en: exhibition?.title_en || '',
    venue: exhibition?.venue || '',
    venue_en: exhibition?.venue_en || '',
    location: exhibition?.location || '',
    location_en: exhibition?.location_en || '',
    year: exhibition?.year || new Date().getFullYear(),
    type: exhibition?.type || 'solo',
    external_url: exhibition?.external_url || '',
    display_order: exhibition?.display_order || 0,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await onSubmit(formData);
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
            전시명 *
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
            전시명 (영문)
          </label>
          <input
            type="text"
            value={formData.title_en || ''}
            onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
            className="w-full px-3 py-2 border border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-white bg-[#1a1a1a] text-white placeholder-gray-500"
            placeholder="Exhibition Title"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            장소 (갤러리/기관명) *
          </label>
          <input
            type="text"
            value={formData.venue}
            onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
            className="w-full px-3 py-2 border border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-white bg-[#1a1a1a] text-white placeholder-gray-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            장소 (영문)
          </label>
          <input
            type="text"
            value={formData.venue_en || ''}
            onChange={(e) => setFormData({ ...formData, venue_en: e.target.value })}
            className="w-full px-3 py-2 border border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-white bg-[#1a1a1a] text-white placeholder-gray-500"
            placeholder="Gallery / Institution Name"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            지역
          </label>
          <input
            type="text"
            value={formData.location || ''}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            placeholder="예: 서울, 한국"
            className="w-full px-3 py-2 border border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-white bg-[#1a1a1a] text-white placeholder-gray-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            지역 (영문)
          </label>
          <input
            type="text"
            value={formData.location_en || ''}
            onChange={(e) => setFormData({ ...formData, location_en: e.target.value })}
            placeholder="e.g. Seoul, Korea"
            className="w-full px-3 py-2 border border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-white bg-[#1a1a1a] text-white placeholder-gray-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            연도 *
          </label>
          <input
            type="number"
            value={formData.year}
            onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
            min="1900"
            max="2100"
            className="w-full px-3 py-2 border border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-white bg-[#1a1a1a] text-white placeholder-gray-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            유형 *
          </label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as 'solo' | 'group' })}
            className="w-full px-3 py-2 border border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-white bg-[#1a1a1a] text-white"
          >
            <option value="solo">개인전</option>
            <option value="group">그룹전</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          외부 링크
        </label>
        <input
          type="url"
          value={formData.external_url || ''}
          onChange={(e) => setFormData({ ...formData, external_url: e.target.value })}
          placeholder="https://..."
          className="w-full px-3 py-2 border border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-white bg-[#1a1a1a] text-white placeholder-gray-500"
        />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          취소
        </Button>
        <Button type="submit" loading={loading}>
          {exhibition ? '수정' : '추가'}
        </Button>
      </div>
    </form>
  );
}
