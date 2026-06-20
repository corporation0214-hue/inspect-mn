import DashboardLayout from "@/components/layout/DashboardLayout";
import KpiCard from "@/components/dashboard/KpiCard";
import ModuleCard from "@/components/dashboard/ModuleCard";
import SimpleTable from "@/components/dashboard/SimpleTable";
import { createClient } from "@/lib/supabase/server";

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


  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Ерөнхий самбар</h1>
          <p className="text-slate-500">
            {org?.name || "Байгууллага"} — Supabase өгөгдөлтэй dashboard
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
          <KpiCard title="Хяналт шалгалт" value={String(totalInspections)} />
          <KpiCard title="Илэрсэн зөрчил" value={String(totalFindings)} />
          <KpiCard title="Арга хэмжээний биелэлт" value={`${actionRate}%`} />
          <KpiCard title="Журмын хэрэгжилт" value={`${avgCompliance}%`} />
          <KpiCard title="Employee Voice" value={String(voice.length)} />
          <KpiCard title="Өндөр эрсдэл" value={String(highRisk)} />
        </div>

        <div className="grid gap-4 xl:grid-cols-3">
          <ModuleCard title="Эрсдэлийн матриц" description="Магадлал × Үр нөлөө">
            <div className="grid grid-cols-5 gap-1">
              {Array.from({ length: 25 }).map((_, i) => (
                <div
                  key={i}
                  className={`h-12 rounded ${
                    i > 18
                      ? "bg-red-200"
                      : i > 11
                      ? "bg-orange-200"
                      : i > 5
                      ? "bg-yellow-200"
                      : "bg-green-200"
                  }`}
                />
              ))}
            </div>
          </ModuleCard>

          <ModuleCard title="Хяналт шалгалтын явц" description="Supabase-аас уншив">
            <SimpleTable
              columns={["Нэр", "Төрөл", "Төлөв", "Ангилал"]}
              rows={inspections.map((x) => ({
                Нэр: x.title,
                Төрөл: x.type,
                Төлөв: x.status,
                Ангилал: x.category,
              }))}
            />
          </ModuleCard>

          <ModuleCard title="AI Executive Summary" description="Өнөөдрийн товч дүгнэлт">
            <div className="space-y-3 text-sm text-slate-700">
              <p>• Нийт {totalInspections} хяналт шалгалт бүртгэлтэй байна.</p>
              <p>• Нийт {totalFindings} зөрчил илэрсэн байна.</p>
              <p>• Журмын дундаж хэрэгжилт {avgCompliance}% байна.</p>
              <p>• Өндөр эрсдэлтэй {highRisk} журам байна.</p>
            </div>
          </ModuleCard>
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          <ModuleCard title="Журмын хэрэгжилт" description="Compliance items">
            <SimpleTable
              columns={["Журам", "Хариуцагч", "Биелэлт", "Эрсдэл"]}
              rows={compliance.map((x) => ({
                Журам: x.title,
                Хариуцагч: x.owner_department || "-",
                Биелэлт: `${x.compliance_score}%`,
                Эрсдэл: x.risk_level,
              }))}
            />
          </ModuleCard>

          <ModuleCard title="Employee Voice" description="Ажилтны санал, хүсэлт, зөрчил">
            <SimpleTable
              columns={["Гарчиг", "Төрөл", "Төлөв"]}
              rows={voice.map((x) => ({
                Гарчиг: x.title,
                Төрөл: x.type,
                Төлөв: x.status,
              }))}
            />
          </ModuleCard>
        </div>
      </div>
    </DashboardLayout>
  );
}