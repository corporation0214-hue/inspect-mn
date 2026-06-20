import DashboardLayout from "@/components/layout/DashboardLayout";
import ModuleCard from "@/components/dashboard/ModuleCard";
import SimpleTable from "@/components/dashboard/SimpleTable";
import { createClient } from "@/lib/supabase/server";

export default async function ResearchPage() {
  const supabase = await createClient();

  const { data: org } = await supabase
    .from("organizations")
    .select("*")
    .eq("code", "BAYANGOL")
    .maybeSingle();

  const orgId = org?.id;

  const { data: projectsData } = await supabase
    .from("research_projects")
    .select("*")
    .eq("organization_id", orgId);

  const projects = projectsData ?? [];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Research & Development</h1>
          <p className="text-slate-500">
            Судалгаа, туршилт, инноваци, цахим шилжилтийн төслүүд
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <ModuleCard title="Нийт төсөл" description="R&D portfolio">
            <div className="text-3xl font-bold">{projects.length}</div>
          </ModuleCard>

          <ModuleCard title="Pilot" description="Туршилтын шат">
            <div className="text-3xl font-bold">
              {projects.filter((x) => x.stage === "pilot").length}
            </div>
          </ModuleCard>

          <ModuleCard title="Development" description="Хөгжүүлэлт">
            <div className="text-3xl font-bold">
              {projects.filter((x) => x.stage === "development").length}
            </div>
          </ModuleCard>

          <ModuleCard title="Idea" description="Санааны шат">
            <div className="text-3xl font-bold">
              {projects.filter((x) => x.stage === "idea").length}
            </div>
          </ModuleCard>
        </div>

        <ModuleCard title="Research Portfolio" description="Supabase-аас уншиж байна">
          <SimpleTable
            columns={["Төсөл", "Шат", "Явц"]}
            rows={projects.map((x) => ({
              Төсөл: x.title,
              Шат: x.stage,
              Явц: `${x.progress}%`,
            }))}
          />
        </ModuleCard>
      </div>
    </DashboardLayout>
  );
}