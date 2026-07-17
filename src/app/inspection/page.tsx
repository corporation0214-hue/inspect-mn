import { createClient } from "@/lib/supabase/server";
import InspectionClient from "./InspectionClient";
import { getCurrentOrganization } from "@/lib/auth/getCurrentOrganization";

export default async function InspectionPage() {
  const supabase = await createClient();

  const {
    organization: org,
    organizationId,
  } = await getCurrentOrganization();

  if (!organizationId) {
    return (
      <div className="p-6">
        Таны хэрэглэгчид байгууллага оноогоогүй байна.
      </div>
    );
  }

  const orgId = org?.id ?? "";

  const { data: inspectionsData } = await supabase
    .from("inspections")
    .select("*")
    .eq("organization_id", orgId)
    .order("created_at", { ascending: false });

  const { data: findingsData } = await supabase
    .from("findings")
    .select("*")
    .eq("organization_id", orgId)
    .order("created_at", { ascending: false });

  const { data: plansData } = await supabase
    .from("inspection_plans")
    .select("*")
    .eq("organization_id", orgId)
    .eq("period", "2026");

  return (
    <InspectionClient
      organizationId={orgId}
      inspections={inspectionsData ?? []}
      findings={findingsData ?? []}
      plans={plansData ?? []}
    />
  );
}