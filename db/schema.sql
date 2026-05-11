-- Grounded site schema
-- Import:  gcloud sql import sql <INSTANCE> gs://<bucket>/schema.sql --database=grounded

create extension if not exists citext;
create extension if not exists "uuid-ossp";

-- ─── Waitlist ──────────────────────────────────────────────────────────
create table if not exists waitlist (
  id           bigserial primary key,
  email        citext unique not null,
  interest     text,                                -- free text: what they want to build
  project_slug text,                                -- if they clicked from a Gallery card
  experience   text check (experience in ('beginner','maker','engineer')),
  locale       text not null default 'en' check (locale in ('en','zh')),
  referrer     text,
  user_agent   text,
  ip_hash      text,                                -- sha256 hash, not raw IP (privacy)
  invited_at   timestamptz,
  created_at   timestamptz not null default now()
);

create index if not exists waitlist_created_at_idx on waitlist(created_at);
create index if not exists waitlist_project_slug_idx on waitlist(project_slug)
  where project_slug is not null;

-- ─── Projects (Gallery source of truth) ────────────────────────────────
create table if not exists projects (
  id              uuid primary key default uuid_generate_v4(),
  slug            text unique not null,
  title           text not null,
  title_zh        text,
  category        text not null,
  category_zh     text,
  cover_image_url text,
  description     text not null,
  description_zh  text,
  difficulty      text not null check (difficulty in ('beginner','medium','advanced')),
  est_time_hours  numeric,
  est_cost_cny    numeric,
  source_repo     text,
  license         text,
  author_name     text,
  author_url      text,
  featured_order  int,                              -- null = not featured; lower = earlier
  published       boolean not null default false,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists projects_featured_idx on projects(featured_order)
  where featured_order is not null and published = true;
create index if not exists projects_difficulty_idx on projects(difficulty);

-- ─── Project components (BOM per project) ──────────────────────────────
create table if not exists project_components (
  id           bigserial primary key,
  project_id   uuid not null references projects(id) on delete cascade,
  name         text not null,
  mpn          text,                                -- manufacturer part number
  qty          int not null default 1,
  category     text,                                -- 'mcu'|'display'|'sensor'|'passive'|'mech'|'other'
  notes        text
);

create index if not exists project_components_project_idx on project_components(project_id);

-- ─── Project requirements (tools + skills gate) ────────────────────────
create table if not exists project_requirements (
  id           bigserial primary key,
  project_id   uuid not null references projects(id) on delete cascade,
  type         text not null check (type in ('tool','skill')),
  name         text not null,                       -- '3d_printer' | 'soldering_iron' | 'smt_skill'
  severity     text not null default 'required' check (severity in ('required','recommended'))
);

create index if not exists project_requirements_project_idx on project_requirements(project_id);

-- ─── Waitlist → project interest (tracking Gallery → signup flow) ──────
create table if not exists waitlist_interests (
  id            bigserial primary key,
  waitlist_id   bigint not null references waitlist(id) on delete cascade,
  project_slug  text not null,
  created_at    timestamptz not null default now(),
  unique(waitlist_id, project_slug)
);

-- ─── Housekeeping ──────────────────────────────────────────────────────
create or replace function set_updated_at() returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;

drop trigger if exists projects_set_updated_at on projects;
create trigger projects_set_updated_at before update on projects
  for each row execute function set_updated_at();
