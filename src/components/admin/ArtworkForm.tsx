'use client';

import { useState } from 'react';
import { Artwork, ArtworkFormData, Category } from '@/types/artwork';
import Button from '@/components/common/Button';
import ImageUploader from './ImageUploader';

interface ArtworkFormProps {
  artwork?: Artwork;
  categories: Category[];
  onSubmit: (data: ArtworkFormData & { image_url: string; thumbnail_url: string }) => Promise<void>;
  onCancel: () => void;
}

export default function ArtworkForm({ artwork, categories, onSubmit, onCancel }: ArtworkFormProps) {
  const [title, setTitle] = useState(artwork?.title || '');
  const [year, setYear] = useState(artwork?.year?.toString() || new Date().getFullYear().toString());
  const [width, setWidth] = useState(artwork?.width?.toString() || '');
  const [height, setHeight] = useState(artwork?.height?.toString() || '');
  const [medium, setMedium] = useState(artwork?.medium || '');
  const [description, setDescription] = useState(artwork?.description || '');
  const [categoryId, setCategoryId] = useState(artwork?.category_id || '');
  const [isFeatured, setIsFeatured] = useState(artwork?.is_featured || false);
  const [imageUrl, setImageUrl] = useState(artwork?.image_url || '');
  const [thumbnailUrl, setThumbnailUrl] = useState(artwork?.thumbnail_url || '');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = '제목을 입력해주세요';
    }

    if (!year || isNaN(parseInt(year)) || parseInt(year) < 1900 || parseInt(year) > new Date().getFullYear() + 1) {
      newErrors.year = '올바른 연도를 입력해주세요';
    }

    if (!imageUrl) {
      newErrors.image = '이미지를 업로드해주세요';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    try {
      await onSubmit({
        title: title.trim(),
        year: parseInt(year),
        width: width ? parseInt(width) : undefined,
        height: height ? parseInt(height) : undefined,
        medium: medium.trim() || undefined,
        description: description.trim() || undefined,
        category_id: categoryId || undefined,
        is_featured: isFeatured,
        image_url: imageUrl,
        thumbnail_url: thumbnailUrl,
      });
    } catch (err) {
      console.error('Submit error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (newImageUrl: string, newThumbnailUrl: string) => {
    setImageUrl(newImageUrl);
    setThumbnailUrl(newThumbnailUrl);
    setErrors((prev) => ({ ...prev, image: '' }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <ImageUploader
          onUpload={handleImageUpload}
          currentImage={imageUrl}
        />
        {errors.image && (
          <p className="text-red-400 text-sm mt-1">{errors.image}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-gray-300">
          제목 <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full h-10 px-3 border border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-white bg-[#1a1a1a] text-white placeholder-gray-500"
          placeholder="작품 제목"
        />
        {errors.title && (
          <p className="text-red-400 text-sm mt-1">{errors.title}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-gray-300">카테고리</label>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="w-full h-10 px-3 border border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-white bg-[#1a1a1a] text-white"
        >
          <option value="">선택 안함</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-300">
            연도 <span className="text-red-400">*</span>
          </label>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="w-full h-10 px-3 border border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-white bg-[#1a1a1a] text-white placeholder-gray-500"
            placeholder="2024"
            min="1900"
            max={new Date().getFullYear() + 1}
          />
          {errors.year && (
            <p className="text-red-400 text-sm mt-1">{errors.year}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-300">가로 (cm)</label>
          <input
            type="number"
            value={width}
            onChange={(e) => setWidth(e.target.value)}
            className="w-full h-10 px-3 border border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-white bg-[#1a1a1a] text-white placeholder-gray-500"
            placeholder="100"
            min="1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-300">세로 (cm)</label>
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className="w-full h-10 px-3 border border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-white bg-[#1a1a1a] text-white placeholder-gray-500"
            placeholder="80"
            min="1"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-gray-300">재료/기법</label>
        <input
          type="text"
          value={medium}
          onChange={(e) => setMedium(e.target.value)}
          className="w-full h-10 px-3 border border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-white bg-[#1a1a1a] text-white placeholder-gray-500"
          placeholder="Oil on canvas"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-gray-300">작품 설명</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full h-32 px-3 py-2 border border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-white resize-none bg-[#1a1a1a] text-white placeholder-gray-500"
          placeholder="작품에 대한 설명을 입력하세요..."
        />
      </div>

      <div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={isFeatured}
            onChange={(e) => setIsFeatured(e.target.checked)}
            className="w-4 h-4"
          />
          <span className="text-sm text-gray-300">대표작으로 설정 (메인 슬라이드쇼에 표시)</span>
        </label>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-700">
        <Button type="button" variant="secondary" onClick={onCancel}>
          취소
        </Button>
        <Button type="submit" loading={loading}>
          저장
        </Button>
      </div>
    </form>
  );
}
