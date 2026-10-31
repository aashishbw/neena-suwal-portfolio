create table if not exists public.admin_users (user_id uuid primary key references auth.users(id) on delete cascade);
create table if not exists public.site_content (id text primary key, content jsonb not null default '{}'::jsonb, updated_at timestamptz not null default now());
insert into public.site_content(id,content) values('neena','{}'::jsonb) on conflict(id) do nothing;
alter table public.admin_users enable row level security;
alter table public.site_content enable row level security;
create policy "Approved editors read own record" on public.admin_users for select to authenticated using (user_id = auth.uid());
create policy "Anyone reads published site" on public.site_content for select to anon,authenticated using (id='neena');
create policy "Approved editors update site" on public.site_content for update to authenticated using (id='neena' and exists(select 1 from public.admin_users where user_id=auth.uid())) with check (id='neena' and exists(select 1 from public.admin_users where user_id=auth.uid()));
