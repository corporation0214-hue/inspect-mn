"use client";

import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import ModuleCard from "@/components/dashboard/ModuleCard";
import CreateInspectionModal from "@/components/inspection/CreateInspectionModal";
import InspectionDetailModal from "@/components/inspection/InspectionDetailModal";
import InspectionKpiDetailModal from "@/components/inspection/InspectionKpiDetailModal";
import PlanEditModal from "@/components/inspection/PlanEditModal";

type Inspection = {
  id: string;
  organization_id?: string;
  title: string;
  type: string;
  category: string;
  status: string;
  notes?: string;
  inspection_date?: string;
  registered_by?: string;
  performed_by?: string;
  result_summary?: string;
  result_score?: number;
  result_status?: string;
};

type Finding = {
  id: string;
  inspection_id?: string;
  title: string;
  description?: string;
  category?: string;
  severity?: string;
  status?: string;
  owner?: string;
  due_date?: string;
};

type Plan = {
  id: string;
  inspection_type: string;
  planned_count: number;
  period: string;
};

const inspectionTypes = [
  { key: "government", label: "Төрийн ХШ" },
  { key: "internal", label: "Дотоод ХШ" },
  { key: "night", label: "Шөнийн ХШ" },
  { key: "joint", label: "Хамтарсан ХШ" },
  { key: "document", label: "Баримт бичгийн ХШ" },
];

function topCategories(findings: Finding[]) {
  const counts: Record<string, number> = {};

  findings.forEach((f) => {
    const category = f.category || "Бусад";
    counts[category] = (counts[category] || 0) + 1;
  });

  return Object.entries(counts)
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);
}

export default function InspectionClient({
  organizationId,
  inspections,
  findings,
  plans,
}: {
  organizationId: string;
  inspections: Inspection[];
  findings: Finding[];
  plans: Plan[];
}) {
  const [showModal, setShowModal] = useState(false);
  const [selectedInspection, setSelectedInspection] = useState<Inspection | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");
  const [planEditType, setPlanEditType] = useState<string | null>(null);

  const filteredInspections =
    filter === "all"
      ? inspections
      : inspections.filter((x) => x.type === filter || x.category === filter);

  

  function getPlanCount(type: string) {
    return plans.find((p) => p.inspection_type === type)?.planned_count ?? 0;
  }

  function getInspectionsByType(type: string) {
    return inspections.filter((x) => x.type === type);
  }

  function getFindingsByType(type: string) {
    const typeInspectionIds = getInspectionsByType(type).map((x) => x.id);
    return findings.filter((f) => typeInspectionIds.includes(f.inspection_id || ""));
  }

  function normalizeRisk(value: any) {
      return String(value || "").toLowerCase();
    }

    function riskLabel(value: string) {
      if (value === "critical") return "Ноцтой";
      if (value === "high") return "Өндөр";
      if (value === "medium") return "Дунд";
      if (value === "low") return "Бага";
      return "-";
    }

  function getInspectionRiskLevel(inspectionId: string) {
    const inspectionFindings = findings.filter(
      (f) => f.inspection_id === inspectionId
    );

    if (!inspectionFindings.length) return "-";

    const priorities = inspectionFindings.map((f) =>
      (f.severity || "").toLowerCase()
    );

    if (priorities.includes("critical")) return "Critical";
    if (priorities.includes("high")) return "High";
    if (priorities.includes("medium")) return "Medium";
    return "Low";
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold">Хяналт, шалгалт</h1>
            <p className="text-slate-500">
              Төлөвлөгөөт, төлөвлөгөөт бус, хамтарсан хяналт шалгалт
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="rounded-xl bg-blue-600 px-5 py-3 text-white"
          >
            + Шинэ ХШ
          </button>
        </div>

        {showModal && (
          <CreateInspectionModal
            organizationId={organizationId}
            onClose={() => setShowModal(false)}
          />
        )}

        {selectedInspection && (
          <InspectionDetailModal
            inspection={selectedInspection}
            onClose={() => setSelectedInspection(null)}
          />
        )}

        {selectedType && (
          <InspectionKpiDetailModal
            type={selectedType}
            label={inspectionTypes.find((x) => x.key === selectedType)?.label || selectedType}
            plannedCount={getPlanCount(selectedType)}
            inspections={getInspectionsByType(selectedType)}
            findings={getFindingsByType(selectedType)}
            onClose={() => setSelectedType(null)}
          />
        )}

        {planEditType && (
          <PlanEditModal
            organizationId={organizationId}
            inspectionType={planEditType}
            label={inspectionTypes.find((x) => x.key === planEditType)?.label || planEditType}
            currentPlannedCount={getPlanCount(planEditType)}
            onClose={() => setPlanEditType(null)}
          />
        )}

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {inspectionTypes.map((item) => {
            const typeInspections = getInspectionsByType(item.key);
            const typeFindings = getFindingsByType(item.key);
            const planned = getPlanCount(item.key);
            const done = typeInspections.length;
            const percent = planned > 0 ? Math.round((done / planned) * 100) : 0;
            const top3 = topCategories(typeFindings);

            return (
              <div key={item.key} className="rounded-2xl border bg-white p-5 shadow-sm">
                <div className="mb-3 flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-slate-950">{item.label}</h3>
                    <p className="text-sm text-slate-500">Төлөвлөгөө / гүйцэтгэл</p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedType(item.key)}
                      className="rounded-lg border px-2 py-1 text-sm hover:bg-slate-100"
                      title="Дэлгэрэнгүй"
                    >
                      ⛶
                    </button>

                    <button
                      onClick={() => setPlanEditType(item.key)}
                      className="rounded-lg border px-2 py-1 text-sm hover:bg-slate-100"
                      title="Төлөвлөгөө тохируулах"
                    >
                      ⚙
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-xl bg-slate-50 p-2">
                    <p className="text-xs text-slate-500">Төлөв.</p>
                    <p className="font-bold">{planned}</p>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-2">
                    <p className="text-xs text-slate-500">Хийгд.</p>
                    <p className="font-bold">{done}</p>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-2">
                    <p className="text-xs text-slate-500">Хувь</p>
                    <p className="font-bold">{percent}%</p>
                  </div>
                </div>

                <div className="mt-3 h-2 rounded-full bg-slate-100">
                  <div
                    className={`h-2 rounded-full ${
                      percent >= 80
                        ? "bg-green-600"
                        : percent >= 40
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                    style={{ width: `${Math.min(percent, 100)}%` }}
                  />
                </div>

                <div className="mt-4">
                  <p className="mb-2 text-xs font-semibold uppercase text-slate-500">
                    TOP 3 зөрчлийн ангилал
                  </p>

                  <div className="space-y-1 text-sm">
                    {top3.length === 0 && (
                      <p className="text-slate-400">Зөрчил бүртгэгдээгүй</p>
                    )}

                    {top3.map((x) => (
                      <div key={x.category} className="flex justify-between">
                        <span className="truncate">{x.category}</span>
                        <span className="font-bold">{x.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <ModuleCard title="Хяналт шалгалтын жагсаалт" description="Supabase-аас уншиж байна">
          <div className="mb-4 flex flex-wrap gap-2">
            {[
              { label: "Бүгд", value: "all" },
              { label: "Төрийн", value: "government" },
              { label: "Дотоод", value: "internal" },
              { label: "Шөнийн", value: "night" },
              { label: "Хамтарсан", value: "joint" },
              { label: "Баримт бичиг", value: "document" },
              { label: "Төлөвлөгөөт", value: "planned" },
              { label: "Төлөвлөгөөт бус", value: "unplanned" },
            ].map((item) => (
              <button
                key={item.value}
                onClick={() => setFilter(item.value)}
                className={`rounded-xl border px-4 py-2 text-sm ${
                  filter === item.value
                    ? "bg-blue-600 text-white"
                    : "bg-white text-slate-700"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="max-h-[360px] overflow-auto rounded-xl border">
           <table className="min-w-[1100px] w-full text-sm">
              <thead className="bg-slate-100">
                <tr>
                  {[
                      "Нэр",
                      "Төрөл",
                      "Төлөв",
                      "Эрсдэлийн зэрэг",
                      "Ангилал",
                      "Огноо",
                      "Бүртгэсэн",
                      "Гүйцэтгэсэн",
                    ].map(
                    (col) => (
                      <th key={col} className="border px-4 py-3 text-left font-medium">
                        {col}
                      </th>
                    )
                  )}
                </tr>
              </thead>

              <tbody>
                {filteredInspections.map((x) => (
                  <tr
                    key={x.id}
                    onClick={() => setSelectedInspection(x)}
                    className="cursor-pointer hover:bg-blue-50"
                  >
                    <td className="border px-4 py-3">{x.title}</td>
                    <td className="border px-4 py-3">{x.type}</td>
                    <td className="border px-4 py-3">{x.status}</td>
                    <td className="border px-4 py-3">{getInspectionRiskLevel(x.id)}</td>
                    <td className="border px-4 py-3">{x.category}</td>
                    <td className="border px-4 py-3">{x.inspection_date || "-"}</td>
                    <td className="border px-4 py-3">{x.registered_by || "-"}</td>
                    <td className="border px-4 py-3">{x.performed_by || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ModuleCard>
      </div>
    </DashboardLayout>
  );
}