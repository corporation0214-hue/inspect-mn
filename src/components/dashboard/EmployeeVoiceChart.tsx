export default function EmployeeVoiceChart({ voices = [] }: any) {
  const rows = [
    {
      type: "Санал",
      label: "Санал",
      resultLabel: "Дэмжигдсэн",
      doneStatuses: ["approved", "supported", "accepted", "done", "closed"],
    },
    {
      type: "complaint",
      label: "Гомдол",
      resultLabel: "Шийдвэрлэсэн",
      doneStatuses: ["resolved", "done", "closed"],
    },
    {
      type: "risk",
      label: "Эрсдэл",
      resultLabel: "Арилсан",
      doneStatuses: ["mitigated", "removed", "done", "closed"],
    },
    {
      type: "violation",
      label: "Зөрчил",
      resultLabel: "Арилгасан",
      doneStatuses: ["fixed", "corrected", "done", "closed"],
    },
    {
      type: "confidential",
      label: "Нууц",
      resultLabel: "Хянагдсан",
      doneStatuses: ["reviewed", "checked", "done", "closed"],
    },
  ];

  const countByType = (type: string) =>
    voices.filter(
      (x: any) =>
        String(x.type || "").toLowerCase() === type ||
        String(x.category || "").toLowerCase() === type
    );

  const max = Math.max(1, ...rows.map((r) => countByType(r.type).length));

  const summary = rows.map((row) => {
    const items = countByType(row.type);
    const total = items.length;

    const done = items.filter((x: any) =>
      row.doneStatuses.includes(String(x.status || "").toLowerCase())
    ).length;

    return {
      ...row,
      total,
      done,
      percent: total > 0 ? Math.round((done / total) * 100) : 0,
    };
  });

  const totalVoice = summary.reduce((sum, x) => sum + x.total, 0);
  const totalDone = summary.reduce((sum, x) => sum + x.done, 0);
  const totalOpen = totalVoice - totalDone;
  const doneRate = totalVoice > 0 ? Math.round((totalDone / totalVoice) * 100) : 0;

  const topIssue = [...summary].sort((a, b) => b.total - a.total)[0];
  const riskAndViolation = summary
    .filter((x) => ["risk", "violation"].includes(x.type))
    .reduce((sum, x) => sum + (x.total - x.done), 0);

  return (
    <div>
      <h2 className="text-xl font-bold">Ажилтны дуу хоолой</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Санал, гомдол, эрсдэлийн бүртгэл ба шийдвэрлэлтийн үзүүлэлт
      </p>

      <div className="mt-5 space-y-4">
        {summary.map((row) => (
          <div key={row.type} className="rounded-xl border p-3 dark:border-slate-700">
            <div className="mb-2 grid grid-cols-3 items-center gap-3 text-sm">
              <div>
                <p className="font-medium">{row.label}</p>
                <p className="text-xs text-slate-500">Нийт: {row.total}</p>
              </div>

              <div>
                <p className="font-medium">{row.resultLabel}</p>
                <p className="text-xs text-slate-500">
                  {row.done} / {row.total} · {row.percent}%
                </p>
              </div>

              <div className="text-right text-lg font-bold">{row.total}</div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className="h-full rounded-full bg-blue-600"
                  style={{ width: `${(row.total / max) * 100}%` }}
                />
              </div>

              <div className="h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className="h-full rounded-full bg-green-500"
                  style={{ width: `${row.percent}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border p-3 dark:border-slate-700">
          <p className="text-xs text-slate-500">Нийт бүртгэл</p>
          <p className="text-2xl font-bold">{totalVoice}</p>
        </div>

        <div className="rounded-xl border p-3 dark:border-slate-700">
          <p className="text-xs text-slate-500">Үр дүн гарсан</p>
          <p className="text-2xl font-bold text-green-600">
            {totalDone}
            <span className="ml-1 text-sm text-slate-500">({doneRate}%)</span>
          </p>
        </div>

        <div className="rounded-xl border p-3 dark:border-slate-700">
          <p className="text-xs text-slate-500">Нээлттэй</p>
          <p className="text-2xl font-bold text-orange-600">{totalOpen}</p>
        </div>
      </div>

      <div className="mt-3 rounded-xl border p-3 dark:border-slate-700">
        <p className="text-xs text-slate-500">Insight</p>
        <p className="mt-1 text-sm font-medium">
          {totalVoice === 0
            ? "Employee Voice бүртгэл одоогоор байхгүй байна."
            : `Нийт ${totalVoice} бүртгэлийн ${doneRate}% нь үр дүнтэй хаагдсан байна. Хамгийн их бүртгэлтэй төрөл нь “${topIssue?.label}” (${topIssue?.total}) байна.${
                riskAndViolation > 0
                  ? ` Эрсдэл болон зөрчлийн ${riskAndViolation} нээлттэй асуудалд нэмэлт арга хэмжээ шаардлагатай.`
                  : " Эрсдэл болон зөрчлийн ноцтой нээлттэй асуудал одоогоор харагдахгүй байна."
              }`}
        </p>
      </div>

      <div className="mt-4 flex gap-4 text-xs text-slate-500">
        <span>● Цэнхэр: Нийт бүртгэл</span>
        <span>● Ногоон: Үр дүн</span>
      </div>
    </div>
  );
}