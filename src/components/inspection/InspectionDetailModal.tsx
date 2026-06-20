"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import CreateFindingModal from "@/components/findings/CreateFindingModal";

type Inspection = {
  id: string;
  title: string;
  type: string;
  category: string;
  status: string;
  notes?: string;
  inspection_date?: string;
  registered_by?: string;
  performed_by?: string;
  result_summary?: string;
  result_score?: number;
  result_status?: string;
  organization_id?: string;
};

export default function InspectionDetailModal({
  inspection,
  onClose,
}: {
  inspection: Inspection;
  onClose: () => void;
}) {
  const router = useRouter();
  const supabase = createClient();

  const [title, setTitle] = useState(inspection.title || "");
  const [type, setType] = useState(inspection.type || "government");
  const [category, setCategory] = useState(inspection.category || "planned");
  const [status, setStatus] = useState(inspection.status || "planned");
  const [inspectionDate, setInspectionDate] = useState(inspection.inspection_date || "");
  const [registeredBy, setRegisteredBy] = useState(inspection.registered_by || "");
  const [performedBy, setPerformedBy] = useState(inspection.performed_by || "");
  const [notes, setNotes] = useState(inspection.notes || "");
  const [resultSummary, setResultSummary] = useState(inspection.result_summary || "");
  const [resultScore, setResultScore] = useState(String(inspection.result_score ?? ""));
  const [resultStatus, setResultStatus] = useState(inspection.result_status || "not_entered");
  
  type Finding = {
    id: string;
    title: string;
    description?: string;
    severity?: string;
    status?: string;
    owner?: string;
    due_date?: string;
    };

    const [findings, setFindings] = useState<Finding[]>([]);
    const [showFindingModal, setShowFindingModal] = useState(false);

    async function loadFindings() {
    const { data, error } = await supabase
        .from("findings")
        .select("*")
        .eq("inspection_id", inspection.id)
        .order("created_at", { ascending: false });

    if (error) {
        console.error(error);
        return;
    }

    setFindings(data ?? []);
    }

    useEffect(() => {
    loadFindings();
    }, [inspection.id]);

  async function handleUpdate() {
    const { error } = await supabase
      .from("inspections")
      .update({
        title,
        type,
        category,
        status,
        inspection_date: inspectionDate || null,
        registered_by: registeredBy,
        performed_by: performedBy,
        notes,
        result_summary: resultSummary,
        result_score: resultScore ? Number(resultScore) : null,
        result_status: resultStatus,
      })
      .eq("id", inspection.id);

    if (error) {
      alert(error.message);
      return;
    }

    onClose();
    router.refresh();
  }

  async function handleDelete() {
    const ok = confirm("Энэ хяналт шалгалтыг устгах уу?");
    if (!ok) return;

    const { error } = await supabase
      .from("inspections")
      .delete()
      .eq("id", inspection.id);

    if (error) {
      alert(error.message);
      return;
    }

    onClose();
    router.refresh();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-bold">Хяналт шалгалтын дэлгэрэнгүй</h2>
          <button onClick={onClose} className="rounded-lg border px-3 py-1">
            ×
          </button>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <input className="rounded-xl border px-4 py-3" value={title} onChange={(e) => setTitle(e.target.value)} />

          <select className="rounded-xl border px-4 py-3" value={type} onChange={(e) => setType(e.target.value)}>
            <option value="government">Төрийн ХШ</option>
            <option value="night">Шөнийн ХШ</option>
            <option value="joint">Хамтарсан ХШ</option>
            <option value="document">Баримт бичгийн ХШ</option>
          </select>

          <select className="rounded-xl border px-4 py-3" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="planned">Төлөвлөгөөт</option>
            <option value="unplanned">Төлөвлөгөөт бус</option>
          </select>

          <select className="rounded-xl border px-4 py-3" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="planned">Төлөвлөгдсөн</option>
            <option value="in_progress">Хийгдэж байна</option>
            <option value="completed">Дууссан</option>
            <option value="open">Нээлттэй</option>
          </select>

          <input type="date" className="rounded-xl border px-4 py-3" value={inspectionDate} onChange={(e) => setInspectionDate(e.target.value)} />

          <input className="rounded-xl border px-4 py-3" placeholder="Бүртгэсэн хүн" value={registeredBy} onChange={(e) => setRegisteredBy(e.target.value)} />

          <input className="rounded-xl border px-4 py-3 md:col-span-2" placeholder="Гүйцэтгэсэн хүн" value={performedBy} onChange={(e) => setPerformedBy(e.target.value)} />

          <textarea className="min-h-24 rounded-xl border px-4 py-3 md:col-span-2" placeholder="Тэмдэглэл" value={notes} onChange={(e) => setNotes(e.target.value)} />
        </div>

        <div className="mt-6 rounded-2xl border bg-slate-50 p-4">
          <h3 className="mb-3 font-bold">Үр дүн оруулах</h3>

          <div className="grid gap-3 md:grid-cols-2">
            <select className="rounded-xl border px-4 py-3" value={resultStatus} onChange={(e) => setResultStatus(e.target.value)}>
              <option value="not_entered">Үр дүн оруулаагүй</option>
              <option value="passed">Хангалттай</option>
              <option value="warning">Анхаарах</option>
              <option value="failed">Хангалтгүй</option>
            </select>

            <input
              type="number"
              className="rounded-xl border px-4 py-3"
              placeholder="Үнэлгээ / хувь"
              value={resultScore}
              onChange={(e) => setResultScore(e.target.value)}
            />

            <textarea
              className="min-h-28 rounded-xl border px-4 py-3 md:col-span-2"
              placeholder="Үр дүнгийн тайлбар"
              value={resultSummary}
              onChange={(e) => setResultSummary(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-6 flex justify-between gap-2">
          <button onClick={handleDelete} className="rounded-xl bg-red-600 px-4 py-2 text-white">
            Устгах
          </button>

          <div className="flex gap-2">
            <button onClick={onClose} className="rounded-xl border px-4 py-2">
              Болих
            </button>
            <button onClick={handleUpdate} className="rounded-xl bg-blue-600 px-4 py-2 text-white">
              Хадгалах
            </button>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border p-4">
            <div className="mb-3 flex items-center justify-between">
                <h3 className="font-bold">Зөрчилүүд</h3>

                <button
                onClick={() => setShowFindingModal(true)}
                className="rounded-xl bg-red-600 px-4 py-2 text-white"
                >
                + Зөрчил нэмэх
                </button>
            </div>

            <div className="space-y-2">
                {findings.length === 0 && (
                <p className="text-sm text-slate-500">Одоогоор зөрчил бүртгэгдээгүй байна.</p>
                )}

                {findings.map((f) => (
                <div key={f.id} className="rounded-xl border p-3">
                    <div className="font-semibold">{f.title}</div>
                    <div className="text-sm text-slate-500">
                    Эрсдэл: {f.severity || "-"} · Төлөв: {f.status || "-"}
                    </div>
                </div>
                ))}
            </div>
            </div>

            {showFindingModal && (
            <CreateFindingModal
                inspectionId={inspection.id}
                organizationId={(inspection as any).organization_id}
                onClose={() => setShowFindingModal(false)}
                onSaved={() => {
                setShowFindingModal(false);
                loadFindings();
                router.refresh();
                }}
            />
            )}

      </div>
    </div>
  );
}