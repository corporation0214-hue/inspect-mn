import DashboardLayout from "@/components/layout/DashboardLayout";
import KpiCard from "@/components/dashboard/KpiCard";
import ModuleCard from "@/components/dashboard/ModuleCard";
import SimpleTable from "@/components/dashboard/SimpleTable";
import { createClient } from "@/lib/supabase/server";
import InspectionAnalytics from "@/components/dashboard/InspectionAnalytics";
import AIExecutiveSummary from "@/components/dashboard/AIExecutiveSummary";
import RiskMatrix from "@/components/dashboard/RiskMatrix";
import ComplianceChart from "@/components/dashboard/ComplianceChart";
import EmployeeVoiceChart from "@/components/dashboard/EmployeeVoiceChart";

export default async function DashboardPage() {
  const supabase = await createClient();
  
  const { data: org, error: orgError } = await supabase
    .from("organizations")
    .select("*")
    .eq("code", "BAYANGOL")
    .maybeSingle();

  console.log("ORG ERROR:", orgError);
  console.log("ORG:", org);

  const orgId = org?.id;

  if (!orgId) {
    return (
      <DashboardLayout>
        <div className="p-6">Organization BAYANGOL not found</div>
      </DashboardLayout>
    );
  }

    const { data: inspectionsData } = await supabase
  .from("inspections")
  .select("*")
  .eq("organization_id", orgId);

  const { data: findingsData } = await supabase
    .from("findings")
    .select("*")
    .eq("organization_id", orgId);

  const { data: actionsData } = await supabase
    .from("corrective_actions")
    .select("*")
    .eq("organization_id", orgId);

  const { data: complianceData } = await supabase
    .from("compliance_items")
    .select("*")
    .eq("organization_id", orgId);

  const { data: voiceData } = await supabase
    .from("employee_voice")
    .select("*")
    .eq("organization_id", orgId);

  const inspections = inspectionsData ?? [];
  const findings = findingsData ?? [];
  const actions = actionsData ?? [];
  const compliance = complianceData ?? [];
  const voice = voiceData ?? [];
  const totalInspections = inspections?.length ?? 0;
  const totalFindings = findings?.length ?? 0;

  const closedActions =
    actions?.filter((x) => x.status === "closed").length ?? 0;

  const actionRate =
    actions && actions.length > 0
      ? Math.round((closedActions / actions.length) * 100)
      : 0;

  const avgCompliance =
    compliance && compliance.length > 0
      ? Math.round(
          compliance.reduce(
            (sum, x) => sum + Number(x.compliance_score || 0),
            0
          ) / compliance.length
        )
      : 0;

  const highRisk =
    compliance?.filter((x) => x.risk_level === "high").length ?? 0;

  const { data: dashboardFindings } = await supabase
    .from("findings")
    .select("*");

  const { data: complianceItems } = await supabase
    .from("compliance_items")
    .select("*");

  const { data: employeeVoices } = await supabase
    .from("employee_voice")
    .select("*");

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Ерөнхий самбар
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            {org?.name || "Байгууллага"} — DB өгөгдөлтэй dashboard
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <KpiCard title="Хяналт шалгалт" value={String(totalInspections)} />
          <KpiCard title="Илэрсэн зөрчил" value={String(totalFindings)} />
          <KpiCard title="Арга хэмжээний биелэлт" value={`${actionRate}%`} />
          <KpiCard title="Журмын хэрэгжилт" value={`${avgCompliance}%`} />
          <KpiCard title="Employee Voice" value={String(voice.length)} />
          <KpiCard title="Өндөр эрсдэл" value={String(highRisk)} />
        </div>

        <ModuleCard
          title="AI Executive Summary"
          description="Өнөөдрийн удирдлагын товч дүгнэлт"
        >
          <AIExecutiveSummary />
        </ModuleCard>

        <div className="grid gap-4 xl:grid-cols-2">
          

          <ModuleCard
            title="Хяналт шалгалтын аналитик"
            description="Төрөл, төлөвлөгөө, зөрчлийн харьцуулалт"
          >
            <InspectionAnalytics
              inspections={inspections}
              findings={findings}
            />
          </ModuleCard>
           <ModuleCard title="" description="">
            <ComplianceChart items={complianceItems || []} />
          </ModuleCard>
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
         
         <ModuleCard title="" description="">
            <EmployeeVoiceChart voices={employeeVoices || []} />
          </ModuleCard>
         <ModuleCard title="" description="">
            <RiskMatrix
              findings={dashboardFindings || []}
              voices={employeeVoices || []}
            />
          </ModuleCard>

          
        </div>
      </div>
    </DashboardLayout>
  );
}