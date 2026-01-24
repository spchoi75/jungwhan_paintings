import Header from '@/components/common/Header';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 pt-24 pb-16">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Profile Image */}
          <div className="aspect-[3/4] relative bg-gray-100">
            {/* 프로필 이미지가 없을 때 플레이스홀더 */}
            <div className="absolute inset-0 flex items-center justify-center text-gray-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            {/* 프로필 이미지가 있으면 아래 주석 해제 */}
            {/* <Image
              src="/profile.jpg"
              alt="Jungwhan"
              fill
              className="object-cover"
              priority
            /> */}
          </div>

          {/* Bio */}
          <div>
            <h1 className="text-4xl font-light tracking-wide mb-6">
              Jungwhan
            </h1>

            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                작가 소개 텍스트를 여기에 입력하세요.
              </p>
              <p>
                작업 철학, 영감의 원천, 예술적 여정 등을 기술할 수 있습니다.
              </p>
            </div>

            {/* Education / Career */}
            <div className="mt-10">
              <h3 className="text-lg font-medium mb-4">Education</h3>
              <ul className="space-y-2 text-gray-600">
                <li>2020 — 학력 정보</li>
                <li>2018 — 학력 정보</li>
              </ul>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-medium mb-4">Exhibitions</h3>
              <ul className="space-y-2 text-gray-600">
                <li>2024 — 전시 정보</li>
                <li>2023 — 전시 정보</li>
                <li>2022 — 전시 정보</li>
              </ul>
            </div>

            {/* Contact */}
            <div className="mt-10 pt-8 border-t border-gray-200">
              <h3 className="text-lg font-medium mb-4">Contact</h3>
              <p className="text-gray-600">
                email@example.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
