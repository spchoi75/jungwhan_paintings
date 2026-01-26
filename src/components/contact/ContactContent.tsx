'use client';

import { useLocale } from '@/i18n';

interface ContactContentProps {
  contactEmail: string | null;
}

export default function ContactContent({ contactEmail }: ContactContentProps) {
  const { t } = useLocale();

  return (
    <>
      <h1 className="text-3xl font-light tracking-wide mb-12 text-white">
        {t.contact.title}
      </h1>

      <div className="space-y-8">
        {/* Email */}
        <div>
          <h2 className="text-sm text-gray-400 uppercase tracking-wider mb-2">
            {t.contact.email}
          </h2>
          {contactEmail ? (
            <a
              href={`mailto:${contactEmail}`}
              className="text-lg text-white hover:text-gray-300 transition-colors"
            >
              {contactEmail}
            </a>
          ) : (
            <p className="text-gray-500">{t.contact.noContact}</p>
          )}
        </div>

        {/* Inquiry notice */}
        <div className="pt-8 border-t border-gray-700">
          <p className="text-gray-400 text-sm leading-relaxed">
            {t.contact.inquiryNotice}
          </p>
        </div>
      </div>
    </>
  );
}
