Jobshub — Minimal Next.js + Supabase project

Overview
- Next.js frontend for listing job/referral posts
- Admin UI (protected by Supabase Auth) to add/edit jobs
- Redirect endpoint (/r/[id]) that logs clicks to Supabase and redirects to the referral URL

Stack
- Next.js
- Supabase (Postgres + Auth)
- Vercel for deployment (recommended)

What you (owner) must do before deploying
1) Create a Supabase project (https://app.supabase.com)
2) Run this SQL in Supabase SQL editor to create tables:

-- jobs table
create table if not exists jobs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  external_url text not null,
  created_at timestamptz default now()
);

-- clicks table
create table if not exists clicks (
  id bigint generated always as identity primary key,
  job_id uuid references jobs(id) on delete cascade,
  clicked_at timestamptz default now()
);

3) In Supabase Project Settings > API copy the PROJECT URL and ANON KEY and SERVICE ROLE KEY
4) In Vercel project or local .env, set these env vars:

NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>

Local development
- npm install
- npm run dev

Deployment
1) Create a GitHub repo and push this project
2) In Vercel connect the GitHub repo and set the same env vars in Vercel dashboard
3) Deploy

Notes
- Service Role Key must be kept secret. Only set it in Vercel environment variables (not in client-side code).
- After deployment, your public site will be accessible and /r/:id redirects will log clicks in Supabase.
