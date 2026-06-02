import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

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
  img_before?: string | null;
  created_at?: string;
  updated_at?: string;
}

const projectSchema = z.object({
  title: z.string().trim().min(1).max(200),
  category: z.enum(["Commercial", "Residential", "Showroom", "Workspace", "Facade", "Retail"]),
  location: z.string().trim().min(1).max(200),
  scope: z.string().trim().min(1).max(2000),
  year: z.number().int().min(2000).max(2050),
  img: z.string().trim().url().max(2000),
  img_before: z.string().trim().url().max(2000).optional().nullable(),
});

// ─── Public: list all projects ───────────────────────────────────────────────

export const listProjects = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await supabaseAdmin
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return { projects: (data ?? []) as Project[] };
});

// ─── Admin: add a project ─────────────────────────────────────────────────────

export const addProject = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => projectSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { data: roleData, error: roleErr } = await supabaseAdmin
      .from("user_roles")
      .select("id")
      .eq("user_id", (context as { userId: string }).userId)
      .eq("role", "admin")
      .maybeSingle();
    const isAdmin = !!roleData;
    if (roleErr || !isAdmin) {
      if (roleErr) console.error("addProject admin check error:", roleErr);
      throw new Error("Forbidden");
    }

    const { data: row, error } = await supabaseAdmin
      .from("projects")
      .insert({
        title: data.title,
        category: data.category,
        location: data.location,
        scope: data.scope,
        year: data.year,
        img: data.img,
        img_before: data.img_before,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return { project: row as Project };
  });

// ─── Admin: update a project ──────────────────────────────────────────────────

export const updateProject = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z.object({ id: z.string().uuid() }).merge(projectSchema).parse(input)
  )
  .handler(async ({ data, context }) => {
    const { data: roleData, error: roleErr } = await supabaseAdmin
      .from("user_roles")
      .select("id")
      .eq("user_id", (context as { userId: string }).userId)
      .eq("role", "admin")
      .maybeSingle();
    const isAdmin = !!roleData;
    if (roleErr || !isAdmin) {
      if (roleErr) console.error("updateProject admin check error:", roleErr);
      throw new Error("Forbidden");
    }

    const { id, ...fields } = data;
    const { data: row, error } = await supabaseAdmin
      .from("projects")
      .update(fields)
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return { project: row as Project };
  });

// ─── Admin: delete a project ──────────────────────────────────────────────────

export const deleteProject = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { data: roleData, error: roleErr } = await supabaseAdmin
      .from("user_roles")
      .select("id")
      .eq("user_id", (context as { userId: string }).userId)
      .eq("role", "admin")
      .maybeSingle();
    const isAdmin = !!roleData;
    if (roleErr || !isAdmin) {
      if (roleErr) console.error("deleteProject admin check error:", roleErr);
      throw new Error("Forbidden");
    }

    const { error } = await supabaseAdmin
      .from("projects")
      .delete()
      .eq("id", data.id);

    if (error) throw new Error(error.message);
    return { ok: true };
  });
