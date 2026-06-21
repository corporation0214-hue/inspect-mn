import DashboardLayout from "@/components/layout/DashboardLayout";
import { createClient } from "@/lib/supabase/server";
import ComplianceClient from "./ComplianceClient";

export default async function CompliancePage() {
  const supabase = await createClient();

  const { data: org } = await supabase
    .from("organizations")
    .select("*")
    .eq("code", "BAYANGOL")
    .maybeSingle();

  const orgId = org?.id;

  const { data: items } = await supabase
    .from("compliance_items")
    .select("*")
    .eq("organization_id", orgId)
    .order("created_at", { ascending: false });

  return (
    <DashboardLayout>
      <ComplianceClient
        organizationId={orgId}
        items={items || []}
      />
    </DashboardLayout>
  );
}