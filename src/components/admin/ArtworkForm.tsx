'use client';

import { useState, useEffect } from 'react';
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
  const [titleEn, setTitleEn] = useState(artwork?.title_en || '');
  const [year, setYear] = useState(artwork?.year?.toString() || new Date().getFullYear().toString());
  const [width, setWidth] = useState(artwork?.width?.toString() || '');
  const [height, setHeight] = useState(artwork?.height?.toString() || '');
  const [medium, setMedium] = useState(artwork?.medium || '');
  const [mediumEn, setMediumEn] = useState(artwork?.medium_en || '');
  const [collection, setCollection] = useState(artwork?.collection || '');
  const [collectionEn, setCollectionEn] = useState(artwork?.collection_en || '');
  const [variableSize, setVariableSize] = useState(artwork?.variable_size || false);
  const [categoryId, setCategoryId] = useState(artwork?.category_id || '');
  const [isFeatured, setIsFeatured] = useState(artwork?.is_featured || false);
  const [showWatermark, setShowWatermark] = useState(artwork?.show_watermark ?? true);
  const [imageUrl, setImageUrl] = useState(artwork?.image_url || '');
  const [thumbnailUrl, setThumbnailUrl] = useState(artwork?.thumbnail_url || '');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    setTitle(artwork?.title || '');
    setTitleEn(artwork?.title_en || '');
    setYear(artwork?.year?.toString() || new Date().getFullYear().toString());
    setWidth(artwork?.width?.toString() || '');
    setHeight(artwork?.height?.toString() || '');
    setMedium(artwork?.medium || '');
    setMediumEn(artwork?.medium_en || '');
    setCollection(artwork?.collection || '');
    setCollectionEn(artwork?.collection_en || '');
    setVariableSize(artwork?.variable_size || false);
    setCategoryId(artwork?.category_id || '');
    setIsFeatured(artwork?.is_featured || false);
    setShowWatermark(artwork?.show_watermark ?? true);
    setImageUrl(artwork?.image_url || '');
    setThumbnailUrl(artwork?.thumbnail_url || '');
    setErrors({});
    setSubmitError(null);
    setDominantColor(artwork?.dominant_color || null);
  }, [artwork]);

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
    setSubmitError(null);

    try {
      await onSubmit({
        title: title.trim(),
        title_en: titleEn.trim() || undefined,
        year: parseInt(year),
        width: width ? parseInt(width) : undefined,
        height: height ? parseInt(height) : undefined,
        medium: medium.trim() || undefined,
        medium_en: mediumEn.trim() || undefined,
        collection: collection.trim() || undefined,
        collection_en: collectionEn.trim() || undefined,
        variable_size: variableSize,
        category_id: categoryId || undefined,
        is_featured: isFeatured,
        show_watermark: showWatermark,
        image_url: imageUrl,
        thumbnail_url: thumbnailUrl,
        dominant_color: dominantColor,
      });
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : '저장에 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  const [dominantColor, setDominantColor] = useState<string | null>(artwork?.dominant_color || null);

  const handleImageUpload = async (newImageUrl: string, newThumbnailUrl: string) => {
    setImageUrl(newImageUrl);
    setThumbnailUrl(newThumbnailUrl);
    setErrors((prev) => ({ ...prev, image: '' }));
    
    // 색상 자동 분석
    try {
      const res = await fetch('/api/portfolio/analyze-color', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_url: newImageUrl }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.dominant_color) {
          setDominantColor(data.dominant_color);
        }
      }
    } catch (err) {
      console.error('Color analysis failed:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {submitError && (
        <div className="p-3 bg-red-900/30 text-red-400 text-sm rounded">
          {submitError}
        </div>
      )}

      <div>
        <ImageUploader
          onUpload={handleImageUpload}
          currentImage={imageUrl}
        />
        {errors.image && (
          <p className="text-red-400 text-sm mt-1">{errors.image}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">
            제목 <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full h-10 px-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white text-gray-900 placeholder-gray-400"
            placeholder="작품 제목"
          />
          {errors.title && (
            <p className="text-red-400 text-sm mt-1">{errors.title}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">
            제목 (영문)
          </label>
          <input
            type="text"
            value={titleEn}
            onChange={(e) => setTitleEn(e.target.value)}
            className="w-full h-10 px-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white text-gray-900 placeholder-gray-400"
            placeholder="Artwork Title"
          />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">
            연도 <span className="text-red-400">*</span>
          </label>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="w-full h-10 px-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white text-gray-900 placeholder-gray-400"
            placeholder="2024"
            min="1900"
            max={new Date().getFullYear() + 1}
          />
          {errors.year && (
            <p className="text-red-400 text-sm mt-1">{errors.year}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">세로 (cm)</label>
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className="w-full h-10 px-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white text-gray-900 placeholder-gray-400"
            placeholder="80"
            min="1"
            disabled={variableSize}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">가로 (cm)</label>
          <input
            type="number"
            value={width}
            onChange={(e) => setWidth(e.target.value)}
            className="w-full h-10 px-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white text-gray-900 placeholder-gray-400"
            placeholder="100"
            min="1"
            disabled={variableSize}
          />
        </div>

        <div className="flex items-end pb-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={variableSize}
              onChange={(e) => setVariableSize(e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm text-gray-700">가변크기</span>
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">재료/기법</label>
          <input
            type="text"
            value={medium}
            onChange={(e) => setMedium(e.target.value)}
            className="w-full h-10 px-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white text-gray-900 placeholder-gray-400"
            placeholder="캔버스에 유채"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">재료/기법 (영문)</label>
          <input
            type="text"
            value={mediumEn}
            onChange={(e) => setMediumEn(e.target.value)}
            className="w-full h-10 px-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white text-gray-900 placeholder-gray-400"
            placeholder="Oil on canvas"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">소장처</label>
          <input
            type="text"
            value={collection}
            onChange={(e) => setCollection(e.target.value)}
            className="w-full h-10 px-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white text-gray-900 placeholder-gray-400"
            placeholder="국립현대미술관"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">소장처 (영문)</label>
          <input
            type="text"
            value={collectionEn}
            onChange={(e) => setCollectionEn(e.target.value)}
            className="w-full h-10 px-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white text-gray-900 placeholder-gray-400"
            placeholder="National Museum of Modern and Contemporary Art"
          />
        </div>
      </div>

      <div className="space-y-3">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showWatermark}
            onChange={(e) => setShowWatermark(e.target.checked)}
            className="w-4 h-4"
          />
          <span className="text-sm text-gray-700">저작권 워터마크 표시 (© 마크 오버레이)</span>
        </label>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
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
