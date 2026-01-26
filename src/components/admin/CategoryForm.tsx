'use client';

import { useState, useEffect } from 'react';
import { Category, CategoryFormData } from '@/types/artwork';
import Button from '@/components/common/Button';
import ImageUploader from '@/components/admin/ImageUploader';

interface CategoryFormProps {
  category?: Category;
  onSubmit: (data: CategoryFormData & { cover_image_url?: string }) => Promise<void>;
  onCancel: () => void;
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9가-힣\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export default function CategoryForm({
  category,
  onSubmit,
  onCancel,
}: CategoryFormProps) {
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    name_en: '',
    slug: '',
    description: '',
    description_en: '',
  });
  const [coverImageUrl, setCoverImageUrl] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        name_en: category.name_en || '',
        slug: category.slug,
        description: category.description || '',
        description_en: category.description_en || '',
      });
      setCoverImageUrl(category.cover_image_url || '');
    }
  }, [category]);

  const handleNameChange = (name: string) => {
    setFormData((prev) => ({
      ...prev,
      name,
      slug: category ? prev.slug : generateSlug(name),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await onSubmit({
        ...formData,
        cover_image_url: coverImageUrl || undefined,
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
          <label className="block text-sm font-medium mb-1 text-gray-300">
            카테고리 이름 <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleNameChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-white bg-[#1a1a1a] text-white placeholder-gray-500"
            required
            placeholder="예: 풍경화, 인물화, 추상화"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-300">
            카테고리 이름 (영문)
          </label>
          <input
            type="text"
            value={formData.name_en}
            onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
            className="w-full px-3 py-2 border border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-white bg-[#1a1a1a] text-white placeholder-gray-500"
            placeholder="e.g. Landscape, Portrait, Abstract"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-gray-300">
          슬러그 (URL) <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          value={formData.slug}
          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
          className="w-full px-3 py-2 border border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-white bg-[#1a1a1a] text-white placeholder-gray-500"
          required
          placeholder="예: landscape, portrait, abstract"
        />
        <p className="text-xs text-gray-400 mt-1">
          URL에 사용됩니다: /portfolio/{formData.slug || 'slug'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-300">설명</label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-white resize-none bg-[#1a1a1a] text-white placeholder-gray-500"
            rows={3}
            placeholder="이 카테고리에 대한 간단한 설명"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-300">설명 (영문)</label>
          <textarea
            value={formData.description_en}
            onChange={(e) =>
              setFormData({ ...formData, description_en: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-white resize-none bg-[#1a1a1a] text-white placeholder-gray-500"
            rows={3}
            placeholder="Brief description of this category"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-gray-300">커버 이미지</label>
        <ImageUploader
          onUpload={(imageUrl) => setCoverImageUrl(imageUrl)}
          currentImage={coverImageUrl}
        />
        <p className="text-xs text-gray-400 mt-1">
          포트폴리오 페이지에서 카테고리 썸네일로 표시됩니다
        </p>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          취소
        </Button>
        <Button type="submit" loading={loading}>
          {category ? '수정' : '저장'}
        </Button>
      </div>
    </form>
  );
}
