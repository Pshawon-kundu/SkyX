import { createClient } from "@supabase/supabase-js";

export const AUTH_STORAGE_KEY = "skyx_auth";
export const AUTH_CHANGED_EVENT = "skyx-auth-changed";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabaseConfigError =
  !SUPABASE_URL || !SUPABASE_ANON_KEY
    ? "Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env."
    : null;

export const supabase = supabaseConfigError
  ? null
  : createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        autoRefreshToken: true,
        detectSessionInUrl: true,
        persistSession: true,
      },
    });

const emitAuthChanged = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
  }
};

export function getStoredAuth() {
  if (typeof window === "undefined") return null;

  try {
    const value = window.localStorage.getItem(AUTH_STORAGE_KEY);
    return value ? JSON.parse(value) : null;
  } catch {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
}

export function persistAuth(payload) {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(payload));
  emitAuthChanged();
}

export function clearStoredAuth() {
  if (typeof window === "undefined") return;

  window.localStorage.removeItem(AUTH_STORAGE_KEY);
  emitAuthChanged();
}

export function getAuthHeaders() {
  const auth = getStoredAuth();
  return auth?.token ? { Authorization: `Bearer ${auth.token}` } : {};
}
