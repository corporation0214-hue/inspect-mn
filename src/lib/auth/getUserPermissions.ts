import { createClient } from "@/lib/supabase/server";

export async function getUserPermissions(userId: string) {
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();

  if (!profile?.role) return [];

  const { data } = await supabase
    .from("role_permissions")
    .select("permission_code")
    .eq("role_name", profile.role);

  return (data || []).map((x) => x.permission_code);
}