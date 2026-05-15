# AIDhd

Voice-first second brain for ADHD, powered by Claude.

## Stack

- Next.js 15 (App Router, TypeScript)
- Tailwind CSS 4
- Supabase (Postgres)
- Anthropic SDK (Claude Sonnet)
- Web Speech API for voice input

## Commands

- `npm run dev` — start dev server
- `npm run build` — production build
- `npm run lint` — run ESLint

## Project Structure

- `src/app/` — pages and API routes (App Router)
- `src/components/` — React components
- `src/hooks/` — custom React hooks
- `src/lib/` — server-side utilities (Supabase, Claude, offline queue)
- `src/types/` — TypeScript types
- `supabase/migrations/` — SQL migrations for Supabase

## Conventions

- All components are client components (`'use client'`) unless purely presentational
- API routes use Next.js Route Handlers (`route.ts`)
- Supabase client: use `createServerClient()` from `@/lib/supabase/server` in API routes
- Claude calls are server-side only — API key never exposed to client
- Offline captures go to IndexedDB first, then sync to Supabase
- ADHD UX: large tap targets (64px+), minimal decisions, calming colours, encouraging tone
