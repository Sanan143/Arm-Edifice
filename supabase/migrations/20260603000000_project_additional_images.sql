-- Add additional_images column to the projects table to support multiple photos
ALTER TABLE public.projects
ADD COLUMN IF NOT EXISTS additional_images text[] DEFAULT '{}'::text[];
