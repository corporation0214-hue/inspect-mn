type Inspection = {
  id: string;
  title: string;
  type: string;
  category: string;
  status: string;
};

type Finding = {
  id: string;
  inspection_id?: string;
  severity?: string;
  status?: string;
};

const typeLabels: Record<string, string> = {
  government: "Төрийн ХШ",
  internal: "Дотоод ХШ",
  night: "Шөнийн ХШ",
  joint: "Хамтарсан ХШ",
  document: "Баримт бичиг",
};

export default function InspectionAnalytics({
  inspections,
  findings,
}: {
  inspections: Inspection[];
  findings: Finding[];
}) {
  const types = ["government", "internal", "night", "joint", "document"];

  const rows = types.map((type) => {
    const typeInspections = inspections.filter((x) => x.type === type);
    const inspectionIds = typeInspections.map((x) => x.id);

    const typeFindings = findings.filter((f) =>
      inspectionIds.includes(f.inspection_id || "")
    );

    return {
      type,
      label: typeLabels[type] || type,
      inspections: typeInspections.length,
      findings: typeFindings.length,
      completed: typeInspections.filter((x) => x.status === "completed").length,
      inProgress: typeInspections.filter((x) => x.status === "in_progress").length,
    };
  });

  const planned = inspections.filter((x) => x.category === "planned").length;
  const unplanned = inspections.filter((x) => x.category === "unplanned").length;

  const maxValue = Math.max(
    1,
    ...rows.map((x) => Math.max(x.inspections, x.findings))
  );

  return (
    <div className="space-y-5">
      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-2xl border bg-white p-4">
          <p className="text-sm text-slate-500">Төлөвлөгөөт</p>
          <div className="mt-2 text-3xl font-bold text-slate-950">{planned}</div>
          <div className="mt-3 h-2 rounded-full bg-slate-100">
            <div
              className="h-2 rounded-full bg-blue-600"
              style={{
                width: `${(planned / Math.max(1, planned + unplanned)) * 100}%`,
              }}
            />
          </div>
        </div>

        <div className="rounded-2xl border bg-white p-4">
          <p className="text-sm text-slate-500">Төлөвлөгөөт бус</p>
          <div className="mt-2 text-3xl font-bold text-slate-950">{unplanned}</div>
          <div className="mt-3 h-2 rounded-full bg-slate-100">
            <div
              className="h-2 rounded-full bg-orange-500"
              style={{
                width: `${(unplanned / Math.max(1, planned + unplanned)) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border bg-white p-4">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-950">ХШ төрөл ба зөрчлийн харьцуулалт</h3>
            <p className="text-sm text-slate-500">Хяналт шалгалт vs илэрсэн зөрчил</p>
          </div>
        </div>

        <div className="space-y-4">
          {rows.map((row) => (
            <div key={row.type}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="font-medium text-slate-800">{row.label}</span>
                <span className="text-slate-500">
                  ХШ: {row.inspections} · Зөрчил: {row.findings}
                </span>
              </div>

              <div className="grid gap-1">
                <div className="h-3 rounded-full bg-slate-100">
                  <div
                    className="h-3 rounded-full bg-blue-600"
                    style={{ width: `${(row.inspections / maxValue) * 100}%` }}
                  />
                </div>

                <div className="h-3 rounded-full bg-slate-100">
                  <div
                    className="h-3 rounded-full bg-red-500"
                    style={{ width: `${(row.findings / maxValue) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 flex gap-4 text-xs text-slate-500">
          <span>● Цэнхэр: Хяналт шалгалт</span>
          <span>● Улаан: Илэрсэн зөрчил</span>
        </div>
      </div>
    </div>
  );
}