# AIDhd

Voice-first second brain for ADHD, powered by Claude.

Capture thoughts by voice or text. Claude categorises them, extracts tasks, and generates a prioritised daily plan. Nothing gets lost.

## Quick Start

### Prerequisites

- Node.js 22+
- [Supabase](https://supabase.com) account (free tier)
- [Anthropic API key](https://console.anthropic.com)

### Setup

1. Clone and install:
   ```bash
   git clone https://github.com/Data-Tamers-Ltd/aidhd.git
   cd aidhd
   npm install
   ```

2. Create your Supabase project, then run the migration in the SQL Editor:
   ```
   supabase/migrations/001_initial_schema.sql
   ```

3. Copy `.env.example` to `.env.local` and fill in your keys:
   ```bash
   cp .env.example .env.local
   ```

4. Start the dev server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000)

## Features

- **Voice capture** — tap to speak, Claude categorises and extracts tasks
- **Daily plan** — AI-generated prioritised to-do list (max 7 items)
- **Thought stream** — chronological log of everything captured
- **Offline support** — captures saved locally when offline, synced when back
- **PWA** — installable on phone home screen

## Tech Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS 4
- Supabase (Postgres)
- Claude Sonnet (Anthropic SDK)
- Web Speech API

## License

MIT
