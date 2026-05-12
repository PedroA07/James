-- Run this in your Supabase SQL editor

-- 1. Enable pgvector extension
create extension if not exists vector;

-- 2. Notes table (stores embeddings of Obsidian notes)
create table if not exists notes (
  id          uuid primary key default gen_random_uuid(),
  path        text not null unique,   -- e.g. "projetos/NOITADA.md"
  content     text not null,
  embedding   vector(1536),           -- text-embedding-3-small dimensions
  updated_at  timestamptz default now()
);

-- 3. Index for fast cosine similarity search
create index if not exists notes_embedding_idx
  on notes using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);

-- 4. Function to search notes by similarity
create or replace function match_notes(
  query_embedding vector(1536),
  match_threshold float default 0.7,
  match_count     int default 5
)
returns table (
  path      text,
  content   text,
  similarity float
)
language sql stable
as $$
  select
    path,
    content,
    1 - (embedding <=> query_embedding) as similarity
  from notes
  where 1 - (embedding <=> query_embedding) > match_threshold
  order by embedding <=> query_embedding
  limit match_count;
$$;

-- 5. Conversations table (optional: persist chat history)
create table if not exists conversations (
  id         uuid primary key default gen_random_uuid(),
  session_id text not null,
  role       text not null check (role in ('user', 'assistant')),
  content    text not null,
  created_at timestamptz default now()
);

create index if not exists conversations_session_idx on conversations(session_id, created_at);
