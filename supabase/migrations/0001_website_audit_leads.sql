-- Lead-capture table for the website-auditor lead magnet on /for-businesses.
-- Mirrors the existing "anon RLS wide open" pattern used by the other public
-- forms: the public site inserts directly via PostgREST with the anon key.
--
-- Run once in the Supabase SQL editor (or via the Supabase MCP / CLI).

create table if not exists public.website_audit_leads (
  id            bigint generated always as identity primary key,
  email         text not null,
  website_url   text not null,
  business_name text,
  overall_score integer,
  scores        jsonb,           -- per-category scores snapshot at capture time
  source        text default 'for_businesses_auditor',
  created_at    timestamptz default now()
);

alter table public.website_audit_leads enable row level security;

-- Allow anonymous inserts only (lead capture from the public marketing site).
-- No select/update/delete for anon, so leads can be written but not read back.
drop policy if exists "anon insert website_audit_leads" on public.website_audit_leads;
create policy "anon insert website_audit_leads"
  on public.website_audit_leads
  for insert
  to anon
  with check (true);

grant insert on table public.website_audit_leads to anon;
