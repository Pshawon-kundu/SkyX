/**
 * Supabase Client Utility
 * Initialized with service role key for server-side operations
 */

import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL || "";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

export const isSupabaseConfigured = Boolean(
  SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY,
);

if (!isSupabaseConfigured) {
  console.warn(
    "[WARN] Supabase env vars not configured. Auth sync is disabled.",
  );
}

export const supabaseClient = isSupabaseConfigured
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null;

export interface VerifiedSupabaseUser {
  userId: string;
  email: string;
  fullName?: string;
}

/**
 * Verify Supabase JWT token and extract user ID
 */
export const verifySupabaseToken = async (
  token: string,
): Promise<VerifiedSupabaseUser | null> => {
  if (!supabaseClient) {
    console.warn("[WARN] Cannot verify Supabase token without server env vars");
    return null;
  }

  try {
    const { data, error } = await supabaseClient.auth.getUser(token);
    if (error || !data.user) {
      console.warn("[WARN] Failed to verify Supabase token:", error?.message);
      return null;
    }

    const metadata = data.user.user_metadata || {};
    const fullName =
      typeof metadata.full_name === "string"
        ? metadata.full_name
        : typeof metadata.name === "string"
          ? metadata.name
          : typeof metadata.user_name === "string"
            ? metadata.user_name
            : undefined;

    return {
      userId: data.user.id,
      email: data.user.email || "",
      fullName,
    };
  } catch (err) {
    console.error("Error verifying Supabase token:", err);
    return null;
  }
};
