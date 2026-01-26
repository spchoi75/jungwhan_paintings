'use client';

import { useState, useEffect } from 'react';
import { AboutInfo, AboutFormData, EducationItem, SocialLink } from '@/types/artwork';
import Button from '@/components/common/Button';
import ImageUploader from '@/components/admin/ImageUploader';

const SOCIAL_PLATFORMS = [
  { value: 'instagram', label: 'Instagram' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'twitter', label: 'Twitter/X' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'website', label: '웹사이트' },
  { value: 'other', label: '기타' },
] as const;

interface AboutFormProps {
  aboutInfo?: AboutInfo;
  onSubmit: (data: AboutFormData) => Promise<void>;
}

export default function AboutForm({ aboutInfo, onSubmit }: AboutFormProps) {
  const [artistName, setArtistName] = useState('');
  const [artistNameEn, setArtistNameEn] = useState('');
  const [bioParagraphs, setBioParagraphs] = useState<string[]>(['']);
  const [bioParagraphsEn, setBioParagraphsEn] = useState<string[]>(['']);
  const [education, setEducation] = useState<EducationItem[]>([]);
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [phoneVisible, setPhoneVisible] = useState(false);
  const [studioAddress, setStudioAddress] = useState('');
  const [studioAddressEn, setStudioAddressEn] = useState('');
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [footerBio, setFooterBio] = useState('');
  const [footerBioEn, setFooterBioEn] = useState('');
  const [profileImageUrl, setProfileImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (aboutInfo) {
      setArtistName(aboutInfo.artist_name || '');
      setArtistNameEn(aboutInfo.artist_name_en || '');
      setBioParagraphs(
        aboutInfo.bio_paragraphs && aboutInfo.bio_paragraphs.length > 0
          ? aboutInfo.bio_paragraphs
          : ['']
      );
      setBioParagraphsEn(
        aboutInfo.bio_paragraphs_en && aboutInfo.bio_paragraphs_en.length > 0
          ? aboutInfo.bio_paragraphs_en
          : ['']
      );
      setEducation(aboutInfo.education || []);
      setContactEmail(aboutInfo.contact_email || '');
      setContactPhone(aboutInfo.contact_phone || '');
      setPhoneVisible(aboutInfo.phone_visible || false);
      setStudioAddress(aboutInfo.studio_address || '');
      setStudioAddressEn(aboutInfo.studio_address_en || '');
      setSocialLinks(aboutInfo.social_links || []);
      setFooterBio(aboutInfo.footer_bio || '');
      setFooterBioEn(aboutInfo.footer_bio_en || '');
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

  const addBioParagraphEn = () => setBioParagraphsEn([...bioParagraphsEn, '']);
  const removeBioParagraphEn = (index: number) => {
    if (bioParagraphsEn.length > 1) {
      setBioParagraphsEn(bioParagraphsEn.filter((_, i) => i !== index));
    }
  };
  const updateBioParagraphEn = (index: number, value: string) => {
    const updated = [...bioParagraphsEn];
    updated[index] = value;
    setBioParagraphsEn(updated);
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

  const addSocialLink = () =>
    setSocialLinks([...socialLinks, { platform: 'instagram', url: '' }]);
  const removeSocialLink = (index: number) =>
    setSocialLinks(socialLinks.filter((_, i) => i !== index));
  const updateSocialLink = (
    index: number,
    field: keyof SocialLink,
    value: string
  ) => {
    const updated = [...socialLinks];
    updated[index] = { ...updated[index], [field]: value } as SocialLink;
    setSocialLinks(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await onSubmit({
        artist_name: artistName,
        artist_name_en: artistNameEn || undefined,
        bio_paragraphs: bioParagraphs.filter((p) => p.trim()),
        bio_paragraphs_en: bioParagraphsEn.filter((p) => p.trim()),
        footer_bio: footerBio || undefined,
        footer_bio_en: footerBioEn || undefined,
        education: education.filter((e) => e.year && e.description),
        contact_email: contactEmail || undefined,
        contact_phone: contactPhone || undefined,
        phone_visible: phoneVisible,
        studio_address: studioAddress || undefined,
        studio_address_en: studioAddressEn || undefined,
        social_links: socialLinks.filter((s) => s.url.trim()),
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          <label className="block text-sm font-medium mb-1 text-gray-300">
            작가명 (영문)
          </label>
          <input
            type="text"
            value={artistNameEn}
            onChange={(e) => setArtistNameEn(e.target.value)}
            className="w-full px-3 py-2 border border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-white bg-[#1a1a1a] text-white placeholder-gray-500"
            placeholder="Artist Name"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          <label className="block text-sm font-medium mb-2 text-gray-300">소개글 (영문)</label>
          {bioParagraphsEn.map((para, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <textarea
                value={para}
                onChange={(e) => updateBioParagraphEn(index, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-white resize-none bg-[#1a1a1a] text-white placeholder-gray-500"
                rows={3}
                placeholder="Enter bio paragraph in English"
              />
              {bioParagraphsEn.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeBioParagraphEn(index)}
                  className="text-red-400 hover:text-red-300 px-2"
                >
                  삭제
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addBioParagraphEn}
            className="text-sm text-blue-400 hover:text-blue-300"
          >
            + Add Paragraph
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 text-gray-300">Education</label>
        {education.map((item, index) => (
          <div key={index} className="mb-3 p-3 border border-gray-700 rounded bg-[#141414]">
            <div className="flex gap-2 mb-2">
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
                placeholder="학력 내용 (한글)"
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
            <div className="flex gap-2">
              <div className="w-24" />
              <input
                type="text"
                value={item.description_en || ''}
                onChange={(e) =>
                  updateEducation(index, 'description_en', e.target.value)
                }
                placeholder="Education (English)"
                className="flex-1 px-2 py-1 border border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-white bg-[#1a1a1a] text-white placeholder-gray-500"
              />
              <div className="px-2 w-[52px]" />
            </div>
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
        <label className="block text-sm font-medium mb-1 text-gray-300">연락처 이메일</label>
        <input
          type="email"
          value={contactEmail}
          onChange={(e) => setContactEmail(e.target.value)}
          className="w-full px-3 py-2 border border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-white bg-[#1a1a1a] text-white placeholder-gray-500"
          placeholder="email@example.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-gray-300">전화번호</label>
        <div className="flex gap-3 items-center">
          <input
            type="tel"
            value={contactPhone}
            onChange={(e) => setContactPhone(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-white bg-[#1a1a1a] text-white placeholder-gray-500"
            placeholder="010-1234-5678"
          />
          <label className="flex items-center gap-2 text-sm text-gray-300 whitespace-nowrap">
            <input
              type="checkbox"
              checked={phoneVisible}
              onChange={(e) => setPhoneVisible(e.target.checked)}
              className="w-4 h-4 rounded border-gray-600 bg-[#1a1a1a] text-blue-500 focus:ring-blue-500"
            />
            사이트에 노출
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-300">작업실 주소</label>
          <input
            type="text"
            value={studioAddress}
            onChange={(e) => setStudioAddress(e.target.value)}
            className="w-full px-3 py-2 border border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-white bg-[#1a1a1a] text-white placeholder-gray-500"
            placeholder="서울시 강남구 ..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-300">작업실 주소 (영문)</label>
          <input
            type="text"
            value={studioAddressEn}
            onChange={(e) => setStudioAddressEn(e.target.value)}
            className="w-full px-3 py-2 border border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-white bg-[#1a1a1a] text-white placeholder-gray-500"
            placeholder="Gangnam-gu, Seoul, Korea"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 text-gray-300">SNS 계정</label>
        {socialLinks.map((link, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <select
              value={link.platform}
              onChange={(e) => updateSocialLink(index, 'platform', e.target.value)}
              className="w-32 px-2 py-1 border border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-white bg-[#1a1a1a] text-white"
            >
              {SOCIAL_PLATFORMS.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
            <input
              type="url"
              value={link.url}
              onChange={(e) => updateSocialLink(index, 'url', e.target.value)}
              placeholder="https://..."
              className="flex-1 px-2 py-1 border border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-white bg-[#1a1a1a] text-white placeholder-gray-500"
            />
            {link.platform === 'other' && (
              <input
                type="text"
                value={link.label || ''}
                onChange={(e) => updateSocialLink(index, 'label', e.target.value)}
                placeholder="표시명"
                className="w-24 px-2 py-1 border border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-white bg-[#1a1a1a] text-white placeholder-gray-500"
              />
            )}
            <button
              type="button"
              onClick={() => removeSocialLink(index)}
              className="text-red-400 hover:text-red-300 px-2"
            >
              삭제
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addSocialLink}
          className="text-sm text-blue-400 hover:text-blue-300"
        >
          + SNS 추가
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-300">
            Footer 소개문
            <span className="text-gray-500 font-normal ml-2">(사이트 하단에 표시)</span>
          </label>
          <input
            type="text"
            value={footerBio}
            onChange={(e) => setFooterBio(e.target.value)}
            className="w-full px-3 py-2 border border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-white bg-[#1a1a1a] text-white placeholder-gray-500"
            placeholder="예: 한국의 자연과 인물을 담은 작품 활동을 하고 있습니다."
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-300">
            Footer 소개문 (영문)
          </label>
          <input
            type="text"
            value={footerBioEn}
            onChange={(e) => setFooterBioEn(e.target.value)}
            className="w-full px-3 py-2 border border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-white bg-[#1a1a1a] text-white placeholder-gray-500"
            placeholder="e.g. Creating artworks that capture the nature and people of Korea."
          />
        </div>
      </div>

      <div className="pt-4 border-t border-gray-700">
        <Button type="submit" loading={loading}>
          저장
        </Button>
      </div>
    </form>
  );
}
