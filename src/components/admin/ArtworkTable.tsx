'use client';

import Image from 'next/image';
import { Artwork, Category } from '@/types/artwork';
import Button from '@/components/common/Button';

interface ArtworkTableProps {
  artworks: Artwork[];
  categories: Category[];
  onEdit: (artwork: Artwork) => void;
  onDelete: (artwork: Artwork) => void;
}

export default function ArtworkTable({ artworks, categories, onEdit, onDelete }: ArtworkTableProps) {
  const getCategoryName = (categoryId: string | null) => {
    if (!categoryId) return '-';
    const category = categories.find((c) => c.id === categoryId);
    return category?.name || '-';
  };

  if (artworks.length === 0) {
    return (
      <div className="text-center py-12 bg-[#141414] border border-gray-700 rounded">
        <p className="text-gray-400">
          등록된 작품이 없습니다. 첫 작품을 추가해보세요.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#141414] border border-gray-700 rounded overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#1a1a1a] border-b border-gray-700">
            <tr>
              <th className="text-left py-3 px-4 font-medium text-sm text-gray-400 w-10"></th>
              <th className="text-left py-3 px-4 font-medium text-sm text-gray-400 w-20">썸네일</th>
              <th className="text-left py-3 px-4 font-medium text-sm text-gray-400">제목</th>
              <th className="text-left py-3 px-4 font-medium text-sm text-gray-400 w-28">카테고리</th>
              <th className="text-left py-3 px-4 font-medium text-sm text-gray-400 w-20">연도</th>
              <th className="text-right py-3 px-4 font-medium text-sm text-gray-400 w-32">액션</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {artworks.map((artwork) => (
              <tr
                key={artwork.id}
                className="hover:bg-gray-800"
              >
                <td className="py-3 px-4">
                  {artwork.is_featured && (
                    <span className="text-yellow-500" title="대표작">★</span>
                  )}
                </td>
                <td className="py-3 px-4">
                  <div className="relative w-12 h-12 bg-gray-800 rounded overflow-hidden">
                    <Image
                      src={artwork.thumbnail_url}
                      alt={artwork.title}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className="font-medium text-white">{artwork.title}</span>
                  {artwork.medium && (
                    <span className="text-gray-400 text-sm ml-2">
                      · {artwork.medium}
                    </span>
                  )}
                </td>
                <td className="py-3 px-4">
                  <span className="text-gray-400 text-sm">
                    {getCategoryName(artwork.category_id)}
                  </span>
                </td>
                <td className="py-3 px-4 text-gray-400">
                  {artwork.year}
                </td>
                <td className="py-3 px-4">
                  <div className="flex justify-end gap-2 flex-nowrap">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(artwork)}
                      className="whitespace-nowrap"
                    >
                      수정
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(artwork)}
                      className="text-red-400 hover:bg-red-900/30 whitespace-nowrap"
                    >
                      삭제
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
