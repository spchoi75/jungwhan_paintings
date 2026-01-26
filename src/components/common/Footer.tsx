'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { AboutInfo, SocialLink } from '@/types/artwork';

const SOCIAL_ICONS: Record<SocialLink['platform'], { icon: JSX.Element; label: string }> = {
  instagram: {
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    ),
    label: 'Instagram',
  },
  facebook: {
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
    label: 'Facebook',
  },
  twitter: {
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
    label: 'X',
  },
  youtube: {
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
    label: 'YouTube',
  },
  website: {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/>
      </svg>
    ),
    label: '웹사이트',
  },
  other: {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
      </svg>
    ),
    label: '링크',
  },
};

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [aboutInfo, setAboutInfo] = useState<AboutInfo | null>(null);

  useEffect(() => {
    fetch('/api/about')
      .then((res) => res.json())
      .then((data) => setAboutInfo(data))
      .catch(() => {});
  }, []);

  return (
    <footer className="bg-[#0a0a0a] border-t border-gray-800">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Artist info */}
          <div>
            <h3
              className="text-xl text-white mb-4"
              style={{ fontFamily: 'var(--font-noto-serif), serif' }}
            >
              {aboutInfo?.artist_name || '정환'}
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              {aboutInfo?.footer_bio || '한국의 자연과 인물을 담은 작품 활동을 하고 있습니다.'}
            </p>
          </div>

          {/* Contact & Social */}
          <div>
            <h4 className="text-white text-sm font-medium mb-4 tracking-wide">
              연락처
            </h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              {aboutInfo?.contact_email && (
                <li>
                  <a
                    href={`mailto:${aboutInfo.contact_email}`}
                    className="hover:text-white transition-colors"
                  >
                    {aboutInfo.contact_email}
                  </a>
                </li>
              )}
              {aboutInfo?.phone_visible && aboutInfo?.contact_phone && (
                <li>
                  <a
                    href={`tel:${aboutInfo.contact_phone.replace(/-/g, '')}`}
                    className="hover:text-white transition-colors"
                  >
                    {aboutInfo.contact_phone}
                  </a>
                </li>
              )}
            </ul>

            {/* Social Links */}
            {aboutInfo?.social_links && aboutInfo.social_links.length > 0 && (
              <div className="mt-4">
                <div className="flex gap-3">
                  {aboutInfo.social_links.map((link, index) => {
                    const socialInfo = SOCIAL_ICONS[link.platform];
                    return (
                      <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-white transition-colors"
                        title={link.label || socialInfo.label}
                      >
                        {socialInfo.icon}
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Copyright notice */}
        <div className="pt-8 border-t border-gray-800">
          <div className="text-center space-y-3">
            <p className="text-gray-500 text-xs">
              &copy; {currentYear} {aboutInfo?.artist_name || '정환'}. All rights reserved.
            </p>
            <p className="text-gray-600 text-xs leading-relaxed max-w-2xl mx-auto">
              본 웹사이트에 게시된 모든 작품 이미지의 저작권은 작가 {aboutInfo?.artist_name || '정환'}에게 있습니다.
              작품의 무단 복제, 배포, 수정 및 상업적 이용을 금지합니다.
              작품 사용에 관한 문의는 이메일로 연락 바랍니다.
            </p>
            <p className="pt-2">
              <Link
                href="/sitemap.xml"
                className="text-gray-600 text-xs hover:text-gray-400 transition-colors"
              >
                Sitemap
              </Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
