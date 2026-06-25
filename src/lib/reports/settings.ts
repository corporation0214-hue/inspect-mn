import { adminSupabase } from "@/lib/supabase/admin";

export async function getSystemSettings() {
  const { data, error } = await adminSupabase
    .from("system_settings")
    .select("*");

  if (error) throw new Error(error.message);

  const settings = Object.fromEntries(
    (data ?? []).map((x: any) => [x.key, x.value])
  );

  return {
    raw: settings,
    get: (key: string, fallback = "") => settings[key] ?? fallback,
    enabled: (key: string, fallback = "true") =>
      (settings[key] ?? fallback) === "true",
  };
}