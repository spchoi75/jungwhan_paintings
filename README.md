This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## 환경변수 설정

`.env.local` 파일을 생성하고 아래 환경변수를 설정하세요:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Admin
ADMIN_PASSWORD=your_admin_password

# Contact Form (이메일 발송)
RESEND_API_KEY=re_xxxxxxxxxxxx
CONTACT_TO_EMAIL=artist@example.com
```

### Contact 폼 이메일 설정 (Resend)

웹사이트의 Contact 페이지에서 방문자가 문의 메일을 보낼 수 있습니다. 이를 위해 [Resend](https://resend.com) 서비스를 사용합니다.

**설정 방법:**

1. [Resend](https://resend.com)에 가입
2. Dashboard → API Keys → Create API Key
3. Permission: **Sending access** 선택 (Full access 불필요)
4. 생성된 키를 `.env.local`의 `RESEND_API_KEY`에 입력
5. `CONTACT_TO_EMAIL`에 문의 메일을 받을 이메일 주소 입력

**API 키 교체 방법:**

다른 Resend 계정으로 변경하려면:
1. 새 계정에서 API Key 발급 (Sending access)
2. `.env.local` 파일의 `RESEND_API_KEY` 값만 교체
3. 서버 재시작 (`npm run dev` 재실행)

> 참고: 무료 플랜에서는 `onboarding@resend.dev`에서 발송됩니다. 커스텀 도메인 사용 시 Resend에서 도메인 인증 후 `src/app/api/contact/route.ts`의 `from` 필드를 수정하세요.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
테스트 중에는 Resend 가입 이메일로만 수신 가능
나중에 실제 운영 시: Resend에서 도메인 인증 → 아무 이메일로나 발송 가능