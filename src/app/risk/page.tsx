import DashboardLayout from "@/components/layout/DashboardLayout";
import { createClient } from "@/lib/supabase/server";
import RiskClient from "./RiskClient";

export default async function RiskPage() {
  const supabase = await createClient();

  const { data: org } = await supabase
    .from("organizations")
    .select("*")
    .eq("code", "BAYANGOL")
    .maybeSingle();

  const orgId = org?.id ?? "";

  const { data: findings } = await supabase
    .from("findings")
    .select("*")
    .eq("organization_id", orgId)
    .order("created_at", { ascending: false });

  const { data: employeeVoices } = await supabase
    .from("employee_voice")
    .select("*")
    .eq("organization_id", orgId)
    .order("created_at", { ascending: false });

  const { data: inspections } = await supabase
    .from("inspections")
    .select("*")
    .eq("organization_id", orgId)
    .order("created_at", { ascending: false });

  const { data: plans } = await supabase
    .from("risk_action_plans")
    .select("*")
    .eq("organization_id", orgId)
    .order("created_at", { ascending: false });

  return (
    <DashboardLayout>

      <RiskClient
        organizationId={orgId}
        findings={findings || []}
        inspections={inspections || []}
        employeeVoices={employeeVoices || []}
        plans={plans || []}
      />

    </DashboardLayout>

    
  );
}