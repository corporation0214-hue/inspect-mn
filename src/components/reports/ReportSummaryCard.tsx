type Props = {
  label: string;
  value: number | string;
  color?: string;
  subtitle?: string;
};

export default function ReportSummaryCard({
  label,
  value,
  color = "text-slate-900",
  subtitle,
}: Props) {
  return (
    <div className="min-w-[140px] rounded-xl border bg-white p-4 shadow-sm">
      <p className="truncate text-xs font-medium text-slate-500">
        {label}
      </p>

      <p className={`mt-1 text-3xl font-bold ${color}`}>
        {value}
      </p>

      {subtitle && (
        <p className="mt-1 truncate text-[11px] text-slate-400">
          {subtitle}
        </p>
      )}
    </div>
  );
}