-- Create a public Supabase Storage bucket for project images
insert into storage.buckets (id, name, public)
values ('project-images', 'project-images', true)
on conflict (id) do nothing;

-- Allow anyone to read/view images (portfolio is public)
create policy "Public can view project images"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'project-images');

-- Only admins can upload images
create policy "Admins can upload project images"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'project-images'
  AND EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Only admins can delete images
create policy "Admins can delete project images"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'project-images'
  AND EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);
