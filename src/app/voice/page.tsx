import DashboardLayout from "@/components/layout/DashboardLayout";
import { createClient } from "@/lib/supabase/server";
import VoiceClient from "./VoiceClient";
import { getCurrentOrganization } from "@/lib/auth/getCurrentOrganization";

export default async function VoicePage() {
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

  const { data: voice } = await supabase
    .from("employee_voice")
    .select("*")
    .eq("organization_id", orgId)
    .order("created_at", { ascending: false });

  return (
    <DashboardLayout>
      <VoiceClient organizationId={orgId} items={voice ?? []} />
    </DashboardLayout>
  );
}