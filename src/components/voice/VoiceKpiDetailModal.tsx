"use client";

export default function VoiceKpiDetailModal({
  title,
  description,
  items,
  onClose,
}: {
  title: string;
  description?: string;
  items: any[];
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 p-4">
      <div className="flex max-h-[85vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b p-5">
          <div>
            <h2 className="text-2xl font-bold">{title}</h2>
            {description && <p className="text-sm text-slate-500">{description}</p>}
          </div>

          <button onClick={onClose} className="rounded-lg border px-3 py-1">
            ×
          </button>
        </div>

        <div className="overflow-y-auto p-5">
          <div className="rounded-xl border">
            <table className="w-full min-w-[900px] text-sm">
              <thead className="sticky top-0 bg-slate-100">
                <tr>
                  <th className="border px-4 py-3 text-left">Гарчиг</th>
                  <th className="border px-4 py-3 text-left">Төрөл</th>
                  <th className="border px-4 py-3 text-left">Төлөв</th>
                  <th className="border px-4 py-3 text-left">Priority</th>
                  <th className="border px-4 py-3 text-left">Алба</th>
                  <th className="border px-4 py-3 text-left">Хариуцагч</th>
                  <th className="border px-4 py-3 text-left">Огноо</th>
                </tr>
              </thead>

              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td className="border px-4 py-3">{item.title || "-"}</td>
                    <td className="border px-4 py-3">{item.category || item.type || "-"}</td>
                    <td className="border px-4 py-3">{item.status || "-"}</td>
                    <td className="border px-4 py-3">{item.priority || "-"}</td>
                    <td className="border px-4 py-3">{item.department || "-"}</td>
                    <td className="border px-4 py-3">{item.assigned_to || "-"}</td>
                    <td className="border px-4 py-3">{item.voice_date || "-"}</td>
                  </tr>
                ))}

                {items.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                      Мэдээлэл олдсонгүй.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex justify-end border-t p-4">
          <button onClick={onClose} className="rounded-xl bg-blue-600 px-4 py-2 text-white">
            Хаах
          </button>
        </div>
      </div>
    </div>
  );
}