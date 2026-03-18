create extension if not exists "pgcrypto";

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  name text,
  created_at timestamptz not null default now()
);

create table if not exists startup_ideas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete set null,
  idea_title text not null,
  target_market text not null,
  problem_description text not null,
  customer_segment text not null,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

create table if not exists reports (
  id uuid primary key default gen_random_uuid(),
  idea_id uuid not null references startup_ideas(id) on delete cascade,
  viability_score integer check (viability_score between 0 and 100),
  summary text,
  report_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete set null,
  idea_id uuid references startup_ideas(id) on delete set null,
  email text not null,
  created_at timestamptz not null default now(),
  downloaded_at timestamptz
);

create index if not exists idx_startup_ideas_user_id on startup_ideas(user_id);
create index if not exists idx_reports_idea_id on reports(idea_id);
create index if not exists idx_leads_email on leads(email);
