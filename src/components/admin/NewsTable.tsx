'use client';

import { News } from '@/types/artwork';

const NEWS_TYPE_LABELS: Record<News['type'], string> = {
  article: '기사',
  interview: '인터뷰',
  artist_note: '작가노트',
  review: '리뷰',
};

interface NewsTableProps {
  news: News[];
  onEdit: (news: News) => void;
  onDelete: (id: string) => void;
}

export default function NewsTable({ news, onEdit, onDelete }: NewsTableProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  if (news.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        등록된 뉴스가 없습니다.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 text-gray-600 font-medium">제목</th>
            <th className="text-left py-3 px-4 text-gray-600 font-medium w-24">유형</th>
            <th className="text-left py-3 px-4 text-gray-600 font-medium w-28">발행일</th>
            <th className="text-right py-3 px-4 text-gray-600 font-medium w-32">관리</th>
          </tr>
        </thead>
        <tbody>
          {news.map((item) => (
            <tr
              key={item.id}
              className="border-b border-gray-800 hover:bg-gray-50/50"
            >
              <td className="py-3 px-4">
                <div className="flex items-center gap-3">
                  {item.thumbnail_url && (
                    <img
                      src={item.thumbnail_url}
                      alt=""
                      className="w-12 h-12 object-cover rounded"
                    />
                  )}
                  <div>
                    <div className="text-gray-900 font-medium">{item.title}</div>
                    {item.title_en && (
                      <div className="text-gray-500 text-xs">{item.title_en}</div>
                    )}
                  </div>
                </div>
              </td>
              <td className="py-3 px-4">
                <span className="inline-block px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded">
                  {NEWS_TYPE_LABELS[item.type]}
                </span>
              </td>
              <td className="py-3 px-4 text-gray-600">
                {formatDate(item.published_at)}
              </td>
              <td className="py-3 px-4 text-right">
                <button
                  onClick={() => onEdit(item)}
                  className="text-blue-400 hover:text-blue-300 mr-3"
                >
                  수정
                </button>
                <button
                  onClick={() => {
                    if (confirm('이 뉴스를 삭제하시겠습니까?')) {
                      onDelete(item.id);
                    }
                  }}
                  className="text-red-400 hover:text-red-300"
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
