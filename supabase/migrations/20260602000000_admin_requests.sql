-- Create admin requests table to handle approval requests
create table if not exists public.admin_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null unique,
  email text not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable RLS
alter table public.admin_requests enable row level security;

-- Policies
create policy "Users can view own admin requests"
on public.admin_requests for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can submit own admin request"
on public.admin_requests for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Admins can manage all admin requests"
on public.admin_requests for all
to authenticated
using (public.has_role(auth.uid(), 'admin'::public.app_role));
