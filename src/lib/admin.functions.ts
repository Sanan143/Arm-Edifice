import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

// Helper to verify if the caller is an administrator
async function assertIsAdmin(userId: string) {
  console.log("Verifying admin role for user:", userId);
  const { data, error } = await supabaseAdmin
    .from("user_roles")
    .select("id")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();

  if (error || !data) {
    if (error) console.error("assertIsAdmin database error:", error);
    else console.warn("assertIsAdmin failed: User has no admin role in user_roles table.");
    throw new Error("Forbidden: You must be an administrator to perform this action.");
  }
  console.log("Admin verification successful for user:", userId);
}

// ─── 1. Submit Request ──────────────────────────────────────────────────────────
export const submitAdminRequest = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { userId } = context;

    // Fetch the user's email using administrative client
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserById(userId);
    if (userError || !userData?.user) {
      throw new Error("Could not retrieve user details.");
    }

    const email = userData.user.email;
    if (!email) {
      throw new Error("User email address is missing.");
    }

    // Upsert the request in case they were previously rejected and are requesting again
    const { data, error } = await supabaseAdmin
      .from("admin_requests")
      .upsert(
        {
          user_id: userId,
          email,
          status: "pending",
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      )
      .select()
      .single();

    if (error) {
      console.error("submitAdminRequest error", error);
      throw new Error(error.message);
    }

    return { ok: true, request: data };
  });

// ─── 2. Get Request Status ──────────────────────────────────────────────────────
export const getAdminRequestStatus = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { userId } = context;

    const { data, error } = await supabaseAdmin
      .from("admin_requests")
      .select("status")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      console.error("getAdminRequestStatus error", error);
      return { status: "none" };
    }

    return { status: data?.status ?? "none" };
  });

// ─── 3. List All Requests (Admin-only) ──────────────────────────────────────────
export const listAdminRequests = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { userId } = context;
    await assertIsAdmin(userId);

    const { data, error } = await supabaseAdmin
      .from("admin_requests")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("listAdminRequests error", error);
      throw new Error(error.message);
    }

    return { requests: data ?? [] };
  });

// ─── 4. Approve Request (Admin-only) ─────────────────────────────────────────────
export const approveAdminRequest = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ requestId: z.string() }).parse(input))
  .handler(async ({ context, data }) => {
    const { userId } = context;
    await assertIsAdmin(userId);

    console.log("Approve request action initiated. Request ID:", data.requestId);

    // Get the request details to find the requesting user's ID
    const { data: request, error: reqErr } = await supabaseAdmin
      .from("admin_requests")
      .select("user_id, email")
      .eq("id", data.requestId)
      .single();

    if (reqErr || !request) {
      console.error("Fetch admin request details failed:", reqErr);
      throw new Error("Admin request not found.");
    }

    console.log("Found request for user:", request.user_id, "Email:", request.email);

    // 1. Grant the 'admin' role in user_roles (Insert only if not already present)
    const { data: existingRole, error: checkErr } = await supabaseAdmin
      .from("user_roles")
      .select("id")
      .eq("user_id", request.user_id)
      .eq("role", "admin")
      .maybeSingle();

    if (checkErr) {
      console.error("Check existing role failed:", checkErr);
      throw new Error("Failed to verify existing user roles: " + checkErr.message);
    }

    if (!existingRole) {
      console.log("User does not have admin role. Inserting 'admin' role in user_roles...");
      const { error: roleErr } = await supabaseAdmin
        .from("user_roles")
        .insert({
          user_id: request.user_id,
          role: "admin",
        });

      if (roleErr) {
        console.error("Grant role error:", roleErr);
        throw new Error("Failed to assign admin role: " + roleErr.message);
      }
      console.log("Successfully inserted admin role for user.");
    } else {
      console.log("User already has admin role.");
    }

    // 2. Mark request as approved
    console.log("Updating admin_request status to approved...");
    const { error: updateErr } = await supabaseAdmin
      .from("admin_requests")
      .update({ status: "approved", updated_at: new Date().toISOString() })
      .eq("id", data.requestId);

    if (updateErr) {
      console.error("Update request status error:", updateErr);
      throw new Error("Failed to update request status: " + updateErr.message);
    }

    console.log("Admin request successfully approved!");
    return { ok: true };
  });

// ─── 5. Reject Request (Admin-only) ─────────────────────────────────────────────
export const rejectAdminRequest = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ requestId: z.string() }).parse(input))
  .handler(async ({ context, data }) => {
    const { userId } = context;
    await assertIsAdmin(userId);

    console.log("Reject request action initiated. Request ID:", data.requestId);

    // Update status to rejected
    const { error } = await supabaseAdmin
      .from("admin_requests")
      .update({ status: "rejected", updated_at: new Date().toISOString() })
      .eq("id", data.requestId);

    if (error) {
      console.error("rejectAdminRequest database error:", error);
      throw new Error("Failed to reject request: " + error.message);
    }

    console.log("Admin request successfully rejected!");
    return { ok: true };
  });
