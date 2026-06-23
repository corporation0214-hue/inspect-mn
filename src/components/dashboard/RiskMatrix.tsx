export default function RiskMatrix({ findings = [], voices = [] }: any) {
  const risks = [
    ...findings.map((x: any) => ({
      level: String(x.risk_level || x.priority || "medium").toLowerCase(),
      title: x.title || x.name || "Finding",
      source: "Finding",
      status: x.status || "-",
    })),
    ...voices
      .filter((x: any) => x.type === "risk" || x.category === "Эрсдэл")
      .map((x: any) => ({
        level: String(x.priority || "medium").toLowerCase(),
        title: x.title || "Employee Voice Risk",
        source: "Voice",
        status: x.status || "-",
      })),
  ];

  const levels = [
    {
      key: "critical",
      label: "Critical",
      desc: "Нэн яаралтай арга хэмжээ авах түвшин",
      cls: "bg-red-500 text-white",
      dot: "bg-red-500",
    },
    {
      key: "high",
      label: "High",
      desc: "Удирдлагын анхаарал шаардлагатай түвшин",
      cls: "bg-orange-400 text-white",
      dot: "bg-orange-400",
    },
    {
      key: "medium",
      label: "Medium",
      desc: "Төлөвлөж хянах шаардлагатай түвшин",
      cls: "bg-yellow-300 text-slate-900",
      dot: "bg-yellow-400",
    },
    {
      key: "low",
      label: "Low",
      desc: "Хяналтад байлгах түвшин",
      cls: "bg-green-300 text-slate-900",
      dot: "bg-green-400",
    },
  ];

  const risksByLevel = (level: string) =>
    risks.filter((x: any) => x.level === level);

  const summarizeLevel = (level: string) => {
    const list = risksByLevel(level);
    const findingCount = list.filter((x: any) => x.source === "Finding").length;
    const voiceCount = list.filter((x: any) => x.source === "Voice").length;
    const openCount = list.filter(
      (x: any) =>
        !["closed", "fixed", "resolved", "mitigated", "reviewed"].includes(
          String(x.status).toLowerCase()
        )
    ).length;

    if (list.length === 0) {
      return "Энэ түвшний эрсдэл одоогоор бүртгэгдээгүй.";
    }

    return `Нийт ${list.length} бүртгэл байна. Үүнээс хяналт шалгалтын ${findingCount}, Employee Voice-ийн ${voiceCount} эрсдэл байна. Нээлттэй төлөвтэй ${openCount} асуудал байна.`;
  };

  const high = risksByLevel("high").length;
  const critical = risksByLevel("critical").length;
  const urgent = high + critical;

  return (
    <div>
      <h2 className="text-xl font-bold">Эрсдэлийн матриц</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Findings + Employee Voice risk
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {levels
          .slice()
          .reverse()
          .map((level) => {
            const count = risksByLevel(level.key).length;

            return (
              <div key={level.key} className={`rounded-xl p-4 ${level.cls}`}>
                <p className="text-sm font-medium">{level.label}</p>
                <p className="mt-2 text-3xl font-bold">{count}</p>
                <p className="mt-1 text-xs opacity-80">{level.desc}</p>
              </div>
            );
          })}
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border p-3 dark:border-slate-700">
          <p className="text-xs text-slate-500">Нийт эрсдэл</p>
          <p className="text-2xl font-bold">{risks.length}</p>
        </div>

        <div className="rounded-xl border p-3 dark:border-slate-700">
          <p className="text-xs text-slate-500">High + Critical</p>
          <p className="text-2xl font-bold text-red-600">{urgent}</p>
        </div>

        <div className="rounded-xl border p-3 dark:border-slate-700">
          <p className="text-xs text-slate-500">Тайлбар</p>
          <p className="text-sm font-medium">
            {urgent > 0
              ? "Яаралтай удирдлагын анхаарал шаардлагатай."
              : "Ноцтой эрсдэл одоогоор бүртгэгдээгүй."}
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3">
        {levels.map((level) => (
          <div
            key={level.key}
            className="rounded-xl border p-3 dark:border-slate-700"
          >
            <div className="mb-1 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className={`h-3 w-3 rounded-full ${level.dot}`} />
                <p className="font-bold">{level.label}</p>
              </div>

              <span className="font-bold">{risksByLevel(level.key).length}</span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              {level.desc}
            </p>

            <p className="mt-2 text-sm font-medium">
              {summarizeLevel(level.key)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}