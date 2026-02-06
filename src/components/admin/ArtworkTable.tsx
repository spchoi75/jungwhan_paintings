'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { Artwork, Category } from '@/types/artwork';
import Button from '@/components/common/Button';

type SortField = 'title' | 'year' | 'medium' | 'category';
type SortOrder = 'asc' | 'desc';

interface ArtworkTableProps {
  artworks: Artwork[];
  categories: Category[];
  onEdit: (artwork: Artwork) => void;
  onDelete: (artwork: Artwork) => void;
}

export default function ArtworkTable({ artworks, categories, onEdit, onDelete }: ArtworkTableProps) {
  const [sortField, setSortField] = useState<SortField>('year');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const getCategoryName = (categoryId: string | null) => {
    if (!categoryId) return '-';
    const category = categories.find((c) => c.id === categoryId);
    return category?.name || '-';
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder(field === 'year' ? 'desc' : 'asc');
    }
  };

  const sortedArtworks = useMemo(() => {
    return [...artworks].sort((a, b) => {
      let comparison = 0;
      
      switch (sortField) {
        case 'title':
          comparison = (a.title || '').localeCompare(b.title || '', 'ko');
          break;
        case 'year':
          comparison = (a.year || 0) - (b.year || 0);
          break;
        case 'medium':
          comparison = (a.medium || '').localeCompare(b.medium || '', 'ko');
          break;
        case 'category':
          comparison = getCategoryName(a.category_id).localeCompare(getCategoryName(b.category_id), 'ko');
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [artworks, sortField, sortOrder, categories]);

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <span className="ml-1 text-gray-600">↕</span>;
    }
    return <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>;
  };

  const SortableHeader = ({ field, children, className = '' }: { field: SortField; children: React.ReactNode; className?: string }) => (
    <th
      className={`text-left py-3 px-4 font-medium text-sm text-gray-400 cursor-pointer hover:text-gray-200 select-none ${className}`}
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center">
        {children}
        <SortIcon field={field} />
      </div>
    </th>
  );

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
      {/* Sort Controls */}
      <div className="p-3 border-b border-gray-700 flex items-center gap-2 text-sm">
        <span className="text-gray-500">정렬:</span>
        <select
          value={sortField}
          onChange={(e) => setSortField(e.target.value as SortField)}
          className="bg-[#1a1a1a] border border-gray-600 rounded px-2 py-1 text-gray-300 text-sm"
        >
          <option value="year">연도</option>
          <option value="title">제목</option>
          <option value="medium">재료</option>
          <option value="category">카테고리</option>
        </select>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as SortOrder)}
          className="bg-[#1a1a1a] border border-gray-600 rounded px-2 py-1 text-gray-300 text-sm"
        >
          <option value="desc">내림차순</option>
          <option value="asc">오름차순</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#1a1a1a] border-b border-gray-700">
            <tr>
              <th className="text-left py-3 px-4 font-medium text-sm text-gray-400 w-10"></th>
              <th className="text-left py-3 px-4 font-medium text-sm text-gray-400 w-20">썸네일</th>
              <SortableHeader field="title">제목</SortableHeader>
              <SortableHeader field="category" className="w-28">카테고리</SortableHeader>
              <SortableHeader field="medium" className="w-32">재료</SortableHeader>
              <SortableHeader field="year" className="w-20">연도</SortableHeader>
              <th className="text-right py-3 px-4 font-medium text-sm text-gray-400 w-32">액션</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {sortedArtworks.map((artwork) => (
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
                </td>
                <td className="py-3 px-4">
                  <span className="text-gray-400 text-sm">
                    {getCategoryName(artwork.category_id)}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className="text-gray-400 text-sm">
                    {artwork.medium || '-'}
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
