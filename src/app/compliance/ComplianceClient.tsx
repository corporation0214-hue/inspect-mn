"use client";

import { useState } from "react";
import ModuleCard from "@/components/dashboard/ModuleCard";
import ComplianceItemModal from "@/components/compliance/ComplianceItemModal";
import ComplianceKpiDetailModal from "@/components/compliance/ComplianceKpiDetailModal";

export default function ComplianceClient({
  items,
  organizationId,
}: {
  items: any[];
  organizationId: string;
}) {
  const [selected, setSelected] = useState<any>(null);
  const [createMode, setCreateMode] = useState(false);
  const [selectedKpi, setSelectedKpi] = useState<string | null>(null);

  const activeItems = items.filter((x) => x.status === "active");
  const highRiskItems = items.filter((x) => x.risk_level === "high");
  const reviewItems = items.filter((x) => x.status === "review");
  const [typeFilter, setTypeFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const avgScore =
    items.length > 0
      ? Math.round(items.reduce((sum, x) => sum + Number(x.compliance_score || 0), 0) / items.length)
      : 0;

  const departments = Array.from(
    new Set(items.map((x) => x.owner_department).filter(Boolean))
  );

  const filteredItems = items.filter((item) => {
    const matchType =
      typeFilter === "all" || item.item_type === typeFilter;

    const matchDepartment =
      departmentFilter === "all" || item.owner_department === departmentFilter;

    return matchType && matchDepartment;
  });
  const kpiItems: Record<string, any[]> = {
    total: items,
    active: activeItems,
    high: highRiskItems,
    review: reviewItems,
  };

  const kpiTitles: Record<string, string> = {
    total: "Нийт шаардлага",
    active: "Идэвхтэй шаардлага",
    high: "Өндөр эрсдэлтэй шаардлага",
    review: "Review шаардлагатай",
  };

  const frameworks = ["ISO 9001", "ISO 14001", "ISO 45001", "MNS", "Дотоод бодлого, журам", "Хууль тогтоомж, зохицуулалт"];

  function frameworkScore(framework: string) {
    const list = items.filter((x) => x.framework === framework);
    if (list.length === 0) return 0;
    return Math.round(list.reduce((s, x) => s + Number(x.compliance_score || 0), 0) / list.length);
  }

  function riskCount(framework: string, risk: string) {
    return items.filter((x) => x.framework === framework && x.risk_level === risk).length;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Нийцлийн төв</h1>
          <p className="text-slate-500">Стандарт, журам, шаардлагын хэрэгжилт</p>
        </div>

        <button onClick={() => setCreateMode(true)} className="rounded-xl bg-blue-600 px-5 py-3 text-white">
          + Шинэ бүртгэл
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { key: "total", title: "Нийт шаардлага", value: items.length, color: "text-slate-950" },
          { key: "active", title: "Идэвхтэй", value: activeItems.length, color: "text-blue-600" },
          { key: "high", title: "Өндөр эрсдэл", value: highRiskItems.length, color: "text-red-600" },
          { key: "review", title: "Дундаж хэрэгжилт", value: `${avgScore}%`, color: "text-green-600" },
        ].map((kpi) => (
          <div key={kpi.key} className="rounded-2xl border bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-start justify-between">
              <h3 className="font-semibold text-slate-950">{kpi.title}</h3>
              <button
                onClick={() => setSelectedKpi(kpi.key)}
                className="rounded-lg border px-2 py-1 text-sm hover:bg-slate-100"
              >
                ⛶
              </button>
            </div>
            <div className={`text-3xl font-bold ${kpi.color}`}>{kpi.value}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <ModuleCard title="Нийцлийн үнэлгээ" description="ISO / MNS / Дотоод бодлого, журам хэрэгжилт">
          <div className="space-y-3">
            {frameworks.map((fw) => {
              const score = frameworkScore(fw);
              return (
                <div key={fw}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="font-medium">{fw}</span>
                    <span>{score}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100">
                    <div
                      className={`h-2 rounded-full ${score >= 90 ? "bg-green-600" : score >= 70 ? "bg-yellow-500" : "bg-red-500"}`}
                      style={{ width: `${score}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </ModuleCard>

        <ModuleCard title="Нийцлийн эрсдэлийн зураглал" description="Шаардлага × Эрсдэлийн түвшин">
          <div className="overflow-x-auto rounded-xl border">
            <table className="w-full text-sm">
              <thead className="bg-slate-100">
                <tr>
                  <th className="border px-3 py-2 text-left">Framework</th>
                  <th className="border px-3 py-2">Low</th>
                  <th className="border px-3 py-2">Medium</th>
                  <th className="border px-3 py-2">High</th>
                </tr>
              </thead>
              <tbody>
                {frameworks.map((fw) => (
                  <tr key={fw}>
                    <td className="border px-3 py-2 font-medium">{fw}</td>
                    <td className="border bg-green-50 px-3 py-2 text-center">{riskCount(fw, "low")}</td>
                    <td className="border bg-yellow-50 px-3 py-2 text-center">{riskCount(fw, "medium")}</td>
                    <td className="border bg-red-50 px-3 py-2 text-center">{riskCount(fw, "high")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ModuleCard>
      </div>

      <ModuleCard title="Нийцлийн бүртгэл" description="Стандарт, журам, шаардлагын жагсаалт">
        
        <div className="mb-4 flex flex-wrap gap-3">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="rounded-xl border px-4 py-2"
          >
            <option value="all">Бүх төрөл</option>
            <option value="policy">Журам</option>
            <option value="procedure">Процесс</option>
            <option value="standard">Стандарт</option>
            <option value="regulation">Зохицуулалт</option>
            <option value="instruction">Заавар</option>
          </select>

          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="rounded-xl border px-4 py-2"
          >
            <option value="all">Бүх алба хэлтэс</option>
            {departments.map((dep) => (
              <option key={dep} value={dep}>
                {dep}
              </option>
            ))}
          </select>
        </div>

        <div className="max-h-[520px] overflow-y-auto rounded-xl border">
          <table className="w-full min-w-[1000px] text-sm">
            <thead className="sticky top-0 z-10 bg-slate-100">
              <tr>
                {[
                  "Нэр",
                  "Framework",
                  "Clause",
                  "Эрсдэл",
                  "Хэрэгжилт",
                  "Хариуцагч",
                  "Хэлтэс",
                  "Review",
                ].map((c) => (
                  <th key={c} className="border px-4 py-3 text-left font-semibold">
                    {c}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {items.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-slate-500">
                    Compliance бүртгэл одоогоор байхгүй байна.
                  </td>
                </tr>
              )}

              {filteredItems.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => setSelected(item)}
                  className="cursor-pointer border-b hover:bg-blue-50"
                >
                  <td className="border px-4 py-3 font-medium">{item.title || "-"}</td>
                  <td className="border px-4 py-3">{item.framework || "-"}</td>
                  <td className="border px-4 py-3">{item.clause || "-"}</td>
                  <td className="border px-4 py-3">{item.risk_level || "-"}</td>
                  <td className="border px-4 py-3">{item.compliance_score || 0}%</td>
                  <td className="border px-4 py-3">{item.responsible_person || "-"}</td>
                  <td className="border px-4 py-3">{item.owner_department || "-"}</td>
                  <td className="border px-4 py-3">{item.next_review_date || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ModuleCard>

      {(selected || createMode) && (
        <ComplianceItemModal
          organizationId={organizationId}
          item={selected}
          createMode={createMode}
          onClose={() => {
            setSelected(null);
            setCreateMode(false);
            location.reload();
          }}
        />
      )}

      {selectedKpi && (
        <ComplianceKpiDetailModal
          title={kpiTitles[selectedKpi]}
          description="Compliance бүртгэлийн дэлгэрэнгүй жагсаалт"
          items={kpiItems[selectedKpi] || []}
          onClose={() => setSelectedKpi(null)}
        />
      )}
    </div>
  );
}