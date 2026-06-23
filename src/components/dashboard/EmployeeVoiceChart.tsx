export default function EmployeeVoiceChart({ voices = [] }: any) {
  const groups = ["suggestion", "complaint", "risk", "violation", "confidential"];

  const labels: any = {
    suggestion: "Санал",
    complaint: "Гомдол",
    risk: "Эрсдэл",
    violation: "Зөрчил",
    confidential: "Нууц",
  };

  const max = Math.max(
    1,
    ...groups.map(
      (g) =>
        voices.filter(
          (x: any) =>
            String(x.type).toLowerCase() === g ||
            String(x.category).toLowerCase() === g
        ).length
    )
  );

  return (
    <div>
      
      <div className="mt-5 space-y-4">
        {groups.map((g) => {
          const count = voices.filter(
            (x: any) =>
              String(x.type).toLowerCase() === g ||
              String(x.category).toLowerCase() === g
          ).length;

          return (
            <div key={g}>
              <div className="mb-1 flex justify-between text-sm">
                <span>{labels[g]}</span>
                <span>{count}</span>
              </div>

              <div className="h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className="h-full rounded-full bg-blue-600"
                  style={{ width: `${(count / max) * 100}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}