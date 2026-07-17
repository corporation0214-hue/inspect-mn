import DashboardLayout from "@/components/layout/DashboardLayout";
import { createClient } from "@/lib/supabase/server";
import ReportsClient from "./ReportsClient";
import { getCurrentOrganization } from "@/lib/auth/getCurrentOrganization";

export default async function ReportsPage() {
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

  const { data: inspections } = await supabase
    .from("inspections")
    .select("*")
    .eq("organization_id", orgId)
    .order("created_at", { ascending: false });

  const { data: findings } = await supabase
    .from("findings")
    .select("*")
    .eq("organization_id", orgId)
    .order("created_at", { ascending: false });

  const { data: compliance } = await supabase
    .from("compliance_items")
    .select("*")
    .eq("organization_id", orgId)
    .order("created_at", { ascending: false });

  const { data: research } = await supabase
    .from("research_projects")
    .select("*")
    .eq("organization_id", orgId)
    .order("created_at", { ascending: false });

  const { data: employeeVoices } = await supabase
    .from("employee_voice")
    .select("*")
    .eq("organization_id", orgId)
    .order("created_at", { ascending: false });

  return (
    <DashboardLayout>
      <ReportsClient
        inspections={inspections ?? []}
        findings={findings ?? []}
        compliance={compliance ?? []}
        research={research ?? []}
        voice={employeeVoices ?? []}
      />
    </DashboardLayout>
  );
}