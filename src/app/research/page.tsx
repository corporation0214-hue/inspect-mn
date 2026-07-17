import DashboardLayout from "@/components/layout/DashboardLayout";
import { createClient } from "@/lib/supabase/server";
import ResearchClient from "./ResearchClient";
import { getCurrentOrganization } from "@/lib/auth/getCurrentOrganization";

export default async function ResearchPage() {
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

  const orgId = org?.id;

  const { data: projects } = await supabase
    .from("research_projects")
    .select("*")
    .eq("organization_id", orgId)
    .order("created_at", { ascending: false });

  return (
    <DashboardLayout>
      <ResearchClient
        projects={projects || []}
        organizationId={orgId}
      />
    </DashboardLayout>
  );
}