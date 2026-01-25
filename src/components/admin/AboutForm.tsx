'use client';

import { useState, useEffect } from 'react';
import { AboutInfo, AboutFormData, EducationItem, ExhibitionItem } from '@/types/artwork';
import Button from '@/components/common/Button';
import ImageUploader from '@/components/admin/ImageUploader';

interface AboutFormProps {
  aboutInfo?: AboutInfo;
  onSubmit: (data: AboutFormData) => Promise<void>;
}

export default function AboutForm({ aboutInfo, onSubmit }: AboutFormProps) {
  const [artistName, setArtistName] = useState('');
  const [bioParagraphs, setBioParagraphs] = useState<string[]>(['']);
  const [education, setEducation] = useState<EducationItem[]>([]);
  const [exhibitions, setExhibitions] = useState<ExhibitionItem[]>([]);
  const [contactEmail, setContactEmail] = useState('');
  const [profileImageUrl, setProfileImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (aboutInfo) {
      setArtistName(aboutInfo.artist_name || '');
      setBioParagraphs(
        aboutInfo.bio_paragraphs && aboutInfo.bio_paragraphs.length > 0
          ? aboutInfo.bio_paragraphs
          : ['']
      );
      setEducation(aboutInfo.education || []);
      setExhibitions(aboutInfo.exhibitions || []);
      setContactEmail(aboutInfo.contact_email || '');
      setProfileImageUrl(aboutInfo.profile_image_url || '');
    }
  }, [aboutInfo]);

  const addBioParagraph = () => setBioParagraphs([...bioParagraphs, '']);
  const removeBioParagraph = (index: number) => {
    if (bioParagraphs.length > 1) {
      setBioParagraphs(bioParagraphs.filter((_, i) => i !== index));
    }
  };
  const updateBioParagraph = (index: number, value: string) => {
    const updated = [...bioParagraphs];
    updated[index] = value;
    setBioParagraphs(updated);
  };

  const addEducation = () =>
    setEducation([...education, { year: '', description: '' }]);
  const removeEducation = (index: number) =>
    setEducation(education.filter((_, i) => i !== index));
  const updateEducation = (
    index: number,
    field: keyof EducationItem,
    value: string
  ) => {
    const updated = [...education];
    updated[index] = { ...updated[index], [field]: value };
    setEducation(updated);
  };

  const addExhibition = () =>
    setExhibitions([...exhibitions, { year: '', description: '' }]);
  const removeExhibition = (index: number) =>
    setExhibitions(exhibitions.filter((_, i) => i !== index));
  const updateExhibition = (
    index: number,
    field: keyof ExhibitionItem,
    value: string
  ) => {
    const updated = [...exhibitions];
    updated[index] = { ...updated[index], [field]: value };
    setExhibitions(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await onSubmit({
        artist_name: artistName,
        bio_paragraphs: bioParagraphs.filter((p) => p.trim()),
        education: education.filter((e) => e.year && e.description),
        exhibitions: exhibitions.filter((e) => e.year && e.description),
        contact_email: contactEmail || undefined,
        profile_image_url: profileImageUrl || undefined,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : '저장 실패');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {error && (
        <div className="p-3 bg-red-900/30 text-red-400 text-sm rounded">{error}</div>
      )}

      <div>
        <label className="block text-sm font-medium mb-2 text-gray-300">프로필 이미지</label>
        <ImageUploader
          onUpload={(url) => setProfileImageUrl(url)}
          currentImage={profileImageUrl}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-gray-300">
          작가명 <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          value={artistName}
          onChange={(e) => setArtistName(e.target.value)}
          className="w-full px-3 py-2 border border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-white bg-[#1a1a1a] text-white placeholder-gray-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 text-gray-300">소개글</label>
        {bioParagraphs.map((para, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <textarea
              value={para}
              onChange={(e) => updateBioParagraph(index, e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-white resize-none bg-[#1a1a1a] text-white placeholder-gray-500"
              rows={3}
              placeholder="소개글 문단을 입력하세요"
            />
            {bioParagraphs.length > 1 && (
              <button
                type="button"
                onClick={() => removeBioParagraph(index)}
                className="text-red-400 hover:text-red-300 px-2"
              >
                삭제
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addBioParagraph}
          className="text-sm text-blue-400 hover:text-blue-300"
        >
          + 문단 추가
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 text-gray-300">Education</label>
        {education.map((item, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              type="text"
              value={item.year}
              onChange={(e) => updateEducation(index, 'year', e.target.value)}
              placeholder="연도"
              className="w-24 px-2 py-1 border border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-white bg-[#1a1a1a] text-white placeholder-gray-500"
            />
            <input
              type="text"
              value={item.description}
              onChange={(e) =>
                updateEducation(index, 'description', e.target.value)
              }
              placeholder="학력 내용"
              className="flex-1 px-2 py-1 border border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-white bg-[#1a1a1a] text-white placeholder-gray-500"
            />
            <button
              type="button"
              onClick={() => removeEducation(index)}
              className="text-red-400 hover:text-red-300 px-2"
            >
              삭제
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addEducation}
          className="text-sm text-blue-400 hover:text-blue-300"
        >
          + 학력 추가
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 text-gray-300">Exhibitions</label>
        {exhibitions.map((item, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              type="text"
              value={item.year}
              onChange={(e) => updateExhibition(index, 'year', e.target.value)}
              placeholder="연도"
              className="w-24 px-2 py-1 border border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-white bg-[#1a1a1a] text-white placeholder-gray-500"
            />
            <input
              type="text"
              value={item.description}
              onChange={(e) =>
                updateExhibition(index, 'description', e.target.value)
              }
              placeholder="전시 정보"
              className="flex-1 px-2 py-1 border border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-white bg-[#1a1a1a] text-white placeholder-gray-500"
            />
            <button
              type="button"
              onClick={() => removeExhibition(index)}
              className="text-red-400 hover:text-red-300 px-2"
            >
              삭제
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addExhibition}
          className="text-sm text-blue-400 hover:text-blue-300"
        >
          + 전시 추가
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-gray-300">연락처 이메일</label>
        <input
          type="email"
          value={contactEmail}
          onChange={(e) => setContactEmail(e.target.value)}
          className="w-full px-3 py-2 border border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-white bg-[#1a1a1a] text-white placeholder-gray-500"
          placeholder="email@example.com"
        />
      </div>

      <div className="pt-4 border-t border-gray-700">
        <Button type="submit" loading={loading}>
          저장
        </Button>
      </div>
    </form>
  );
}
