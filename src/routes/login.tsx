import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  component: LoginPage,
  head: () => ({ meta: [{ title: "Admin Login — ARM Edifice" }, { name: "robots", content: "noindex" }] }),
});

function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin + "/admin" },
        });
        if (error) throw error;
        toast.success("Account created. Check your email to confirm, then sign in.");
        setMode("signin");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: "/admin" });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero px-6">
      <div className="w-full max-w-md glass rounded-2xl p-10 shadow-elegant">
        <Link to="/" className="text-xs uppercase tracking-[0.25em] text-muted-foreground hover:text-accent">
          ← Back to site
        </Link>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight">Admin {mode === "signin" ? "Sign In" : "Sign Up"}</h1>
        <p className="mt-2 text-sm text-muted-foreground">ARM Edifice control panel.</p>
        <form onSubmit={onSubmit} className="mt-8 space-y-5">
          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full bg-transparent border-b border-border focus:border-accent outline-none py-3"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full bg-transparent border-b border-border focus:border-accent outline-none py-3"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3.5 rounded-md bg-gradient-silver font-medium shadow-elegant hover:shadow-glow transition-smooth disabled:opacity-60"
            style={{ color: "var(--jet)" }}
          >
            {loading ? "Please wait…" : mode === "signin" ? "Sign In" : "Create Account"}
          </button>
        </form>
        <button
          onClick={() => setMode((m) => (m === "signin" ? "signup" : "signin"))}
          className="mt-6 text-sm text-muted-foreground hover:text-accent transition-smooth"
        >
          {mode === "signin" ? "Need an account? Sign up" : "Have an account? Sign in"}
        </button>
      </div>
    </div>
  );
}