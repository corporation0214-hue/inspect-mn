type Props = {
  title: string;
  value: string;
};

export default function KpiCard({
  title,
  value,
}: Props) {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-5">

      <p className="text-slate-500">
        {title}
      </p>

      <h2 className="text-3xl font-bold mt-2">
        {value}
      </h2>

    </div>
  );
}