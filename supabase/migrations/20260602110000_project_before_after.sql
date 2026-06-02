-- Add img_before column to the projects table to support before/after comparisons
ALTER TABLE public.projects
ADD COLUMN IF NOT EXISTS img_before text;
