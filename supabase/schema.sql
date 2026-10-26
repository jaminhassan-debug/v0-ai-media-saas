-- Family Wealth Intelligence content schema.
-- Content enters as 'pending_review' (agents) and is published by an editor.
-- Public site reads only status = 'published'. Writes go through server routes
-- using the service role key, so no anon write policies are created.

create table if not exists articles (
  slug text primary key,
  title text not null,
  standfirst text,
  kind text not null check (kind in ('News','Analysis','Opinion','Partner insight')),
  sector text not null,
  region text not null check (region in ('UK','Europe','US','Asia')),
  author text,
  body jsonb not null default '[]',
  premium boolean not null default false,
  sponsor text,
  firms text[] default '{}',
  source text default 'editor',            -- 'editor' | 'agent'
  source_url text,                          -- provenance for agent drafts
  status text not null default 'pending_review' check (status in ('pending_review','approved','published','rejected')),
  published_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists firms (
  slug text primary key,
  name text not null,
  type text not null,
  sectors text[] not null default '{}',
  regions text[] not null default '{}',
  city text,
  tier text not null default 'free' check (tier in ('free','featured','premium')),
  claimed boolean not null default false,
  summary text,
  website text,
  source text default 'editor',
  source_url text,
  status text not null default 'pending_review' check (status in ('pending_review','approved','published','rejected')),
  created_at timestamptz not null default now()
);

create table if not exists tracker_items (
  slug text primary key,
  region text not null,
  body text not null,
  title text not null,
  status_label text not null,
  sector text not null,
  item_date date not null,
  closes date,
  source text default 'editor',
  source_url text,
  status text not null default 'pending_review' check (status in ('pending_review','approved','published','rejected')),
  created_at timestamptz not null default now()
);

create table if not exists subscribers (
  email text primary key,
  source text,
  prefs jsonb,
  created_at timestamptz not null default now()
);

create table if not exists enquiries (
  id bigint generated always as identity primary key,
  kind text, topic text, target text,
  name text not null, email text not null, company text, message text,
  created_at timestamptz not null default now()
);

alter table articles enable row level security;
alter table firms enable row level security;
alter table tracker_items enable row level security;
alter table subscribers enable row level security;
alter table enquiries enable row level security;

create policy "public read published articles" on articles for select using (status = 'published');
create policy "public read published firms" on firms for select using (status = 'published');
create policy "public read published tracker" on tracker_items for select using (status = 'published');
-- subscribers / enquiries: no policies => only the service role can read or write.
