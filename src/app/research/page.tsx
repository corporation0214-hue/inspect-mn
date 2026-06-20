import DashboardLayout from "@/components/layout/DashboardLayout";
import { createClient } from "@/lib/supabase/server";
import ResearchClient from "./ResearchClient";

export default async function ResearchPage() {
  const supabase = await createClient();

  const { data: org } = await supabase
    .from("organizations")
    .select("*")
    .eq("code", "BAYANGOL")
    .maybeSingle();

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