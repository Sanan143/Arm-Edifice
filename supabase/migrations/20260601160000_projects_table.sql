-- Projects portfolio table (admin-managed, publicly readable)
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null,
  location text not null,
  scope text not null,
  year integer not null,
  img text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.projects enable row level security;

-- Public can read projects (portfolio is public)
create policy "Anyone can view projects"
on public.projects for select
to anon, authenticated
using (true);

-- Only admins can insert projects
create policy "Admins can insert projects"
on public.projects for insert
to authenticated
with check (public.has_role(auth.uid(), 'admin'));

-- Only admins can update projects
create policy "Admins can update projects"
on public.projects for update
to authenticated
using (public.has_role(auth.uid(), 'admin'));

-- Only admins can delete projects
create policy "Admins can delete projects"
on public.projects for delete
to authenticated
using (public.has_role(auth.uid(), 'admin'));

-- Trigger to keep updated_at fresh
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger projects_updated_at
  before update on public.projects
  for each row execute function public.set_updated_at();

-- Seed with default showcase projects
insert into public.projects (title, category, location, scope, year, img) values
  ('ACP Facade — Corporate HQ',            'Commercial',  'Hubli',      '12,000 sq.ft ACP cladding with concealed fixing',            2024, 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop'),
  ('Sliding Windows — Sky Villa',          'Residential', 'Bengaluru',  'Heavy-section sliding windows, 9 mm toughened glass',        2024, 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=1200&auto=format&fit=crop'),
  ('Spider Glazing — Atrium',              'Showroom',    'Mysuru',     'Triple-storey spider system with stainless fittings',        2023, 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop'),
  ('Office Partitions — Tech Park',        'Workspace',   'Mangalore',  'Double-glazed acoustic partitions, 220 cabins',              2024, 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=1200&auto=format&fit=crop'),
  ('Casement Windows — Hillside Residence','Residential', 'Hassan',     'Thermal-break casement with mosquito mesh',                  2023, 'https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=1200&auto=format&fit=crop'),
  ('Unitised Curtain Wall — IT Tower',     'Facade',      'Bengaluru',  '18-floor unitised system, reflective DGU',                   2025, 'https://images.unsplash.com/photo-1486325212027-8081e485255e?q=80&w=1200&auto=format&fit=crop'),
  ('Frameless Glass Doors — Flagship',     'Retail',      'Hubli',      '12 mm frameless toughened doors with patch fittings',        2024, 'https://images.unsplash.com/photo-1509721434272-b79147e0e708?q=80&w=1200&auto=format&fit=crop'),
  ('ACP & Glazing — City Mall',            'Facade',      'Mysuru',     'Mixed ACP + structural glazing facade',                      2025, 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1200&auto=format&fit=crop');
