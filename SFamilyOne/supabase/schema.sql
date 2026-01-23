
-- Tablas principales
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  display_name text,
  bio text,
  avatar_url text,
  song_url text,
  created_at timestamp with time zone default now()
);

create table if not exists posts (
  id bigint primary key generated always as identity,
  author_id uuid references profiles(id) on delete cascade,
  content text,
  media_url text,
  created_at timestamp with time zone default now()
);

create table if not exists comments (
  id bigint primary key generated always as identity,
  post_id bigint references posts(id) on delete cascade,
  author_id uuid references profiles(id) on delete cascade,
  content text,
  created_at timestamp with time zone default now()
);

create table if not exists likes (
  id bigint primary key generated always as identity,
  post_id bigint references posts(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  created_at timestamp with time zone default now(),
  unique (post_id, user_id)
);

create table if not exists follows (
  follower_id uuid references profiles(id) on delete cascade,
  following_id uuid references profiles(id) on delete cascade,
  created_at timestamp with time zone default now(),
  primary key (follower_id, following_id)
);

create table if not exists messages (
  id bigint primary key generated always as identity,
  room_id text not null,
  sender_id uuid references profiles(id) on delete cascade,
  recipient_id uuid references profiles(id) on delete cascade,
  content text,
  created_at timestamp with time zone default now()
);

-- Triggers: crear perfil al registrarse
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, new.raw_user_meta_data->>'name')
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
