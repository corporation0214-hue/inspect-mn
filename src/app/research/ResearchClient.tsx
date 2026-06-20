"use client";

import { useState } from "react";
import ModuleCard from "@/components/dashboard/ModuleCard";
import ResearchProjectModal from "@/components/research/ResearchProjectModal";
import ResearchKpiDetailModal from "@/components/research/ResearchKpiDetailModal";

export default function ResearchClient({
  projects,
  organizationId,
}: {
  projects: any[];
  organizationId: string;
}) {
  const [selected, setSelected] = useState<any>(null);
  const [selectedKpi, setSelectedKpi] = useState<string | null>(null);
  const [createMode, setCreateMode] = useState(false);

  const activeCount =
    projects.filter((x) => x.status === "active").length;

  const completedCount =
    projects.filter((x) => x.status === "completed").length;

  const highPriority =
    projects.filter((x) => x.priority === "high").length;

  const stalledCount = projects.filter(
  (x) => x.status === "hold" || x.issue || x.pending_decision
  ).length;

  const urgentCount = projects.filter((x) => x.is_urgent === true).length;

  const activeProjects = projects.filter((x) => x.status === "active");
  const completedProjects = projects.filter((x) => x.status === "completed");
  const highPriorityProjects = projects.filter((x) => x.priority === "high");
  const stalledProjects = projects.filter(
    (x) => x.status === "hold" || x.issue || x.pending_decision
  );
  const urgentProjects = projects.filter((x) => x.is_urgent === true);

  const kpiProjects: Record<string, any[]> = {
    total: projects,
    active: activeProjects,
    completed: completedProjects,
    high: highPriorityProjects,
    stalled: stalledProjects,
    urgent: urgentProjects,
  };

  const kpiTitles: Record<string, string> = {
    total: "Нийт төсөл",
    active: "Идэвхтэй төслүүд",
    completed: "Дууссан төслүүд",
    high: "Өндөр ач холбогдолтой төслүүд",
    stalled: "Тулгамдсан / хүлээгдэж буй төслүүд",
    urgent: "Нэн яаралтай төслүүд",
  };
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Research & Development
          </h1>
          <p className="text-slate-500">
            Судалгаа, инноваци, хөгжүүлэлтийн төслүүд
          </p>
        </div>

        <button
          onClick={() => setCreateMode(true)}
          className="rounded-xl bg-blue-600 px-5 py-3 text-white"
        >
          + Шинэ төсөл
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
        {[
          {
            key: "total",
            title: "Нийт төсөл",
            value: projects.length,
            color: "text-slate-950",
          },
          {
            key: "active",
            title: "Идэвхтэй",
            value: activeCount,
            color: "text-blue-600",
          },
          {
            key: "completed",
            title: "Дууссан",
            value: completedCount,
            color: "text-green-600",
          },
          {
            key: "high",
            title: "Өндөр ач холбогдол",
            value: highPriority,
            color: "text-red-600",
          },
          {
            key: "stalled",
            title: "Тулгамдсан / хүлээгдэж буй",
            value: stalledCount,
            color: "text-orange-600",
          },
          {
            key: "urgent",
            title: "Нэн яаралтай",
            value: urgentCount,
            color: "text-red-700",
          },
        ].map((kpi) => (
          <div key={kpi.key} className="rounded-2xl border bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-start justify-between">
              <h3 className="font-semibold text-slate-950">{kpi.title}</h3>

              <button
                onClick={() => setSelectedKpi(kpi.key)}
                className="rounded-lg border px-2 py-1 text-sm hover:bg-slate-100"
                title="Дэлгэрэнгүй"
              >
                ⛶
              </button>
            </div>

            <div className={`text-3xl font-bold ${kpi.color}`}>{kpi.value}</div>
            <p className="mt-2 text-xs text-slate-500">Дэлгэрэнгүй харах боломжтой</p>
          </div>
        ))}
      </div>

        
      <ModuleCard
        title="Судалгааны төслүүд"
        description="Supabase-аас уншиж байна"
        >
        <div className="max-h-[520px] overflow-y-auto rounded-xl border">

            <table className="w-full text-sm">
            <thead className="sticky top-0 bg-white">
                <tr className="border-b">
                <th className="p-3 text-left">Нэр</th>
                <th className="p-3 text-left">Ангилал</th>
                <th className="p-3 text-left">Төлөв</th>
                <th className="p-3 text-left">Явц</th>
                <th className="p-3 text-left">Эхлэх</th>
                <th className="p-3 text-left">Дуусах</th>
                <th className="p-3 text-left">Хариуцагч</th>
                </tr>
            </thead>

            <tbody>
                {projects.map((p) => (
                <tr
                    key={p.id}
                    onClick={() => setSelected(p)}
                    className="cursor-pointer border-b hover:bg-slate-50"
                >
                    <td className="p-3">{p.title}</td>
                    <td className="p-3">{p.category || "-"}</td>
                    <td className="p-3">{p.status || "-"}</td>
                    <td className="p-3">{p.progress || 0}%</td>
                    <td className="p-3">{p.start_date || "-"}</td>
                    <td className="p-3">
                    {p.extended_end_date || p.end_date || "-"}
                    </td>
                    <td className="p-3">{p.owner || "-"}</td>
                </tr>
                ))}
            </tbody>
            </table>

        </div>
        </ModuleCard>

      {(selected || createMode) && (
        <ResearchProjectModal
          organizationId={organizationId}
          project={selected}
          createMode={createMode}
          onClose={() => {
            setSelected(null);
            setCreateMode(false);
            location.reload();
          }}
        />
       
      )}

      {selectedKpi && (
        <ResearchKpiDetailModal
          title={kpiTitles[selectedKpi]}
          description="Төслийн дэлгэрэнгүй мэдээлэл, явц, хүндрэл, хүлээгдэж буй шийдвэр"
          projects={kpiProjects[selectedKpi] || []}
          onClose={() => setSelectedKpi(null)}
        />
      )}
    </div>
  );
}