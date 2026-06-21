import DashboardLayout from "@/components/layout/DashboardLayout";
import { createClient } from "@/lib/supabase/server";
import VoiceClient from "./VoiceClient";

export default async function VoicePage() {
  const supabase = await createClient();

  const { data: org } = await supabase
    .from("organizations")
    .select("*")
    .eq("code", "BAYANGOL")
    .maybeSingle();

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