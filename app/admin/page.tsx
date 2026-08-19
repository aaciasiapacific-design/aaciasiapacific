"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { getSupabaseBrowserClient } from "../../lib/supabase/client";
import { useAdminPermissions } from "../../lib/admin-access";
import AdminSidebar from "./AdminSidebar";

type AdminProfile = {
  email: string;
  display_name: string | null;
  role: string;
};

const modules = [
  ["News", "Create and publish AACI news and insights.", "/admin/news", "news.view"],
  ["Events", "Manage upcoming events and registration links.", "/admin/events", "events.view"],
  ["Courses", "Manage courses, schedules, fees and class sessions.", "/admin/courses", "courses.view"],
  ["Accredited Organizations", "Maintain the public accreditation directory.", "/admin/organizations", "organizations.view"],
  ["Resources", "Publish guides, files and external resources.", null, null],
  ["Consultation Requests", "Review and follow up website enquiries.", null, null],
  ["People", "Manage Asia Office, Directors, Advisory Board and Surveyors.", "/admin/people", "people.view"],
  ["Users", "Invite users, assign roles and control account access.", "/admin/users", "users.view"],
  ["Roles & Permissions", "Define what each administration role can access and change.", "/admin/roles", "roles.view"],
] as const;

export default function AdminPage() {
  const { can, loading: permissionsLoading, refresh: refreshPermissions } = useAdminPermissions();
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [checking, setChecking] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  async function loadProfile(userId: string) {
    const supabase = getSupabaseBrowserClient();
    const { data, error: profileError } = await supabase
      .from("admin_profiles")
      .select("email, display_name, role")
      .eq("id", userId)
      .eq("is_active", true)
      .maybeSingle();

    if (profileError || !data) {
      await supabase.auth.signOut();
      setProfile(null);
      setError("This account does not have access to the AACI administration area.");
      return;
    }

    setProfile(data as AdminProfile);
    setError("");
  }

  useEffect(() => {
    let active = true;
    const supabase = getSupabaseBrowserClient();

    supabase.auth.getUser().then(async ({ data }) => {
      if (!active) return;
      if (data.user) await loadProfile(data.user.id);
      if (active) setChecking(false);
    });

    return () => { active = false; };
  }, []);

  useEffect(() => { if (profile) void refreshPermissions(); }, [profile, refreshPermissions]);

  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    const supabase = getSupabaseBrowserClient();
    const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    if (signInError || !data.user) {
      setError("Email or password is incorrect.");
      setSubmitting(false);
      return;
    }

    await loadProfile(data.user.id);
    setPassword("");
    setSubmitting(false);
  }

  async function sendPasswordReset(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    const { error: resetError } = await getSupabaseBrowserClient().auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/admin/reset-password`,
    });

    if (resetError) {
      setError("We could not send the reset email. Please try again shortly.");
      setSubmitting(false);
      return;
    }

    setResetSent(true);
    setSubmitting(false);
  }

  async function signOut() {
    await getSupabaseBrowserClient().auth.signOut();
    setProfile(null);
    setEmail("");
    setPassword("");
  }

  if (checking) {
    return <main className="admin-shell"><div className="admin-loading" role="status">Checking access…</div></main>;
  }

  if (!profile) {
    return <main className="admin-shell"><section className="admin-login" aria-labelledby="admin-login-title">
      <div className="admin-login__brand"><img src="/aaci-academy-logo.webp" alt=""/><span>AACI ASIA PACIFIC</span></div>
      <p className="admin-kicker">SECURE ADMINISTRATION</p>
      <h1 id="admin-login-title">{forgotPassword ? "Reset password." : "Welcome back."}</h1>
      <p>{forgotPassword ? "Enter your administrator email and we’ll send you a secure reset link." : "Sign in with your authorised AACI administrator account."}</p>
      {resetSent ? <div className="admin-reset-sent" role="status"><strong>Check your email.</strong><p>If an account exists for {email}, a password reset link has been sent.</p><button type="button" onClick={() => { setForgotPassword(false); setResetSent(false); }}>Return to sign in</button></div> :
      <form onSubmit={forgotPassword ? sendPasswordReset : signIn}>
        <label>Email address<input type="email" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} required/></label>
        {!forgotPassword && <label>Password<input type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required/></label>}
        {error && <p className="admin-error" role="alert">{error}</p>}
        <button className="button button-red" type="submit" disabled={submitting}>{submitting ? "Please wait…" : forgotPassword ? "Send reset link" : "Sign in"}</button>
        <button className="admin-forgot" type="button" onClick={() => { setForgotPassword(!forgotPassword); setError(""); }}>{forgotPassword ? "Back to sign in" : "Forgot password?"}</button>
      </form>}
    </section></main>;
  }

  return <div className="admin-workspace"><AdminSidebar active="dashboard" userLabel={profile.display_name ?? profile.email} role={profile.role} onSignOut={signOut} /><main className="admin-dashboard"><div className="admin-dashboard__header"><div><p className="admin-kicker">AACI CONTENT MANAGEMENT</p><h1>Administration</h1><p>Welcome back, {profile.display_name ?? profile.email}.</p></div></div>
    <section className="admin-module-grid" aria-label="Content modules">{modules.filter(([, , , permission]) => !permission || permissionsLoading || can(permission)).map(([title, description, href]) => <article key={title}><span>{href ? "AVAILABLE" : "COMING NEXT"}</span><h2>{title}</h2><p>{description}</p>{href ? <Link href={href}>Manage</Link> : <button type="button" disabled>Manage</button>}</article>)}</section>
  </main></div>;
}
