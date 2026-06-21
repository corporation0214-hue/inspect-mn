import DashboardLayout from "@/components/layout/DashboardLayout";
import { createClient } from "@/lib/supabase/server";
import ReportsClient from "./ReportsClient";

export default async function ReportsPage() {
  const supabase = await createClient();

  const { data: org } = await supabase
    .from("organizations")
    .select("*")
    .eq("code", "BAYANGOL")
    .maybeSingle();

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

  return (
    <DashboardLayout>
      <ReportsClient
        inspections={inspections ?? []}
        findings={findings ?? []}
        compliance={compliance ?? []}
        research={research ?? []}
      />
    </DashboardLayout>
  );
}