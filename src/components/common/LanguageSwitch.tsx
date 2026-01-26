'use client';

import { useLocale } from '@/i18n';

export default function LanguageSwitch() {
  const { locale, setLocale } = useLocale();

  return (
    <div className="flex items-center gap-1 text-sm">
      <button
        onClick={() => setLocale('ko')}
        className={`px-2 py-1 transition-colors ${
          locale === 'ko'
            ? 'text-white font-medium'
            : 'text-gray-400 hover:text-white'
        }`}
      >
        한
      </button>
      <span className="text-gray-600">/</span>
      <button
        onClick={() => setLocale('en')}
        className={`px-2 py-1 transition-colors ${
          locale === 'en'
            ? 'text-white font-medium'
            : 'text-gray-400 hover:text-white'
        }`}
      >
        EN
      </button>
    </div>
  );
}
