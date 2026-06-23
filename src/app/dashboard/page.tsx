import DashboardLayout from "@/components/layout/DashboardLayout";
import DashboardClient from "./DashboardClient";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data: org } = await supabase
    .from("organizations")
    .select("*")
    .eq("code", "BAYANGOL")
    .maybeSingle();

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
    supabase.from("inspections").select("*").order("created_at", { ascending: false }),
    supabase.from("findings").select("*").order("created_at", { ascending: false }),
    supabase.from("compliance_items").select("*").order("created_at", { ascending: false }),
    supabase.from("employee_voice").select("*").order("created_at", { ascending: false }),
    supabase.from("research_projects").select("*").order("created_at", { ascending: false }),
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