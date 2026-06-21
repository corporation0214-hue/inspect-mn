"use client";
import ModuleCard from "@/components/dashboard/ModuleCard";

type Item = {
  id: string;
  title: string;
  framework?: string;
  clause?: string;
  risk_level?: string;
  compliance_score?: number;
  responsible_person?: string;
  owner_department?: string;
  next_review_date?: string;
  improvement_plan?: string;
  status?: string;
  item_type?: string;
};

export default function ComplianceKpiDetailModal({
  title,
  description,
  items,
  onClose,
}: {
  title: string;
  description: string;
  items: Item[];
  onClose: () => void;
}) {

const weakestItems = [...items]
  .sort(
    (a, b) =>
      Number(a.compliance_score || 0) -
      Number(b.compliance_score || 0)
  )
  .slice(0, 5);

const avgScore =
  items.length > 0
    ? Math.round(
        items.reduce(
          (sum, x) => sum + Number(x.compliance_score || 0),
          0
        ) / items.length
      )
    : 0;

const riskSummary = {
  high: items.filter(x => x.risk_level === "high").length,
  medium: items.filter(x => x.risk_level === "medium").length,
  low: items.filter(x => x.risk_level === "low").length,
};

const typeGroups = items.reduce((acc: Record<string, number>, item) => {
  const type = item.item_type || "other";
  acc[type] = (acc[type] || 0) + 1;
  return acc;
}, {});

  return (
        
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-6xl rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-5 flex justify-between">
          <div>
            <h2 className="text-2xl font-bold">{title}</h2>
            <p className="text-sm text-slate-500">{description}</p>
          </div>
          <button onClick={onClose} className="rounded-lg border px-3 py-1">×</button>
        </div>

        <div className="max-h-[560px] overflow-y-auto rounded-xl border">

          <div className="mb-5 grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl border bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Нийт бүртгэл</p>
              <p className="text-3xl font-bold">{items.length}</p>
            </div>

            <div className="rounded-2xl border bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Дундаж биелэлт</p>
              <p className="text-3xl font-bold text-green-600">{avgScore}%</p>
            </div>

            <div className="rounded-2xl border bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Ангиллын тоо</p>
              <p className="text-3xl font-bold">{Object.keys(typeGroups).length}</p>
            </div>
          </div>

          <div className="mb-5 rounded-2xl border p-4">
            <h3 className="mb-3 font-bold">Төрлөөр ангилсан байдал</h3>

            <div className="grid gap-2 md:grid-cols-5">
              {Object.entries(typeGroups).map(([type, count]) => (
                <div key={type} className="rounded-xl bg-slate-50 p-3">
                  <p className="text-sm text-slate-500">{type}</p>
                  <p className="text-2xl font-bold">{count}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-5 rounded-2xl border p-4">
            <h3 className="font-bold">
              Анхаарал шаардлагатай TOP 5
            </h3>

            <p className="mb-3 text-sm text-slate-500">
              Хамгийн бага биелэлттэй
            </p>

            {weakestItems.map((x) => (
              <div
                key={x.id}
                className="flex justify-between border-b py-2"
              >
                <span>{x.title}</span>

                <span className="font-bold text-red-600">
                  {x.compliance_score || 0}%
                </span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-red-50 p-4">
              <div className="text-red-600 text-sm">High Risk</div>
              <div className="text-3xl font-bold">{riskSummary.high}</div>
            </div>

            <div className="rounded-xl bg-yellow-50 p-4">
              <div className="text-yellow-700 text-sm">Medium Risk</div>
              <div className="text-3xl font-bold">{riskSummary.medium}</div>
            </div>

            <div className="rounded-xl bg-green-50 p-4">
              <div className="text-green-700 text-sm">Low Risk</div>
              <div className="text-3xl font-bold">{riskSummary.low}</div>
            </div>
          </div>

          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-slate-100">
              <tr>
                {["Нэр", "Төрөл", "Framework", "Clause", "Risk", "Score", "Хариуцагч", "Review", "Сайжруулалт"].map((c) => (
                  <th key={c} className="border px-4 py-3 text-left">{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((x) => (
                <tr key={x.id} className="hover:bg-slate-50">
                  <td className="border px-4 py-3 font-medium">{x.title}</td>
                  <td className="border px-4 py-3">{x.framework || "-"}</td>
                  <td className="border px-4 py-3">{x.item_type || "-"}</td>
                  <td className="border px-4 py-3">{x.clause || "-"}</td>
                  <td className="border px-4 py-3">{x.risk_level || "-"}</td>
                  <td className="border px-4 py-3">{x.compliance_score || 0}%</td>
                  <td className="border px-4 py-3">{x.responsible_person || "-"}</td>
                  <td className="border px-4 py-3">{x.next_review_date || "-"}</td>
                  <td className="border px-4 py-3">{x.improvement_plan || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}