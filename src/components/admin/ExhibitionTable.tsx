'use client';

import { Exhibition } from '@/types/artwork';

interface ExhibitionTableProps {
  exhibitions: Exhibition[];
  onEdit: (exhibition: Exhibition) => void;
  onDelete: (exhibition: Exhibition) => void;
}

export default function ExhibitionTable({
  exhibitions,
  onEdit,
  onDelete,
}: ExhibitionTableProps) {
  if (exhibitions.length === 0) {
    return (
      <div className="text-center py-12 bg-[#141414] rounded-lg border border-gray-700">
        <p className="text-gray-400">등록된 전시가 없습니다</p>
      </div>
    );
  }

  const soloExhibitions = exhibitions.filter((e) => e.type === 'solo');
  const groupExhibitions = exhibitions.filter((e) => e.type === 'group');

  const renderTable = (items: Exhibition[], title: string) => (
    <div className="mb-8">
      <h3 className="text-sm font-medium text-gray-400 mb-3">{title}</h3>
      <div className="bg-[#141414] rounded-lg border border-gray-700 overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#1a1a1a]">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                연도
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                전시명
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                장소
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase">
                관리
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {items.map((exhibition) => (
              <tr key={exhibition.id} className="hover:bg-gray-800">
                <td className="px-4 py-3 text-sm text-gray-300">{exhibition.year}</td>
                <td className="px-4 py-3 text-sm text-white">
                  {exhibition.external_url ? (
                    <a
                      href={exhibition.external_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:underline"
                    >
                      {exhibition.title}
                    </a>
                  ) : (
                    exhibition.title
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-gray-400">
                  {exhibition.venue}
                  {exhibition.location && `, ${exhibition.location}`}
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => onEdit(exhibition)}
                    className="text-gray-400 hover:text-white text-sm mr-3"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => onDelete(exhibition)}
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
    </div>
  );

  return (
    <div>
      {soloExhibitions.length > 0 && renderTable(soloExhibitions, '개인전')}
      {groupExhibitions.length > 0 && renderTable(groupExhibitions, '그룹전')}
    </div>
  );
}
