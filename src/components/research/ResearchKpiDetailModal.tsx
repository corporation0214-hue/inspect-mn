"use client";

type Project = {
  id: string;
  title: string;
  category?: string;
  status?: string;
  priority?: string;
  progress?: number;
  owner?: string;
  start_date?: string;
  end_date?: string;
  extended_end_date?: string;
  issue?: string;
  pending_decision?: string;
  is_urgent?: boolean;
};

type Props = {
  title: string;
  description: string;
  projects: Project[];
  onClose: () => void;
};

export default function ResearchKpiDetailModal({
  title,
  description,
  projects,
  onClose,
}: Props) {
  const avgProgress =
    projects.length > 0
      ? Math.round(
          projects.reduce((sum, p) => sum + Number(p.progress || 0), 0) /
            projects.length
        )
      : 0;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-6xl rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-950">{title}</h2>
            <p className="text-sm text-slate-500">{description}</p>
          </div>

          <button onClick={onClose} className="rounded-lg border px-3 py-1">
            ×
          </button>
        </div>

        <div className="mb-5 grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl border bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Төслийн тоо</p>
            <p className="text-3xl font-bold">{projects.length}</p>
          </div>

          <div className="rounded-2xl border bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Дундаж явц</p>
            <p className="text-3xl font-bold">{avgProgress}%</p>
          </div>

          <div className="rounded-2xl border bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Хүндрэлтэй</p>
            <p className="text-3xl font-bold text-orange-600">
              {projects.filter((p) => p.issue || p.pending_decision).length}
            </p>
          </div>
        </div>

        <div className="max-h-[520px] overflow-y-auto rounded-xl border">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-slate-100">
              <tr>
                {[
                  "Төсөл",
                  "Ангилал",
                  "Төлөв",
                  "Priority",
                  "Явц",
                  "Эхлэх",
                  "Дуусах",
                  "Хариуцагч",
                  "Хүндрэл",
                  "Хүлээгдэж буй шийдвэр",
                ].map((col) => (
                  <th key={col} className="border px-4 py-3 text-left">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {projects.length === 0 && (
                <tr>
                  <td colSpan={10} className="px-4 py-8 text-center text-slate-500">
                    Мэдээлэл байхгүй байна.
                  </td>
                </tr>
              )}

              {projects.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50">
                  <td className="border px-4 py-3 font-medium">{p.title}</td>
                  <td className="border px-4 py-3">{p.category || "-"}</td>
                  <td className="border px-4 py-3">{p.status || "-"}</td>
                  <td className="border px-4 py-3">{p.priority || "-"}</td>
                  <td className="border px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-24 rounded-full bg-slate-100">
                        <div
                          className="h-2 rounded-full bg-blue-600"
                          style={{ width: `${Math.min(Number(p.progress || 0), 100)}%` }}
                        />
                      </div>
                      <span>{p.progress || 0}%</span>
                    </div>
                  </td>
                  <td className="border px-4 py-3">{p.start_date || "-"}</td>
                  <td className="border px-4 py-3">
                    {p.extended_end_date || p.end_date || "-"}
                  </td>
                  <td className="border px-4 py-3">{p.owner || "-"}</td>
                  <td className="border px-4 py-3">{p.issue || "-"}</td>
                  <td className="border px-4 py-3">{p.pending_decision || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}