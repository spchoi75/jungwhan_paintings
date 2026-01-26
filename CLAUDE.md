# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Artist portfolio website for Jungwhan (화가 정환) - a full-stack Next.js 16 application with bilingual support (Korean/English), admin CMS, and Supabase backend.

## Commands

```bash
npm run dev      # Development server at localhost:3000
npm run build    # Production build
npm start        # Run production server
npm run lint     # ESLint check
```

## Architecture

### Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Database/Storage**: Supabase (PostgreSQL + Object Storage)
- **Styling**: Tailwind CSS 4 with dark theme
- **UI**: Headless UI for accessible components
- **i18n**: Custom React Context solution (not next-intl)

### Directory Structure
```
src/
├── app/                 # Next.js App Router pages & API routes
│   ├── api/            # REST API endpoints
│   ├── admin/          # Protected admin panel
│   └── portfolio/      # Artwork gallery pages
├── components/         # React components organized by feature
│   ├── common/         # Shared: Header, Footer, Modal, etc.
│   ├── artwork/        # ArtworkCard, ArtworkModal, ZoomableImage
│   └── admin/          # Admin forms and tables
├── lib/
│   └── supabase/       # client.ts (browser), server.ts (admin API)
├── i18n/               # Localization (ko.ts, en.ts translations)
├── contexts/           # React Context providers
└── types/              # TypeScript definitions (artwork.ts)
```

### Data Flow
1. **Public pages**: SSR/ISR with client-side hydration
2. **Admin pages**: Client-side with cookie-based auth
3. **API routes**: Server-side with Supabase service role key for mutations

### Database Tables
- `portfolio` - Artworks with bilingual fields (*_en variants)
- `categories` - Artwork categories with slugs
- `about` - Artist biography (single row)
- `exhibitions` - Exhibition history

### Authentication
- Single admin password (bcrypt-hashed comparison)
- HTTP-only cookie: `admin_session`
- Middleware protects `/admin/*` routes (except `/admin/login`)

### i18n Pattern
```tsx
const { locale, t } = useLocale();
// t.navigation.home, t.footer.title, etc.
// Database fields: title/title_en, description/description_en
getLocalizedValue(locale, koValue, enValue);  // Handles fallback
```

## Key Patterns

### Path Aliases
- `@/*` maps to `./src/*` (e.g., `@/components/common/Header`)

### Image Handling
- Originals: `portfolio/originals/{uuid}.webp`
- Thumbnails: `portfolio/thumbnails/{uuid}.webp` (800px)
- ZoomableImage component for pan/zoom on artwork detail

### Component Conventions
- Feature-based organization under `components/`
- Common components reused across features
- Admin components handle their own API calls

## Environment Variables

Required in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ADMIN_PASSWORD=
```

## Documentation

See `/docs/` for detailed specifications:
- `prd.md` - Product requirements
- `architecture.md` - System design
- `wbs.md` - Development phases
- `site-management-guide.md` - Admin usage
- `supabase-schema-v2.sql` - Database schema
