'use client';

import Image from 'next/image';
import { Artwork } from '@/types/artwork';
import Button from '@/components/common/Button';

interface ArtworkTableProps {
  artworks: Artwork[];
  onEdit: (artwork: Artwork) => void;
  onDelete: (artwork: Artwork) => void;
}

export default function ArtworkTable({ artworks, onEdit, onDelete }: ArtworkTableProps) {
  if (artworks.length === 0) {
    return (
      <div className="text-center py-12 bg-[var(--surface)] border border-[var(--border)]">
        <p className="text-[var(--text-secondary)]">
          등록된 작품이 없습니다. 첫 작품을 추가해보세요.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-[var(--border)]">
            <th className="text-left py-3 px-4 font-medium text-sm w-10"></th>
            <th className="text-left py-3 px-4 font-medium text-sm w-20">썸네일</th>
            <th className="text-left py-3 px-4 font-medium text-sm">제목</th>
            <th className="text-left py-3 px-4 font-medium text-sm w-20">연도</th>
            <th className="text-left py-3 px-4 font-medium text-sm w-32">크기</th>
            <th className="text-right py-3 px-4 font-medium text-sm w-32">액션</th>
          </tr>
        </thead>
        <tbody>
          {artworks.map((artwork) => (
            <tr
              key={artwork.id}
              className="border-b border-[var(--border)] hover:bg-[var(--background)]"
            >
              <td className="py-3 px-4">
                {artwork.is_featured && (
                  <span className="text-yellow-500" title="대표작">★</span>
                )}
              </td>
              <td className="py-3 px-4">
                <div className="relative w-12 h-12 bg-[var(--border)]">
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
                <span className="font-medium">{artwork.title}</span>
                {artwork.medium && (
                  <span className="text-[var(--text-secondary)] text-sm ml-2">
                    · {artwork.medium}
                  </span>
                )}
              </td>
              <td className="py-3 px-4 text-[var(--text-secondary)]">
                {artwork.year}
              </td>
              <td className="py-3 px-4 text-[var(--text-secondary)] text-sm">
                {artwork.width && artwork.height
                  ? `${artwork.width} × ${artwork.height} cm`
                  : '-'}
              </td>
              <td className="py-3 px-4">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(artwork)}
                  >
                    수정
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(artwork)}
                    className="text-red-500 hover:bg-red-50"
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
  );
}
