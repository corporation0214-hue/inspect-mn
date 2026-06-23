import { MAIN_DEPARTMENTS } from "@/lib/constants/departments";

function normalizeDepartment(value: string) {
  const v = (value || "").trim();

  if (v === "ДХШХ") return "ДХШХ";
  if (v.includes("Захиргаа")) return "Захиргаа удирдлагын хэлтэс";
  if (v.includes("ХАБЭА")) return "ХАБЭАХ";
  if (v.includes("Байгаль")) return "Байгаль орчны хэлтэс";
  if (v.includes("Үйлдвэр")) return "Үйлдвэрлэлийн хэлтэс";
  if (v.includes("СЭЗ")) return "СЭЗБХ";

  return v;
}

export default function ComplianceChart({ items = [] }: any) {
  const getValue = (x: any) => {
    const raw = x.compliance_score ?? 0;
    return Math.max(0, Math.min(Number(raw) || 0, 100));
  };

  const departmentData = MAIN_DEPARTMENTS.map((department) => {
    const deptItems = items.filter(
      (x: any) => normalizeDepartment(x.owner_department) === department
    );

    const avg =
      deptItems.length > 0
        ? Math.round(
            deptItems.reduce((sum: number, x: any) => sum + getValue(x), 0) /
              deptItems.length
          )
        : 0;

    return {
      department,
      avg,
      count: deptItems.length,
    };
  });

  const departmentsWithData = departmentData.filter((x) => x.count > 0);

  const overallAvg =
    departmentsWithData.length > 0
      ? Math.round(
          departmentsWithData.reduce((sum, x) => sum + x.avg, 0) /
            departmentsWithData.length
        )
      : 0;

  return (
    <div>
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold">Журмын хэрэгжилт</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Алба хэлтсээр ангилсан дундаж хэрэгжилт
          </p>
        </div>

        <div className="rounded-2xl border px-4 py-3 text-center dark:border-slate-700">
          <p className="text-xs text-slate-500">Нийт дундаж</p>
          <p className="text-2xl font-bold text-blue-600">{overallAvg}%</p>
        </div>
      </div>

      <div className="space-y-4">
        {departmentData.map((x) => {
          const barColor =
            x.avg >= 80
              ? "bg-green-500"
              : x.avg >= 50
              ? "bg-yellow-400"
              : "bg-red-500";

          return (
            <div
              key={x.department}
              className="rounded-xl border p-3 dark:border-slate-700"
            >
              <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                <div className="min-w-0">
                  <p className="truncate font-medium">{x.department}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Нийт журам: {x.count}
                  </p>
                </div>

                <span className="text-lg font-bold">{x.avg}%</span>
              </div>

              <div className="h-4 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className={`h-full rounded-full ${barColor}`}
                  style={{ width: `${x.avg}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}