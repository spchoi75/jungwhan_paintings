'use client';

import { useState, useEffect } from 'react';
import {
  AboutInfo,
  AboutFormData,
  EducationItem,
  SocialLink,
  ResidencyItem,
  FellowshipItem,
  AwardItem,
  PublicationItem,
} from '@/types/artwork';
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
  // CV 출생지/거주지
  const [birthCity, setBirthCity] = useState('');
  const [birthCityEn, setBirthCityEn] = useState('');
  const [birthCountry, setBirthCountry] = useState('');
  const [birthCountryEn, setBirthCountryEn] = useState('');
  const [liveCity, setLiveCity] = useState('');
  const [liveCityEn, setLiveCityEn] = useState('');
  const [liveCountry, setLiveCountry] = useState('');
  const [liveCountryEn, setLiveCountryEn] = useState('');
  // CV 경력 섹션
  const [residencies, setResidencies] = useState<ResidencyItem[]>([]);
  const [fellowships, setFellowships] = useState<FellowshipItem[]>([]);
  const [awards, setAwards] = useState<AwardItem[]>([]);
  const [publications, setPublications] = useState<PublicationItem[]>([]);
  // 연락처
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
      // CV 출생지/거주지
      setBirthCity(aboutInfo.birth_city || '');
      setBirthCityEn(aboutInfo.birth_city_en || '');
      setBirthCountry(aboutInfo.birth_country || '');
      setBirthCountryEn(aboutInfo.birth_country_en || '');
      setLiveCity(aboutInfo.live_city || '');
      setLiveCityEn(aboutInfo.live_city_en || '');
      setLiveCountry(aboutInfo.live_country || '');
      setLiveCountryEn(aboutInfo.live_country_en || '');
      // CV 경력 섹션
      setResidencies(aboutInfo.residencies || []);
      setFellowships(aboutInfo.fellowships || []);
      setAwards(aboutInfo.awards || []);
      setPublications(aboutInfo.publications || []);
      // 연락처
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

  // Residencies CRUD
  const addResidency = () =>
    setResidencies([...residencies, { year: '', program: '', location: '' }]);
  const removeResidency = (index: number) =>
    setResidencies(residencies.filter((_, i) => i !== index));
  const updateResidency = (index: number, field: keyof ResidencyItem, value: string) => {
    const updated = [...residencies];
    updated[index] = { ...updated[index], [field]: value };
    setResidencies(updated);
  };

  // Fellowships CRUD
  const addFellowship = () =>
    setFellowships([...fellowships, { year: '', name: '' }]);
  const removeFellowship = (index: number) =>
    setFellowships(fellowships.filter((_, i) => i !== index));
  const updateFellowship = (index: number, field: keyof FellowshipItem, value: string) => {
    const updated = [...fellowships];
    updated[index] = { ...updated[index], [field]: value };
    setFellowships(updated);
  };

  // Awards CRUD
  const addAward = () =>
    setAwards([...awards, { year: '', name: '' }]);
  const removeAward = (index: number) =>
    setAwards(awards.filter((_, i) => i !== index));
  const updateAward = (index: number, field: keyof AwardItem, value: string) => {
    const updated = [...awards];
    updated[index] = { ...updated[index], [field]: value };
    setAwards(updated);
  };

  // Publications CRUD
  const addPublication = () =>
    setPublications([...publications, { year: '', title: '' }]);
  const removePublication = (index: number) =>
    setPublications(publications.filter((_, i) => i !== index));
  const updatePublication = (index: number, field: keyof PublicationItem, value: string) => {
    const updated = [...publications];
    updated[index] = { ...updated[index], [field]: value };
    setPublications(updated);
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
        // CV 출생지/거주지
        birth_city: birthCity || undefined,
        birth_city_en: birthCityEn || undefined,
        birth_country: birthCountry || undefined,
        birth_country_en: birthCountryEn || undefined,
        live_city: liveCity || undefined,
        live_city_en: liveCityEn || undefined,
        live_country: liveCountry || undefined,
        live_country_en: liveCountryEn || undefined,
        // CV 경력 섹션
        residencies: residencies.filter((r) => r.year && r.program),
        fellowships: fellowships.filter((f) => f.year && f.name),
        awards: awards.filter((a) => a.year && a.name),
        publications: publications.filter((p) => p.year && p.title),
        // 연락처
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
        <label className="block text-sm font-medium mb-2 text-gray-700">프로필 이미지</label>
        <ImageUploader
          onUpload={(url) => setProfileImageUrl(url)}
          currentImage={profileImageUrl}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">
            작가명 <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={artistName}
            onChange={(e) => setArtistName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white text-gray-900 placeholder-gray-400"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">
            작가명 (영문)
          </label>
          <input
            type="text"
            value={artistNameEn}
            onChange={(e) => setArtistNameEn(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white text-gray-900 placeholder-gray-400"
            placeholder="Artist Name"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">소개글</label>
          {bioParagraphs.map((para, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <textarea
                value={para}
                onChange={(e) => updateBioParagraph(index, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 resize-none bg-white text-gray-900 placeholder-gray-400"
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
          <label className="block text-sm font-medium mb-2 text-gray-700">소개글 (영문)</label>
          {bioParagraphsEn.map((para, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <textarea
                value={para}
                onChange={(e) => updateBioParagraphEn(index, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 resize-none bg-white text-gray-900 placeholder-gray-400"
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
        <label className="block text-sm font-medium mb-2 text-gray-700">Education</label>
        {education.map((item, index) => (
          <div key={index} className="mb-3 p-3 border border-gray-200 rounded bg-[#141414]">
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={item.year}
                onChange={(e) => updateEducation(index, 'year', e.target.value)}
                placeholder="연도"
                className="w-24 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white text-gray-900 placeholder-gray-400"
              />
              <input
                type="text"
                value={item.description}
                onChange={(e) =>
                  updateEducation(index, 'description', e.target.value)
                }
                placeholder="학력 내용 (한글)"
                className="flex-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white text-gray-900 placeholder-gray-400"
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
                className="flex-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white text-gray-900 placeholder-gray-400"
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

      {/* CV 출생지/거주지 */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-medium text-gray-200 mb-4">CV 정보</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">출생 도시</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={birthCity}
                onChange={(e) => setBirthCity(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white text-gray-900 placeholder-gray-400"
                placeholder="서울"
              />
              <input
                type="text"
                value={birthCityEn}
                onChange={(e) => setBirthCityEn(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white text-gray-900 placeholder-gray-400"
                placeholder="Seoul"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">출생 국가</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={birthCountry}
                onChange={(e) => setBirthCountry(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white text-gray-900 placeholder-gray-400"
                placeholder="대한민국"
              />
              <input
                type="text"
                value={birthCountryEn}
                onChange={(e) => setBirthCountryEn(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white text-gray-900 placeholder-gray-400"
                placeholder="South Korea"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">거주 도시</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={liveCity}
                onChange={(e) => setLiveCity(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white text-gray-900 placeholder-gray-400"
                placeholder="서울"
              />
              <input
                type="text"
                value={liveCityEn}
                onChange={(e) => setLiveCityEn(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white text-gray-900 placeholder-gray-400"
                placeholder="Seoul"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">거주 국가</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={liveCountry}
                onChange={(e) => setLiveCountry(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white text-gray-900 placeholder-gray-400"
                placeholder="대한민국"
              />
              <input
                type="text"
                value={liveCountryEn}
                onChange={(e) => setLiveCountryEn(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white text-gray-900 placeholder-gray-400"
                placeholder="South Korea"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Residencies */}
      <div>
        <label className="block text-sm font-medium mb-2 text-gray-700">Residency</label>
        {residencies.map((item, index) => (
          <div key={index} className="mb-3 p-3 border border-gray-200 rounded bg-[#141414]">
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={item.year}
                onChange={(e) => updateResidency(index, 'year', e.target.value)}
                placeholder="연도"
                className="w-24 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white text-gray-900 placeholder-gray-400"
              />
              <input
                type="text"
                value={item.program}
                onChange={(e) => updateResidency(index, 'program', e.target.value)}
                placeholder="프로그램명"
                className="flex-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white text-gray-900 placeholder-gray-400"
              />
              <button
                type="button"
                onClick={() => removeResidency(index)}
                className="text-red-400 hover:text-red-300 px-2"
              >
                삭제
              </button>
            </div>
            <div className="flex gap-2 mb-2">
              <div className="w-24" />
              <input
                type="text"
                value={item.program_en || ''}
                onChange={(e) => updateResidency(index, 'program_en', e.target.value)}
                placeholder="Program Name (English)"
                className="flex-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white text-gray-900 placeholder-gray-400"
              />
              <div className="px-2 w-[52px]" />
            </div>
            <div className="flex gap-2">
              <div className="w-24" />
              <input
                type="text"
                value={item.location}
                onChange={(e) => updateResidency(index, 'location', e.target.value)}
                placeholder="장소 (한글)"
                className="flex-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white text-gray-900 placeholder-gray-400"
              />
              <input
                type="text"
                value={item.location_en || ''}
                onChange={(e) => updateResidency(index, 'location_en', e.target.value)}
                placeholder="Location (English)"
                className="flex-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white text-gray-900 placeholder-gray-400"
              />
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={addResidency}
          className="text-sm text-blue-400 hover:text-blue-300"
        >
          + 레지던시 추가
        </button>
      </div>

      {/* Fellowships */}
      <div>
        <label className="block text-sm font-medium mb-2 text-gray-700">Fellowships</label>
        {fellowships.map((item, index) => (
          <div key={index} className="mb-3 p-3 border border-gray-200 rounded bg-[#141414]">
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={item.year}
                onChange={(e) => updateFellowship(index, 'year', e.target.value)}
                placeholder="연도"
                className="w-24 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white text-gray-900 placeholder-gray-400"
              />
              <input
                type="text"
                value={item.name}
                onChange={(e) => updateFellowship(index, 'name', e.target.value)}
                placeholder="펠로우십명"
                className="flex-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white text-gray-900 placeholder-gray-400"
              />
              <button
                type="button"
                onClick={() => removeFellowship(index)}
                className="text-red-400 hover:text-red-300 px-2"
              >
                삭제
              </button>
            </div>
            <div className="flex gap-2">
              <div className="w-24" />
              <input
                type="text"
                value={item.name_en || ''}
                onChange={(e) => updateFellowship(index, 'name_en', e.target.value)}
                placeholder="Fellowship Name (English)"
                className="flex-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white text-gray-900 placeholder-gray-400"
              />
              <div className="px-2 w-[52px]" />
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={addFellowship}
          className="text-sm text-blue-400 hover:text-blue-300"
        >
          + 펠로우십 추가
        </button>
      </div>

      {/* Awards */}
      <div>
        <label className="block text-sm font-medium mb-2 text-gray-700">Awards</label>
        {awards.map((item, index) => (
          <div key={index} className="mb-3 p-3 border border-gray-200 rounded bg-[#141414]">
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={item.year}
                onChange={(e) => updateAward(index, 'year', e.target.value)}
                placeholder="연도"
                className="w-24 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white text-gray-900 placeholder-gray-400"
              />
              <input
                type="text"
                value={item.name}
                onChange={(e) => updateAward(index, 'name', e.target.value)}
                placeholder="수상명"
                className="flex-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white text-gray-900 placeholder-gray-400"
              />
              <button
                type="button"
                onClick={() => removeAward(index)}
                className="text-red-400 hover:text-red-300 px-2"
              >
                삭제
              </button>
            </div>
            <div className="flex gap-2">
              <div className="w-24" />
              <input
                type="text"
                value={item.name_en || ''}
                onChange={(e) => updateAward(index, 'name_en', e.target.value)}
                placeholder="Award Name (English)"
                className="flex-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white text-gray-900 placeholder-gray-400"
              />
              <div className="px-2 w-[52px]" />
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={addAward}
          className="text-sm text-blue-400 hover:text-blue-300"
        >
          + 수상 추가
        </button>
      </div>

      {/* Publications */}
      <div>
        <label className="block text-sm font-medium mb-2 text-gray-700">Publications</label>
        {publications.map((item, index) => (
          <div key={index} className="mb-3 p-3 border border-gray-200 rounded bg-[#141414]">
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={item.year}
                onChange={(e) => updatePublication(index, 'year', e.target.value)}
                placeholder="연도"
                className="w-24 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white text-gray-900 placeholder-gray-400"
              />
              <input
                type="text"
                value={item.title}
                onChange={(e) => updatePublication(index, 'title', e.target.value)}
                placeholder="출판물 제목"
                className="flex-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white text-gray-900 placeholder-gray-400"
              />
              <button
                type="button"
                onClick={() => removePublication(index)}
                className="text-red-400 hover:text-red-300 px-2"
              >
                삭제
              </button>
            </div>
            <div className="flex gap-2">
              <div className="w-24" />
              <input
                type="text"
                value={item.title_en || ''}
                onChange={(e) => updatePublication(index, 'title_en', e.target.value)}
                placeholder="Publication Title (English)"
                className="flex-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white text-gray-900 placeholder-gray-400"
              />
              <div className="px-2 w-[52px]" />
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={addPublication}
          className="text-sm text-blue-400 hover:text-blue-300"
        >
          + 출판물 추가
        </button>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-medium text-gray-200 mb-4">연락처 정보</h3>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700">연락처 이메일</label>
        <input
          type="email"
          value={contactEmail}
          onChange={(e) => setContactEmail(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white text-gray-900 placeholder-gray-400"
          placeholder="email@example.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700">전화번호</label>
        <div className="flex gap-3 items-center">
          <input
            type="tel"
            value={contactPhone}
            onChange={(e) => setContactPhone(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white text-gray-900 placeholder-gray-400"
            placeholder="010-1234-5678"
          />
          <label className="flex items-center gap-2 text-sm text-gray-700 whitespace-nowrap">
            <input
              type="checkbox"
              checked={phoneVisible}
              onChange={(e) => setPhoneVisible(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 bg-white text-blue-500 focus:ring-blue-500"
            />
            사이트에 노출
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">작업실 주소</label>
          <input
            type="text"
            value={studioAddress}
            onChange={(e) => setStudioAddress(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white text-gray-900 placeholder-gray-400"
            placeholder="서울시 강남구 ..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">작업실 주소 (영문)</label>
          <input
            type="text"
            value={studioAddressEn}
            onChange={(e) => setStudioAddressEn(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white text-gray-900 placeholder-gray-400"
            placeholder="Gangnam-gu, Seoul, Korea"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 text-gray-700">SNS 계정</label>
        {socialLinks.map((link, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <select
              value={link.platform}
              onChange={(e) => updateSocialLink(index, 'platform', e.target.value)}
              className="w-32 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white text-gray-900"
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
              className="flex-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white text-gray-900 placeholder-gray-400"
            />
            {link.platform === 'other' && (
              <input
                type="text"
                value={link.label || ''}
                onChange={(e) => updateSocialLink(index, 'label', e.target.value)}
                placeholder="표시명"
                className="w-24 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white text-gray-900 placeholder-gray-400"
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
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Footer 소개문
            <span className="text-gray-500 font-normal ml-2">(사이트 하단에 표시)</span>
          </label>
          <input
            type="text"
            value={footerBio}
            onChange={(e) => setFooterBio(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white text-gray-900 placeholder-gray-400"
            placeholder="예: 한국의 자연과 인물을 담은 작품 활동을 하고 있습니다."
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Footer 소개문 (영문)
          </label>
          <input
            type="text"
            value={footerBioEn}
            onChange={(e) => setFooterBioEn(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white text-gray-900 placeholder-gray-400"
            placeholder="e.g. Creating artworks that capture the nature and people of Korea."
          />
        </div>
      </div>

      <div className="pt-4 border-t border-gray-200">
        <Button type="submit" loading={loading}>
          저장
        </Button>
      </div>
    </form>
  );
}
