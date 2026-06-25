"use client";

type Inspection = {
  id: string;
  title: string;
  type: string;
  category: string;
  status: string;
  inspection_date?: string;
  registered_by?: string;
  performed_by?: string;
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

function getTopCategories(findings: Finding[]) {
  const counts: Record<string, number> = {};

  findings.forEach((f) => {
    const category = f.category || "Бусад";
    counts[category] = (counts[category] || 0) + 1;
  });

  return Object.entries(counts)
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);
}

function severityClass(severity?: string) {
  if (severity === "critical") return "bg-red-700 text-white";
  if (severity === "high") return "bg-red-100 text-red-700";
  if (severity === "medium") return "bg-yellow-100 text-yellow-700";
  if (severity === "low") return "bg-green-100 text-green-700";
  return "bg-slate-100 text-slate-700";
}

export default function InspectionKpiDetailModal({
  type,
  label,
  plannedCount,
  inspections,
  findings,
  onClose,
}: {
  type: string;
  label: string;
  plannedCount: number;
  inspections: Inspection[];
  findings: Finding[];
  onClose: () => void;
}) {
  const done = inspections.length;
  const percent = plannedCount > 0 ? Math.round((done / plannedCount) * 100) : 0;
  const topCategories = getTopCategories(findings);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-5xl rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold">{label} дэлгэрэнгүй</h2>
            <p className="text-sm text-slate-500">Inspection type: {type}</p>
          </div>

          <button onClick={onClose} className="rounded-lg border px-3 py-1">
            ×
          </button>
        </div>
       <div className="max-h-[560px] overflow-y-auto rounded-xl border">
        <div className="mb-5 grid gap-3 md:grid-cols-4">
          <div className="rounded-2xl border bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Төлөвлөгөө</p>
            <p className="text-3xl font-bold">{plannedCount}</p>
          </div>

          <div className="rounded-2xl border bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Хийгдсэн</p>
            <p className="text-3xl font-bold">{done}</p>
          </div>

          <div className="rounded-2xl border bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Гүйцэтгэл</p>
            <p className="text-3xl font-bold">{percent}%</p>
          </div>

          <div className="rounded-2xl border bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Нийт зөрчил</p>
            <p className="text-3xl font-bold">{findings.length}</p>
          </div>
        </div>

        <div className="mb-5 rounded-2xl border p-4">
          <h3 className="mb-3 font-bold">Зөрчлийн ангилал</h3>

          <div className="grid gap-2 md:grid-cols-3">
            {topCategories.length === 0 && (
              <p className="text-sm text-slate-500">Зөрчил бүртгэгдээгүй байна.</p>
            )}

            {topCategories.map((x) => (
              <div key={x.category} className="flex justify-between rounded-xl bg-slate-50 p-3">
                <span>{x.category}</span>
                <span className="font-bold">{x.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border">
          <div className="border-b bg-slate-50 p-4">
            <h3 className="font-bold">Зөрчлийн дэлгэрэнгүй жагсаалт</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-100">
                <tr>
                  {["Зөрчил", "Ангилал", "Түвшин", "Төлөв", "Хариуцагч", "Хугацаа"].map(
                    (col) => (
                      <th key={col} className="border px-4 py-3 text-left">
                        {col}
                      </th>
                    )
                  )}
                </tr>
              </thead>

              <tbody>
                {findings.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-6 text-center text-slate-500">
                      Зөрчил бүртгэгдээгүй байна.
                    </td>
                  </tr>
                )}

                {findings.map((f) => (
                  <tr key={f.id}>
                    <td className="border px-4 py-3">{f.title}</td>
                    <td className="border px-4 py-3">{f.category || "Бусад"}</td>
                    <td className="border px-4 py-3">
                      <span className={`rounded-full px-3 py-1 text-xs ${severityClass(f.severity)}`}>
                        {f.severity || "-"}
                      </span>
                    </td>
                    <td className="border px-4 py-3">{f.status || "-"}</td>
                    <td className="border px-4 py-3">{f.owner || "-"}</td>
                    <td className="border px-4 py-3">{f.due_date || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
       </div>
      </div>
    </div>
  );
}