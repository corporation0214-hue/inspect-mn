type Props = {
  label: string;
  value: number;
  color?: string;
};

export default function ReportSummaryCard({
  label,
  value,
  color = "",
}: Props) {
  return (
    <div className="card rounded-xl border p-4">
      <p className="text-sm text-slate-500">{label}</p>
      <p className={`text-3xl font-bold ${color}`}>
        {value}
      </p>
    </div>
  );
}