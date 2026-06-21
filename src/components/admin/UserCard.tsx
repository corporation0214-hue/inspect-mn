export default function UserCard({
  title,
  value,
  color = "text-slate-950",
}: {
  title: string;
  value: number | string;
  color?: string;
}) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <p className="text-sm text-slate-500">{title}</p>
      <p className={`mt-2 text-3xl font-bold ${color}`}>{value}</p>
    </div>
  );
}