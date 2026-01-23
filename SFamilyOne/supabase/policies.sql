
-- Activar RLS
alter table profiles enable row level security;
alter table posts enable row level security;
alter table comments enable row level security;
alter table likes enable row level security;
alter table follows enable row level security;
alter table messages enable row level security;

-- Profiles
create policy "Public profiles read" on profiles for select using (true);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);

-- Posts
create policy "Anyone can read posts" on posts for select using (true);
create policy "Authenticated can insert posts" on posts for insert with check (auth.uid() = author_id);
create policy "Owners can update/delete" on posts for update using (auth.uid() = author_id);
create policy "Owners can delete" on posts for delete using (auth.uid() = author_id);

-- Comments
create policy "Public read comments" on comments for select using (true);
create policy "Auth insert comments" on comments for insert with check (auth.uid() = author_id);
create policy "Owner update/delete comments" on comments for update using (auth.uid() = author_id);
create policy "Owner delete comments" on comments for delete using (auth.uid() = author_id);

-- Likes
create policy "Public read likes" on likes for select using (true);
create policy "Auth like" on likes for insert with check (auth.uid() = user_id);
create policy "Auth unlike" on likes for delete using (auth.uid() = user_id);

-- Follows
create policy "Public read follows" on follows for select using (true);
create policy "Auth follow" on follows for insert with check (auth.uid() = follower_id);
create policy "Auth unfollow" on follows for delete using (auth.uid() = follower_id);

-- Messages
create policy "Read own room messages" on messages for select using (auth.uid() = sender_id or auth.uid() = recipient_id);
create policy "Send messages" on messages for insert with check (auth.uid() = sender_id);
create policy "Delete own messages" on messages for delete using (auth.uid() = sender_id);


-- Storage (bucket: media)
-- Nota: crea bucket `media` en la UI de Supabase.
create policy if not exists "Public read media" on storage.objects for select using ( bucket_id = 'media' );
create policy if not exists "Auth upload media" on storage.objects for insert with check ( bucket_id = 'media' and auth.role() = 'authenticated' );
create policy if not exists "Owner update/delete media" on storage.objects for update using ( bucket_id = 'media' and owner = auth.uid() ) with check ( bucket_id = 'media' and owner = auth.uid() );
create policy if not exists "Owner delete media" on storage.objects for delete using ( bucket_id = 'media' and owner = auth.uid() );
