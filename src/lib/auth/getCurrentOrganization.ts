import { createClient } from "@/lib/supabase/server";

export async function getCurrentOrganization() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      user: null,
      profile: null,
      organization: null,
      organizationId: null,
    };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select(`
      id,
      full_name,
      email,
      role,
      status,
      organization_id,
      organizations (
        id,
        name,
        code,
        industry,
        status
      )
    `)
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    console.error("PROFILE FETCH ERROR:", profileError.message);

    return {
      user,
      profile: null,
      organization: null,
      organizationId: null,
    };
  }

  const organization = Array.isArray(profile?.organizations)
    ? profile.organizations[0]
    : profile?.organizations;

  return {
    user,
    profile,
    organization: organization ?? null,
    organizationId: profile?.organization_id ?? null,
  };
}