import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

let browserClient: ReturnType<typeof createClient<Database>> | undefined;

export function getSupabaseBrowserClient() {
  if (browserClient) return browserClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !publishableKey) {
    throw new Error("Supabase environment variables are not configured.");
  }

  browserClient = createClient<Database>(url, publishableKey);
  return browserClient;
}
