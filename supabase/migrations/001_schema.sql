create extension if not exists vector;

create table interview_sessions (
  id uuid primary key default gen_random_uuid(),
  elder_name text not null,
  started_at timestamptz default now(),
  total_minutes int default 0,
  voice_clone_id text
);

create table memory_segments (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references interview_sessions(id),
  source text not null,
  text text not null,
  audio_url text,
  topic text,
  entities jsonb,
  embedding vector(1536),
  created_at timestamptz default now()
);

create table personas (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references interview_sessions(id),
  name text not null,
  persona_document text not null,
  voice_id text,
  built_at timestamptz default now()
);

create table response_cache (
  id uuid primary key default gen_random_uuid(),
  persona_id uuid references personas(id),
  question text not null,
  response_text text not null,
  audio_url text,
  query_embedding vector(1536),
  created_at timestamptz default now()
);

create or replace function top_k_cached_responses(
  persona_id uuid,
  query_embedding vector(1536),
  k int default 3
)
returns table(id uuid, question text, response_text text, audio_url text, cosine float)
language sql as $$
  select rc.id, rc.question, rc.response_text, rc.audio_url,
         1 - (rc.query_embedding <=> query_embedding) as cosine
  from response_cache rc
  where rc.persona_id = $1
  order by cosine desc
  limit k;
$$;
