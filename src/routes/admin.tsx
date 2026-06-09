import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { listLeads, checkIsAdmin } from "@/lib/leads.functions";
import {
  submitAdminRequest,
  getAdminRequestStatus,
  listAdminRequests,
  approveAdminRequest,
  rejectAdminRequest,
} from "@/lib/admin.functions";
import {
  listProjects,
  addProject,
  updateProject,
  deleteProject,
  type Project,
  type ProjectCategory,
} from "@/lib/projects.functions";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import {
  Plus,
  Edit2,
  Trash2,
  Briefcase,
  Users,
  X,
  MapPin,
  Calendar,
  Image as ImageIcon,
  Loader2,
  UploadCloud,
  Link as LinkIcon,
} from "lucide-react";
import { projectCategories } from "@/data/projects";

type Lead = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  city: string | null;
  project_type: string | null;
  message: string | null;
  status: string;
  created_at: string;
};

type AdminRequest = {
  id: string;
  email: string;
  status: string;
  created_at: string;
  updated_at: string;
  user_id: string;
};

export const Route = createFileRoute("/admin")({
  component: AdminPage,
  head: () => ({
    meta: [{ title: "Admin — ARM Edifice" }, { name: "robots", content: "noindex" }],
  }),
});

function AdminPage() {
  const navigate = useNavigate();
  const fetchLeads = useServerFn(listLeads);
  const fetchIsAdmin = useServerFn(checkIsAdmin);
  const requestSubmit = useServerFn(submitAdminRequest);
  const requestStatus = useServerFn(getAdminRequestStatus);
  const requestList = useServerFn(listAdminRequests);
  const requestApprove = useServerFn(approveAdminRequest);
  const requestReject = useServerFn(rejectAdminRequest);
  const fetchProjects = useServerFn(listProjects);
  const createProj = useServerFn(addProject);
  const editProj = useServerFn(updateProject);
  const deleteProj = useServerFn(deleteProject);

  const [state, setState] = useState<"loading" | "ready" | "denied">("loading");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [activeTab, setActiveTab] = useState<"leads" | "projects" | "requests">("leads");

  // Admin approval requests state
  const [adminRequests, setAdminRequests] = useState<AdminRequest[]>([]);
  const [myRequestStatus, setMyRequestStatus] = useState<
    "none" | "pending" | "approved" | "rejected"
  >("none");
  const [submittingRequest, setSubmittingRequest] = useState(false);

  // Projects state
  const [projectsList, setProjectsList] = useState<Project[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<ProjectCategory>("Commercial");
  const [location, setLocation] = useState("");
  const [scope, setScope] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [imgUrl, setImgUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [imageTab, setImageTab] = useState<"upload" | "url">("upload");
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Before image form states (Optional before/after comparison)
  const [imgBeforeUrl, setImgBeforeUrl] = useState("");
  const [uploadingBefore, setUploadingBefore] = useState(false);
  const [imageBeforeTab, setImageBeforeTab] = useState<"upload" | "url">("upload");
  const [dragOverBefore, setDragOverBefore] = useState(false);
  const fileInputBeforeRef = useRef<HTMLInputElement>(null);

  // Additional on-site photos states
  const [additionalImages, setAdditionalImages] = useState<string[]>([]);
  const [uploadingAdditional, setUploadingAdditional] = useState(false);
  const [dragOverAdditional, setDragOverAdditional] = useState(false);
  const fileInputAdditionalRef = useRef<HTMLInputElement>(null);

  const stockImages = [
    {
      label: "Commercial Facade",
      url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop",
    },
    {
      label: "Residential Villa",
      url: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=1200&auto=format&fit=crop",
    },
    {
      label: "Spider Glazing Atrium",
      url: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop",
    },
    {
      label: "Modern Office",
      url: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=1200&auto=format&fit=crop",
    },
    {
      label: "Premium Glass Facade",
      url: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1200&auto=format&fit=crop",
    },
  ];

  const reloadProjects = async () => {
    try {
      const { projects } = await fetchProjects();
      setProjectsList(projects);
    } catch (e) {
      toast.error("Failed to refresh projects");
    }
  };

  const handleFileUpload = useCallback(async (file: File, target: "after" | "before") => {
    if (!file) return;
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowed.includes(file.type)) {
      toast.error("Only JPEG, PNG, WebP, or GIF images are allowed.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be under 10 MB.");
      return;
    }
    if (target === "after") {
      setUploading(true);
    } else {
      setUploadingBefore(true);
    }
    try {
      const ext = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("project-images")
        .upload(fileName, file, { cacheControl: "3600", upsert: false });
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from("project-images").getPublicUrl(fileName);
      if (target === "after") {
        setImgUrl(data.publicUrl);
      } else {
        setImgBeforeUrl(data.publicUrl);
      }
      toast.success("Image uploaded successfully!");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      if (target === "after") {
        setUploading(false);
      } else {
        setUploadingBefore(false);
      }
    }
  }, []);

  const handleMultipleFilesUpload = useCallback(async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;
    setUploadingAdditional(true);
    let successCount = 0;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
      if (!allowed.includes(file.type)) {
        toast.error(`Only JPEG, PNG, WebP, or GIF images are allowed. Skipped ${file.name}`);
        continue;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`File size must be under 10 MB. Skipped ${file.name}`);
        continue;
      }
      try {
        const ext = file.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("project-images")
          .upload(fileName, file, { cacheControl: "3600", upsert: false });
        if (uploadError) throw uploadError;
        const { data } = supabase.storage.from("project-images").getPublicUrl(fileName);
        setAdditionalImages((prev) => [...prev, data.publicUrl]);
        successCount++;
      } catch (e) {
        toast.error(
          `Failed to upload ${file.name}: ${e instanceof Error ? e.message : "Unknown error"}`,
        );
      }
    }
    setUploadingAdditional(false);
    if (successCount > 0) {
      toast.success(`Uploaded ${successCount} additional image(s) successfully!`);
    }
  }, []);

  const reloadRequests = async () => {
    try {
      const { requests } = await requestList();
      setAdminRequests(requests);
    } catch (e) {
      toast.error("Failed to refresh requests");
    }
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        if (!data.session) {
          navigate({ to: "/login" });
          return;
        }
        const { isAdmin } = await fetchIsAdmin();
        if (!mounted) return;
        if (!isAdmin) {
          const { status } = await requestStatus();
          if (mounted) {
            setMyRequestStatus(status as "none" | "pending" | "approved" | "rejected");
            setState("denied");
          }
          return;
        }
        const [{ leads }, { projects }, { requests }] = await Promise.all([
          fetchLeads(),
          fetchProjects(),
          requestList(),
        ]);
        if (!mounted) return;
        setLeads(leads as Lead[]);
        setProjectsList(projects);
        setAdminRequests(requests);
        setState("ready");
      } catch (e) {
        console.error("Failed to load admin panel details:", e);
        toast.error(e instanceof Error ? e.message : "Failed to load admin panel");
        if (mounted) {
          // If we fail because of auth or initialization, let's redirect to login safely
          navigate({ to: "/login" });
        }
      }
    })();
    return () => {
      mounted = false;
    };
  }, [fetchLeads, fetchIsAdmin, navigate, requestStatus, requestList, fetchProjects]);

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/login" });
  };

  const handleRequestAccess = async () => {
    setSubmittingRequest(true);
    try {
      await requestSubmit();
      toast.success("Admin request submitted successfully!");
      setMyRequestStatus("pending");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to submit request");
    } finally {
      setSubmittingRequest(false);
    }
  };

  const handleApproveRequest = async (id: string) => {
    try {
      await requestApprove({ data: { requestId: id } });
      toast.success("User promoted to Admin!");
      await Promise.all([reloadRequests(), reloadProjects()]);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to approve request");
    }
  };

  const handleRejectRequest = async (id: string) => {
    try {
      await requestReject({ data: { requestId: id } });
      toast.success("Request rejected.");
      await reloadRequests();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to reject request");
    }
  };

  const handleOpenAddModal = () => {
    setEditingProject(null);
    setTitle("");
    setCategory("Commercial");
    setLocation("");
    setScope("");
    setYear(new Date().getFullYear());
    setImgUrl("");
    setImageTab("upload");
    setImgBeforeUrl("");
    setImageBeforeTab("upload");
    setAdditionalImages([]);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (proj: Project) => {
    setEditingProject(proj);
    setTitle(proj.title);
    setCategory(proj.category);
    setLocation(proj.location);
    setScope(proj.scope);
    setYear(proj.year);
    setImgUrl(proj.img);
    setImageTab(proj.img.startsWith("http") && proj.img.includes("unsplash") ? "url" : "upload");
    setImgBeforeUrl(proj.img_before || "");
    setImageBeforeTab(
      proj.img_before && proj.img_before.startsWith("http") && proj.img_before.includes("unsplash")
        ? "url"
        : "upload",
    );
    setAdditionalImages(proj.additional_images || []);
    setIsModalOpen(true);
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    setDeletingId(id);
    try {
      await deleteProj({ data: { id } });
      toast.success("Project deleted");
      await reloadProjects();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to delete project");
    } finally {
      setDeletingId(null);
    }
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !location.trim() || !scope.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const payload = {
      title: title.trim(),
      category,
      location: location.trim(),
      scope: scope.trim(),
      year: Number(year),
      img: imgUrl || stockImages[0].url,
      img_before: imgBeforeUrl.trim() || null,
      additional_images: additionalImages,
    };

    setSaving(true);
    try {
      if (editingProject) {
        await editProj({ data: { id: editingProject.id, ...payload } });
        toast.success("Project updated successfully");
      } else {
        await createProj({ data: payload });
        toast.success("New project added successfully");
      }
      await reloadProjects();
      setIsModalOpen(false);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to save project");
    } finally {
      setSaving(false);
    }
  };

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (state === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-muted-foreground font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" />
          <span>Securing connection & loading files…</span>
        </div>
      </div>
    );
  }

  // ── Access denied ────────────────────────────────────────────────────────────
  if (state === "denied") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-6 font-sans">
        <div className="glass rounded-2xl p-10 max-w-md w-full text-center border border-border/80 shadow-elegant">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Access Denied</h1>
          <p className="mt-3 text-muted-foreground text-sm leading-relaxed">
            Your account does not have administrator privileges yet.
          </p>

          <div className="mt-6 p-5 rounded-xl border border-border/60 bg-secondary/10">
            {myRequestStatus === "none" && (
              <>
                <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                  You can submit a request to the existing administrators to promote your account.
                </p>
                <button
                  onClick={handleRequestAccess}
                  disabled={submittingRequest}
                  className="w-full py-2.5 rounded-lg bg-gradient-silver text-jet font-semibold text-sm hover:opacity-95 shadow-elegant transition-smooth flex items-center justify-center gap-2 cursor-pointer"
                  style={{ color: "var(--jet)" }}
                >
                  {submittingRequest ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Submitting Request...</span>
                    </>
                  ) : (
                    <span>Request Admin Access</span>
                  )}
                </button>
              </>
            )}

            {myRequestStatus === "pending" && (
              <div className="text-center py-2">
                <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-500 border border-amber-500/20 mb-3 animate-pulse">
                  Pending Approval
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Your request has been submitted. Please wait for an existing admin to review and
                  approve it.
                </p>
              </div>
            )}

            {myRequestStatus === "approved" && (
              <div className="text-center py-2">
                <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 mb-3">
                  Approved
                </div>
                <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                  Your request has been approved! Please refresh the page to access the admin suite.
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="w-full py-2.5 rounded-lg bg-gradient-silver text-jet font-semibold text-sm hover:opacity-95 shadow-elegant transition-smooth cursor-pointer"
                  style={{ color: "var(--jet)" }}
                >
                  Refresh Page
                </button>
              </div>
            )}

            {myRequestStatus === "rejected" && (
              <div className="text-center py-2">
                <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-destructive/10 text-destructive border border-destructive/20 mb-3">
                  Request Declined
                </div>
                <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                  Your request was reviewed and declined by an administrator.
                </p>
                <button
                  onClick={handleRequestAccess}
                  disabled={submittingRequest}
                  className="w-full py-2.5 rounded-lg border border-border text-sm font-semibold hover:bg-secondary/40 transition-smooth cursor-pointer"
                >
                  {submittingRequest ? "Re-Submitting..." : "Re-Submit Request"}
                </button>
              </div>
            )}
          </div>

          <button
            onClick={signOut}
            className="mt-6 text-sm font-semibold text-muted-foreground hover:text-foreground transition-smooth cursor-pointer block mx-auto hover:underline"
          >
            Sign out
          </button>
        </div>
      </div>
    );
  }

  // ── Main admin UI ────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* Header */}
      <header className="border-b border-border/60 sticky top-0 bg-background/80 backdrop-blur-md z-40">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 py-4 flex items-center justify-between">
          <Link
            to="/"
            className="font-bold text-xl tracking-tight text-foreground flex items-center gap-2"
          >
            <span className="site-title">ARM Edifice</span>
            <span className="text-xs bg-accent/20 text-accent border border-accent/30 px-2 py-0.5 rounded font-mono font-medium">
              ADMIN
            </span>
          </Link>
          <button
            onClick={signOut}
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-smooth py-1.5 px-3 rounded-md hover:bg-secondary/40"
          >
            Sign out
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 lg:px-10 py-10">
        {/* Tabs */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 border-b border-border/40 pb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Management Suite</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Control your business inquiries and public portfolio
            </p>
          </div>
          <div className="flex gap-2 bg-secondary/30 p-1.5 rounded-lg border border-border/40 self-start">
            <button
              onClick={() => setActiveTab("leads")}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-smooth cursor-pointer ${
                activeTab === "leads"
                  ? "bg-gradient-silver text-jet shadow-elegant"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              style={activeTab === "leads" ? { color: "var(--jet)" } : undefined}
            >
              <Users className="w-4 h-4" />
              <span>Inbound Leads ({leads.length})</span>
            </button>
            <button
              onClick={() => setActiveTab("projects")}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-smooth cursor-pointer ${
                activeTab === "projects"
                  ? "bg-gradient-silver text-jet shadow-elegant"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              style={activeTab === "projects" ? { color: "var(--jet)" } : undefined}
            >
              <Briefcase className="w-4 h-4" />
              <span>Projects Portfolio ({projectsList.length})</span>
            </button>
            <button
              onClick={() => setActiveTab("requests")}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-smooth cursor-pointer ${
                activeTab === "requests"
                  ? "bg-gradient-silver text-jet shadow-elegant"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              style={activeTab === "requests" ? { color: "var(--jet)" } : undefined}
            >
              <Users className="w-4 h-4 text-accent" />
              <span>
                Team Requests ({adminRequests.filter((r) => r.status === "pending").length})
              </span>
            </button>
          </div>
        </div>

        {/* ── Tab 1: Leads ─────────────────────────────────────────────────── */}
        {activeTab === "leads" && (
          <div className="glass rounded-xl overflow-hidden border border-border/80 shadow-elegant">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-secondary/60 text-muted-foreground border-b border-border/60">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Date</th>
                    <th className="px-6 py-4 font-semibold">Name</th>
                    <th className="px-6 py-4 font-semibold">Contact Phone</th>
                    <th className="px-6 py-4 font-semibold">Project Type</th>
                    <th className="px-6 py-4 font-semibold">City</th>
                    <th className="px-6 py-4 font-semibold">Customer Message</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {leads.map((l) => (
                    <tr key={l.id} className="hover:bg-secondary/20 transition-smooth">
                      <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">
                        {new Date(l.created_at).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4 font-medium text-foreground">{l.name}</td>
                      <td className="px-6 py-4">
                        <a
                          href={`tel:${l.phone}`}
                          className="text-accent hover:underline font-mono"
                        >
                          {l.phone}
                        </a>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent/10 text-accent border border-accent/20">
                          {l.project_type || "General Inquiry"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">{l.city || "—"}</td>
                      <td className="px-6 py-4 text-muted-foreground max-w-sm whitespace-pre-wrap leading-relaxed">
                        {l.message || "—"}
                      </td>
                    </tr>
                  ))}
                  {leads.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-16 text-center text-muted-foreground">
                        <div className="flex flex-col items-center gap-2">
                          <Users className="w-8 h-8 text-muted-foreground/60" />
                          <span className="font-medium">No leads have requested quotes yet.</span>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Tab 2: Projects ───────────────────────────────────────────────── */}
        {activeTab === "projects" && (
          <div className="space-y-6">
            {/* Info banner */}
            <div className="flex items-start gap-3 bg-accent/5 border border-accent/20 rounded-xl px-5 py-4">
              <Briefcase className="w-5 h-5 text-accent shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">
                  Admin-Only: Portfolio Management
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Projects added here are saved to the database and immediately visible on the
                  public portfolio page. Only admins can add, edit or delete projects.
                </p>
              </div>
              <button
                onClick={handleOpenAddModal}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-silver text-jet font-semibold text-sm hover:opacity-95 shadow-elegant transition-smooth shrink-0"
                style={{ color: "var(--jet)" }}
              >
                <Plus className="w-4 h-4 stroke-[3px]" />
                <span>Add Project</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projectsList.map((p) => (
                <div
                  key={p.id}
                  className="glass rounded-xl overflow-hidden border border-border/80 flex flex-col justify-between group hover:border-accent/40 transition-smooth shadow-elegant"
                >
                  <div>
                    <div className="relative aspect-[16/10] overflow-hidden bg-secondary/40 border-b border-border/40">
                      <img
                        src={p.img}
                        alt={p.title}
                        className="w-full h-full object-cover transition-smooth group-hover:scale-105"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = stockImages[0].url;
                        }}
                      />
                      <span className="absolute top-3 right-3 text-xs font-semibold bg-jet/80 text-accent px-2.5 py-1 rounded-full backdrop-blur-sm border border-accent/30">
                        {p.category}
                      </span>
                      {p.img_before && (
                        <span className="absolute bottom-3 left-3 text-[10px] font-semibold bg-emerald-500/90 text-white px-2 py-0.5 rounded backdrop-blur-sm shadow-sm">
                          Before/After Available
                        </span>
                      )}
                    </div>
                    <div className="p-5 space-y-3">
                      <h3 className="font-bold text-lg text-foreground line-clamp-1">{p.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed min-h-[40px]">
                        {p.scope}
                      </p>
                      <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground border-t border-border/30 pt-3">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-accent" />
                          <span>{p.location}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-accent" />
                          <span>Year {p.year}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 pt-0 flex gap-2">
                    <button
                      onClick={() => handleOpenEditModal(p)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg border border-border hover:border-accent/40 text-sm font-medium hover:text-accent hover:bg-accent/5 transition-smooth"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteProject(p.id)}
                      disabled={deletingId === p.id}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg border border-destructive/30 hover:border-destructive text-sm font-medium hover:text-destructive hover:bg-destructive/5 transition-smooth disabled:opacity-60"
                    >
                      {deletingId === p.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5" />
                      )}
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}

              {projectsList.length === 0 && (
                <div className="col-span-full py-16 text-center text-muted-foreground border border-dashed border-border/80 rounded-xl glass">
                  <div className="flex flex-col items-center gap-2">
                    <Briefcase className="w-8 h-8 text-muted-foreground/60" />
                    <span className="font-medium">No projects in portfolio yet.</span>
                    <button
                      onClick={handleOpenAddModal}
                      className="mt-2 text-sm text-accent hover:underline"
                    >
                      Add your first project →
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Tab 3: Requests ──────────────────────────────────────────────── */}
        {activeTab === "requests" && (
          <div className="glass rounded-xl overflow-hidden border border-border/80 shadow-elegant">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-secondary/60 text-muted-foreground border-b border-border/60">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Request Date</th>
                    <th className="px-6 py-4 font-semibold">User Email</th>
                    <th className="px-6 py-4 font-semibold">Current Status</th>
                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {adminRequests.map((r) => (
                    <tr key={r.id} className="hover:bg-secondary/20 transition-smooth">
                      <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">
                        {new Date(r.created_at).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4 font-medium text-foreground">{r.email}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                            r.status === "pending"
                              ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                              : r.status === "approved"
                                ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                                : "bg-destructive/10 text-destructive border-destructive/20"
                          }`}
                        >
                          {r.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        {r.status === "pending" ? (
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleApproveRequest(r.id)}
                              className="px-3 py-1.5 rounded bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold transition-smooth cursor-pointer"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleRejectRequest(r.id)}
                              className="px-3 py-1.5 rounded bg-destructive hover:bg-destructive/90 text-white text-xs font-semibold transition-smooth cursor-pointer"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground font-medium">
                            Reviewed
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {adminRequests.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-16 text-center text-muted-foreground">
                        <div className="flex flex-col items-center gap-2">
                          <Users className="w-8 h-8 text-muted-foreground/60" />
                          <span className="font-medium">No admin access requests yet.</span>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Modal: Add / Edit Project ─────────────────────────────────────── */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-jet/90 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-card w-full max-w-lg rounded-2xl border border-border/80 shadow-elegant overflow-hidden animate-fade-up my-8">
              <div className="flex items-center justify-between px-6 py-5 border-b border-border/60">
                <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-accent" />
                  <span>{editingProject ? "Modify Project" : "Add Project to Portfolio"}</span>
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-secondary/40 text-muted-foreground hover:text-foreground transition-smooth"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveProject} className="p-6 space-y-5">
                {/* Title */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-muted-foreground">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Structural Spider Glazing — IT Atrium"
                    className="w-full rounded-lg border border-border/80 bg-background px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-smooth"
                  />
                </div>

                {/* Category & Year */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-muted-foreground">
                      Category *
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as ProjectCategory)}
                      className="w-full rounded-lg border border-border/80 bg-background px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-smooth"
                    >
                      {projectCategories
                        .filter((cat) => cat !== "All")
                        .map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-muted-foreground">
                      Year *
                    </label>
                    <input
                      type="number"
                      required
                      min={2000}
                      max={2050}
                      value={year}
                      onChange={(e) => setYear(Number(e.target.value))}
                      className="w-full rounded-lg border border-border/80 bg-background px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-smooth"
                    />
                  </div>
                </div>

                {/* Location */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-muted-foreground">
                    Location *
                  </label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Bengaluru, Hubli, Mysuru"
                    className="w-full rounded-lg border border-border/80 bg-background px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-smooth"
                  />
                </div>

                {/* Scope */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-muted-foreground">
                    Scope / Brief Details *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={scope}
                    onChange={(e) => setScope(e.target.value)}
                    placeholder="Describe the materials used, area coverage, or specific technical specs..."
                    className="w-full rounded-lg border border-border/80 bg-background px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-smooth resize-none"
                  />
                </div>

                {/* Image — Upload or URL */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <ImageIcon className="w-4 h-4 text-accent" />
                    <span>Project Image</span>
                  </label>

                  {/* Tab switcher */}
                  <div className="flex gap-1 p-1 bg-secondary/30 rounded-lg border border-border/40 w-fit">
                    <button
                      type="button"
                      onClick={() => setImageTab("upload")}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-smooth ${
                        imageTab === "upload"
                          ? "bg-gradient-silver text-jet shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                      style={imageTab === "upload" ? { color: "var(--jet)" } : undefined}
                    >
                      <UploadCloud className="w-3.5 h-3.5" />
                      Upload File
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageTab("url")}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-smooth ${
                        imageTab === "url"
                          ? "bg-gradient-silver text-jet shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                      style={imageTab === "url" ? { color: "var(--jet)" } : undefined}
                    >
                      <LinkIcon className="w-3.5 h-3.5" />
                      Paste URL
                    </button>
                  </div>

                  {imageTab === "upload" && (
                    <div className="space-y-2">
                      {/* Drag-and-drop zone */}
                      <div
                        onClick={() => !uploading && fileInputRef.current?.click()}
                        onDragOver={(e) => {
                          e.preventDefault();
                          setDragOver(true);
                        }}
                        onDragLeave={() => setDragOver(false)}
                        onDrop={(e) => {
                          e.preventDefault();
                          setDragOver(false);
                          const file = e.dataTransfer.files?.[0];
                          if (file) handleFileUpload(file, "after");
                        }}
                        className={`relative flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed py-8 px-4 cursor-pointer transition-smooth ${
                          dragOver
                            ? "border-accent bg-accent/10"
                            : uploading
                              ? "border-border/40 bg-secondary/10 cursor-not-allowed"
                              : "border-border/60 hover:border-accent/60 hover:bg-accent/5"
                        }`}
                      >
                        {uploading ? (
                          <>
                            <Loader2 className="w-8 h-8 text-accent animate-spin" />
                            <p className="text-xs text-muted-foreground">Uploading image…</p>
                          </>
                        ) : (
                          <>
                            <UploadCloud
                              className={`w-8 h-8 transition-smooth ${dragOver ? "text-accent" : "text-muted-foreground/60"}`}
                            />
                            <p className="text-sm font-medium text-foreground">
                              {dragOver ? "Drop to upload" : "Click or drag & drop"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              JPEG, PNG, WebP · Max 10 MB
                            </p>
                          </>
                        )}
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(file, "after");
                          e.target.value = "";
                        }}
                      />
                      {imgUrl && !uploading && (
                        <p className="text-xs text-emerald-500 font-medium flex items-center gap-1">
                          <span>✓</span> Image uploaded successfully
                        </p>
                      )}
                    </div>
                  )}

                  {imageTab === "url" && (
                    <div className="space-y-2">
                      <input
                        type="url"
                        value={imgUrl}
                        onChange={(e) => setImgUrl(e.target.value)}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full rounded-lg border border-border/80 bg-background px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-smooth"
                      />
                      <div className="space-y-1.5">
                        <span className="text-xs text-muted-foreground">
                          Or pick a premium stock image:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {stockImages.map((img) => (
                            <button
                              key={img.label}
                              type="button"
                              onClick={() => setImgUrl(img.url)}
                              className={`text-xs px-2.5 py-1.5 rounded border transition-smooth ${
                                imgUrl === img.url
                                  ? "bg-accent/20 border-accent text-accent"
                                  : "bg-secondary/40 border-border/60 hover:bg-secondary/80 text-muted-foreground hover:text-foreground"
                              }`}
                            >
                              {img.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Live preview (always shown when a URL is set) */}
                  {imgUrl && (
                    <div className="rounded-lg overflow-hidden border border-border/60 bg-secondary/20 flex items-center justify-center p-2 min-h-[200px]">
                      <img
                        src={imgUrl}
                        alt="Preview"
                        className="max-h-64 max-w-full rounded-md object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Before Image — Optional, Upload or URL */}
                <div className="space-y-3 pt-2 border-t border-border/40">
                  <label className="block text-sm font-medium text-muted-foreground flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <ImageIcon className="w-4 h-4 text-accent" />
                      <span>Before Image (Optional)</span>
                    </span>
                    {imgBeforeUrl && (
                      <button
                        type="button"
                        onClick={() => setImgBeforeUrl("")}
                        className="text-xs text-destructive hover:underline cursor-pointer"
                      >
                        Remove
                      </button>
                    )}
                  </label>

                  {/* Tab switcher */}
                  <div className="flex gap-1 p-1 bg-secondary/30 rounded-lg border border-border/40 w-fit">
                    <button
                      type="button"
                      onClick={() => setImageBeforeTab("upload")}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-smooth cursor-pointer ${
                        imageBeforeTab === "upload"
                          ? "bg-gradient-silver text-jet shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                      style={imageBeforeTab === "upload" ? { color: "var(--jet)" } : undefined}
                    >
                      <UploadCloud className="w-3.5 h-3.5" />
                      Upload File
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageBeforeTab("url")}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-smooth cursor-pointer ${
                        imageBeforeTab === "url"
                          ? "bg-gradient-silver text-jet shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                      style={imageBeforeTab === "url" ? { color: "var(--jet)" } : undefined}
                    >
                      <LinkIcon className="w-3.5 h-3.5" />
                      Paste URL
                    </button>
                  </div>

                  {imageBeforeTab === "upload" && (
                    <div className="space-y-2">
                      {/* Drag-and-drop zone */}
                      <div
                        onClick={() => !uploadingBefore && fileInputBeforeRef.current?.click()}
                        onDragOver={(e) => {
                          e.preventDefault();
                          setDragOverBefore(true);
                        }}
                        onDragLeave={() => setDragOverBefore(false)}
                        onDrop={(e) => {
                          e.preventDefault();
                          setDragOverBefore(false);
                          const file = e.dataTransfer.files?.[0];
                          if (file) handleFileUpload(file, "before");
                        }}
                        className={`relative flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed py-8 px-4 cursor-pointer transition-smooth ${
                          dragOverBefore
                            ? "border-accent bg-accent/10"
                            : uploadingBefore
                              ? "border-border/40 bg-secondary/10 cursor-not-allowed"
                              : "border-border/60 hover:border-accent/60 hover:bg-accent/5"
                        }`}
                      >
                        {uploadingBefore ? (
                          <>
                            <Loader2 className="w-8 h-8 text-accent animate-spin" />
                            <p className="text-xs text-muted-foreground">Uploading image…</p>
                          </>
                        ) : (
                          <>
                            <UploadCloud
                              className={`w-8 h-8 transition-smooth ${dragOverBefore ? "text-accent" : "text-muted-foreground/60"}`}
                            />
                            <p className="text-sm font-medium text-foreground">
                              {dragOverBefore ? "Drop to upload" : "Click or drag & drop"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              JPEG, PNG, WebP · Max 10 MB
                            </p>
                          </>
                        )}
                      </div>
                      <input
                        ref={fileInputBeforeRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(file, "before");
                          e.target.value = "";
                        }}
                      />
                      {imgBeforeUrl && !uploadingBefore && (
                        <p className="text-xs text-emerald-500 font-medium flex items-center gap-1">
                          <span>✓</span> Before image uploaded successfully
                        </p>
                      )}
                    </div>
                  )}

                  {imageBeforeTab === "url" && (
                    <div className="space-y-2">
                      <input
                        type="url"
                        value={imgBeforeUrl}
                        onChange={(e) => setImgBeforeUrl(e.target.value)}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full rounded-lg border border-border/80 bg-background px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-smooth"
                      />
                    </div>
                  )}

                  {/* Live preview */}
                  {imgBeforeUrl && (
                    <div className="rounded-lg overflow-hidden border border-border/60 bg-secondary/20 flex items-center justify-center p-2 min-h-[200px]">
                      <img
                        src={imgBeforeUrl}
                        alt="Before Preview"
                        className="max-h-64 max-w-full rounded-md object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Additional Photos — Optional, Multiple Uploads */}
                <div className="space-y-3 pt-2 border-t border-border/40">
                  <label className="block text-sm font-medium text-muted-foreground flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <ImageIcon className="w-4 h-4 text-accent" />
                      <span>Additional On-Site Photos (Optional)</span>
                    </span>
                    {additionalImages.length > 0 && (
                      <span className="text-xs text-muted-foreground">
                        {additionalImages.length} image(s) uploaded
                      </span>
                    )}
                  </label>

                  {/* Drag-and-drop zone for multiple files */}
                  <div
                    onClick={() => !uploadingAdditional && fileInputAdditionalRef.current?.click()}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragOverAdditional(true);
                    }}
                    onDragLeave={() => setDragOverAdditional(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setDragOverAdditional(false);
                      const files = e.dataTransfer.files;
                      if (files) handleMultipleFilesUpload(files);
                    }}
                    className={`relative flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed py-8 px-4 cursor-pointer transition-smooth ${
                      dragOverAdditional
                        ? "border-accent bg-accent/10"
                        : uploadingAdditional
                          ? "border-border/40 bg-secondary/10 cursor-not-allowed"
                          : "border-border/60 hover:border-accent/60 hover:bg-accent/5"
                    }`}
                  >
                    {uploadingAdditional ? (
                      <>
                        <Loader2 className="w-8 h-8 text-accent animate-spin" />
                        <p className="text-xs text-muted-foreground">Uploading images…</p>
                      </>
                    ) : (
                      <>
                        <UploadCloud
                          className={`w-8 h-8 transition-smooth ${dragOverAdditional ? "text-accent" : "text-muted-foreground/60"}`}
                        />
                        <p className="text-sm font-medium text-foreground">
                          {dragOverAdditional
                            ? "Drop to upload"
                            : "Click or drag & drop multiple files"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          JPEG, PNG, WebP · Max 10 MB each
                        </p>
                      </>
                    )}
                  </div>
                  <input
                    ref={fileInputAdditionalRef}
                    type="file"
                    multiple
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    className="hidden"
                    onChange={(e) => {
                      const files = e.target.files;
                      if (files) handleMultipleFilesUpload(files);
                      e.target.value = "";
                    }}
                  />

                  {/* Image Grid Preview with delete action */}
                  {additionalImages.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {additionalImages.map((url, idx) => (
                        <div
                          key={idx}
                          className="relative group aspect-square rounded-lg overflow-hidden border border-border/60 bg-secondary/20 flex items-center justify-center p-1"
                        >
                          <img
                            src={url}
                            alt={`Additional ${idx + 1}`}
                            className="max-w-full max-h-full w-auto h-auto object-contain"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setAdditionalImages((prev) => prev.filter((_, i) => i !== idx))
                            }
                            className="absolute top-1 right-1 p-1 bg-red-500/80 hover:bg-red-600 text-white rounded-full transition-smooth opacity-0 group-hover:opacity-100 shadow-sm"
                            aria-label="Remove image"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-2 border-t border-border/40 pt-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 rounded-lg border border-border text-sm font-medium hover:bg-secondary/40 transition-smooth"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2.5 rounded-lg bg-gradient-silver text-jet font-bold text-sm hover:opacity-95 shadow-elegant transition-smooth flex items-center gap-2 disabled:opacity-70"
                    style={{ color: "var(--jet)" }}
                  >
                    {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                    {editingProject ? "Update Changes" : "Create Project"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
