import DashboardLayout from "@/components/layout/DashboardLayout";
import { createClient } from "@/lib/supabase/server";
import ComplianceClient from "./ComplianceClient";
import { getCurrentOrganization } from "@/lib/auth/getCurrentOrganization";

export default async function CompliancePage() {
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