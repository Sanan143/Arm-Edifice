/**
 * Client-side project CRUD helpers.
 * Uses the authenticated Supabase browser client — RLS enforces:
 *   - Anyone can READ  (public portfolio)
 *   - Only admins can INSERT / UPDATE / DELETE
 * No SUPABASE_SERVICE_ROLE_KEY required.
 */
import { supabase } from "@/integrations/supabase/client";

export type ProjectCategory =
  | "Commercial"
  | "Residential"
  | "Showroom"
  | "Workspace"
  | "Facade"
  | "Retail";

export interface Project {
  id: string;
  title: string;
  category: ProjectCategory;
  location: string;
  scope: string;
  year: number;
  img: string;
  created_at?: string;
  updated_at?: string;
}

// ─── Public: list all projects ────────────────────────────────────────────────

export async function fetchAllProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as Project[];
}

// ─── Admin: add a project ─────────────────────────────────────────────────────

export async function createProject(
  payload: Omit<Project, "id" | "created_at" | "updated_at">
): Promise<Project> {
  const { data, error } = await supabase
    .from("projects")
    .insert(payload)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as Project;
}

// ─── Admin: update a project ──────────────────────────────────────────────────

export async function editProject(
  id: string,
  payload: Partial<Omit<Project, "id" | "created_at" | "updated_at">>
): Promise<Project> {
  const { data, error } = await supabase
    .from("projects")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as Project;
}

// ─── Admin: delete a project ──────────────────────────────────────────────────

export async function removeProject(id: string): Promise<void> {
  const { error } = await supabase
    .from("projects")
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);
}
