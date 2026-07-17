import DashboardLayout from "@/components/layout/DashboardLayout";
import DashboardClient from "./DashboardClient";
import { createClient } from "@/lib/supabase/server";
import { getCurrentOrganization } from "@/lib/auth/getCurrentOrganization";

export default async function DashboardPage() {
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

  const { data: riskPlans } = await supabase
    .from("risk_action_plans")
    .select("*")
    .eq("organization_id", orgId)
    .order("created_at", { ascending: false });

  const [
    inspectionsRes,
    findingsRes,
    complianceRes,
    voiceRes,
    researchRes,
  ] = await Promise.all([
    supabase.from("inspections").select("*") .eq("organization_id", organizationId) .order("created_at", { ascending: false }),
    supabase.from("findings").select("*") .eq("organization_id", organizationId) .order("created_at", { ascending: false }),
    supabase.from("compliance_items").select("*") .eq("organization_id", organizationId) .order("created_at", { ascending: false }),
    supabase.from("employee_voice").select("*") .eq("organization_id", organizationId) .order("created_at", { ascending: false }),
    supabase.from("research_projects").select("*") .eq("organization_id", organizationId) .order("created_at", { ascending: false }),
  ]);

  return (
    <DashboardLayout>
      <DashboardClient
        org={org}
        orgId={orgId}
        inspections={inspectionsRes.data || []}
        findings={findingsRes.data || []}
        complianceItems={complianceRes.data || []}
        employeeVoices={voiceRes.data || []}
        researchProjects={researchRes.data || []}
        plans={riskPlans || []}
      />
    
    </DashboardLayout>
  );
}