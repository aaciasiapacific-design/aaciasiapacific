"use client";

import { useCallback, useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "./supabase/client";

export type PermissionKey = `${string}.${string}`;

export function useAdminPermissions() {
  const [permissions, setPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const { data, error } = await getSupabaseBrowserClient().rpc("get_my_permissions");
    setPermissions(error ? [] : (data ?? []));
    setLoading(false);
  }, []);

  useEffect(() => {
    // Loading the current user's database-backed permissions is the effect's purpose.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refresh();
  }, [refresh]);

  const can = useCallback((permission: PermissionKey | string) => permissions.includes(permission), [permissions]);
  return { permissions, can, loading, refresh };
}

export function makeRoleSlug(name: string) {
  return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 48);
}
