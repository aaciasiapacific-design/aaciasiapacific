"use client";

import { FormEvent, useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "../../../lib/supabase/client";

export default function ResetPasswordPage() {
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();

    supabase.auth.getSession().then(({ data }) => setReady(Boolean(data.session)));
    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") setReady(true);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  async function updatePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (password.length < 10) {
      setError("Password must be at least 10 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSaving(true);
    const supabase = getSupabaseBrowserClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });

    if (updateError) {
      setError("This reset link is invalid or has expired. Please request a new one.");
      setSaving(false);
      return;
    }

    await supabase.auth.signOut();
    setComplete(true);
    setSaving(false);
  }

  return <main className="admin-shell"><section className="admin-login" aria-labelledby="reset-title">
    <div className="admin-login__brand"><img src="/aaci-academy-logo.webp" alt=""/><span>AACI ASIA PACIFIC</span></div>
    <p className="admin-kicker">SECURE ADMINISTRATION</p>
    {complete ? <div className="admin-reset-complete"><h1 id="reset-title">Password updated.</h1><p>Your password has been changed successfully. You can now sign in with your new password.</p><a className="button button-red" href="/admin">Return to sign in</a></div> : <>
      <h1 id="reset-title">Create a new password.</h1>
      <p>Use at least 10 characters and avoid a password used on another service.</p>
      {!ready ? <div className="admin-error" role="alert">This reset link is invalid or has expired. <a href="/admin">Request a new link</a>.</div> : <form onSubmit={updatePassword}>
        <label>New password<input type="password" autoComplete="new-password" minLength={10} value={password} onChange={(event) => setPassword(event.target.value)} required/></label>
        <label>Confirm new password<input type="password" autoComplete="new-password" minLength={10} value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} required/></label>
        {error && <p className="admin-error" role="alert">{error}</p>}
        <button className="button button-red" type="submit" disabled={saving}>{saving ? "Updating…" : "Update password"}</button>
      </form>}
    </>}
  </section></main>;
}
