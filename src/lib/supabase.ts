import { createClient, SupabaseClient } from "@supabase/supabase-js";

let supabaseClient: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  // Only initialize in browser
  if (typeof window === "undefined") {
    throw new Error("Supabase client can only be used in the browser");
  }

  if (!supabaseClient) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error(
        "Missing Supabase environment variables. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your .env.local file"
      );
    }

    supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
  }

  return supabaseClient;
}

// Lazy proxy that only initializes when accessed
export const supabase = new Proxy(
  {},
  {
    get: (_target, prop: string | symbol) => {
      const client = getSupabaseClient();
      return (client as any)[prop];
    },
  }
) as any;

export type Bookmark = {
  id: string;
  user_id: string;
  url: string;
  title: string;
  created_at: string;
};
