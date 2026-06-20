import { createClient } from "@/lib/supabase/server";
import InspectionClient from "./InspectionClient";

export default async function InspectionPage() {
  const supabase = await createClient();

  const { data: org } = await supabase
    .from("organizations")
    .select("*")
    .eq("code", "BAYANGOL")
    .maybeSingle();

  const orgId = org?.id ?? "";

  const { data: inspectionsData } = await supabase
    .from("inspections")
    .select("*")
    .eq("organization_id", orgId)
    .order("created_at", { ascending: false });

  return (
    <InspectionClient
      organizationId={orgId}
      inspections={inspectionsData ?? []}
    />
  );
}