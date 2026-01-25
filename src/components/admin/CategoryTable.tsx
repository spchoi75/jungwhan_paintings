'use client';

import Image from 'next/image';
import { Category } from '@/types/artwork';

interface CategoryTableProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}

export default function CategoryTable({
  categories,
  onEdit,
  onDelete,
}: CategoryTableProps) {
  if (categories.length === 0) {
    return (
      <div className="text-center py-12 bg-[#141414] rounded border border-gray-700">
        <p className="text-gray-400">등록된 카테고리가 없습니다</p>
        <p className="text-gray-500 text-sm mt-1">
          새 카테고리를 추가해보세요
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#141414] rounded border border-gray-700 overflow-hidden">
      <table className="w-full">
        <thead className="bg-[#1a1a1a] border-b border-gray-700">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">
              커버 이미지
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">
              이름
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">
              슬러그
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">
              설명
            </th>
            <th className="px-4 py-3 text-right text-sm font-medium text-gray-400">
              관리
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {categories.map((category) => (
            <tr key={category.id} className="hover:bg-gray-800">
              <td className="px-4 py-3">
                <div className="w-16 h-12 relative bg-gray-800 rounded overflow-hidden">
                  {category.cover_image_url ? (
                    <Image
                      src={category.cover_image_url}
                      alt={category.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500 text-lg">
                      {category.name.charAt(0)}
                    </div>
                  )}
                </div>
              </td>
              <td className="px-4 py-3">
                <span className="font-medium text-white">{category.name}</span>
              </td>
              <td className="px-4 py-3">
                <span className="text-gray-400 text-sm">{category.slug}</span>
              </td>
              <td className="px-4 py-3">
                <span className="text-gray-400 text-sm line-clamp-1">
                  {category.description || '-'}
                </span>
              </td>
              <td className="px-4 py-3 text-right">
                <button
                  onClick={() => onEdit(category)}
                  className="text-gray-400 hover:text-white text-sm mr-3"
                >
                  수정
                </button>
                <button
                  onClick={() => onDelete(category)}
                  className="text-red-400 hover:text-red-300 text-sm"
                >
                  삭제
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
