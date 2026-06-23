export default function RiskMatrix({ findings = [], voices = [] }: any) {
  const risks = [
    ...findings.map((x: any) => ({
      level: x.risk_level || x.priority || "medium",
      title: x.title || x.name || "Finding",
    })),
    ...voices
      .filter((x: any) => x.type === "risk" || x.category === "Эрсдэл")
      .map((x: any) => ({
        level: x.priority || "medium",
        title: x.title || "Employee Voice Risk",
      })),
  ];

  const levels = ["low", "medium", "high", "critical"];

  const countByLevel = (level: string) =>
    risks.filter((x: any) => String(x.level).toLowerCase() === level).length;

  return (
    <div>
      
      <div className="mt-5 grid grid-cols-4 gap-2">
        {levels.map((level) => {
          const count = countByLevel(level);

          const cls =
            level === "critical"
              ? "bg-red-500 text-white"
              : level === "high"
              ? "bg-orange-400 text-white"
              : level === "medium"
              ? "bg-yellow-300 text-slate-900"
              : "bg-green-300 text-slate-900";

          return (
            <div key={level} className={`rounded-xl p-4 ${cls}`}>
              <p className="text-sm capitalize">{level}</p>
              <p className="mt-2 text-3xl font-bold">{count}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-4 text-sm text-slate-500">
        Нийт эрсдэлтэй бүртгэл: <b>{risks.length}</b>
      </div>
    </div>
  );
}