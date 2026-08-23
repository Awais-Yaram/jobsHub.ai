# jobsHub

A simple job listing website with referral links and click tracking.

## Stack
- Next.js
- Supabase
- Vercel

## Install
npm install

## Run locally
npm run dev

## Build
npm run build

## Required Supabase table
```sql
create table if not exists jobs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  external_url text not null,
  created_at timestamptz default now()
);

create table if not exists clicks (
  id bigint generated always as identity primary key,
  job_id uuid references jobs(id) on delete cascade,
  clicked_at timestamptz default now()
);
```

## Environment variables
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

## Vercel settings
- Root Directory: blank
- Framework: Next.js
- Build command: npm run build
- Output directory: .next
- Node.js version: 18.x or 20.x
