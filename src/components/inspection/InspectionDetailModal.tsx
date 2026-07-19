"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import CreateFindingModal from "@/components/findings/CreateFindingModal";
import { Pencil, Trash2, Check, X } from "lucide-react";

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

    resolution_note?: string;
    verified_by?: string;
    verified_at?: string;
    closed_at?: string;
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

    async function updateFindingStatus(findingId: string, newStatus: string) {
      const payload: any = {
        status: newStatus,
      };

      if (newStatus === "resolved") {
        payload.verified_at = new Date().toISOString();
      }

      if (newStatus === "closed") {
        payload.verified_at = new Date().toISOString();
        payload.closed_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from("findings")
        .update(payload)
        .eq("id", findingId);

      if (error) {
        alert(error.message);
        return;
      }

      await loadFindings();
      router.refresh();
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

  async function deleteFinding(findingId: string) {
    const confirmed = window.confirm(
      "Энэ зөрчлийн бүртгэлийг бүрмөсөн устгахдаа итгэлтэй байна уу?"
    );

    if (!confirmed) return;

    const { data, error } = await supabase
      .from("findings")
      .delete()
      .eq("id", findingId)
      .select("id");

    if (error) {
      alert(`Зөрчил устгахад алдаа гарлаа: ${error.message}`);
      return;
    }

    if (!data || data.length === 0) {
      alert(
        "Зөрчил устгагдсангүй. Supabase RLS delete эрх эсвэл бүртгэлийн ID-г шалгана уу."
      );
      return;
    }

    setFindings((current) =>
      current.filter((finding) => finding.id !== findingId)
    );

    if (editingFindingId === findingId) {
      setEditingFindingId(null);
    }

    await loadFindings();
    router.refresh();

    alert("Зөрчил амжилттай устгагдлаа.");
  }

  const [editingFindingId, setEditingFindingId] = useState<string | null>(null);

  const [editingFinding, setEditingFinding] = useState({
    title: "",
    description: "",
    severity: "medium",
    status: "open",
    owner: "",
  });

  function startEditFinding(finding: any) {
    setEditingFindingId(finding.id);

    setEditingFinding({
      title: finding.title || "",
      description: finding.description || "",
      severity:
        finding.severity ||
        finding.risk_level ||
        finding.priority ||
        "medium",
      status: finding.status || "open",
      owner: finding.owner || "",
    });
  }

  async function saveFindingEdit(findingId: string) {
    if (!editingFinding.title.trim()) {
      alert("Зөрчлийн гарчиг оруулна уу.");
      return;
    }

    const { data, error } = await supabase
      .from("findings")
      .update({
        title: editingFinding.title.trim(),
        description: editingFinding.description.trim() || null,
        severity: editingFinding.severity,
        status: editingFinding.status,
        owner: editingFinding.owner.trim() || null,
      })
      .eq("id", findingId)
      .select("id")
      .maybeSingle();

    if (error) {
      alert(`Зөрчил засахад алдаа гарлаа: ${error.message}`);
      return;
    }

    if (!data) {
      alert(
        "Зөрчлийг шинэчилж чадсангүй. RLS update эрх эсвэл тухайн бүртгэлийн ID-г шалгана уу."
      );
      return;
    }

    setFindings((current) =>
      current.map((finding) =>
        finding.id === findingId
          ? {
              ...finding,
              title: editingFinding.title.trim(),
              description: editingFinding.description.trim() || undefined,
              severity: editingFinding.severity,
              status: editingFinding.status,
              owner: editingFinding.owner.trim() || undefined,
            }
          : finding
      )
    );

    setEditingFindingId(null);
    await loadFindings();
    router.refresh();

    alert("Зөрчлийн мэдээлэл шинэчлэгдлээ.");
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
                    <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:flex-nowrap">
                      <div>
                        <div className="font-semibold">{f.title}</div>

                        <div className="text-sm text-slate-500">
                          Эрсдэл: {f.severity || "-"} · Хариуцагч: {f.owner || "-"}
                        </div>
                     
                        {f.description && (
                          <p className="mt-1 text-sm text-slate-600">{f.description}</p>
                        )}

                        {f.verified_at && (
                          <p className="mt-1 text-xs text-green-700">
                            Баталгаажсан: {String(f.verified_at).slice(0, 10)}
                          </p>
                        )}

                        {f.closed_at && (
                          <p className="mt-1 text-xs text-blue-700">
                            Хаагдсан: {String(f.closed_at).slice(0, 10)}
                          </p>
                        )}
                      </div>

                      <select
                        value={f.status || "open"}
                        onChange={(e) => updateFindingStatus(f.id, e.target.value)}
                        className="flex-1 min-w-[150px]"
                      >
                        <option value="open">Нээлттэй</option>
                        <option value="planned">Арга хэмжээ төлөвлөсөн</option>
                        <option value="in_progress">Засвар хийгдэж байна</option>
                        <option value="verification">Баталгаажуулалтад</option>
                        <option value="resolved">Арилсан</option>
                        <option value="closed">Хаагдсан</option>
                      </select>

                      <button
                        type="button"
                        onClick={() => startEditFinding(f)}
                        className="
                          flex h-8 w-4 shrink-0 items-center justify-center
                          rounded-lg
                          
                          text-blue-600
                          transition
                          hover:bg-blue-50
                          dark:text-blue-400
                          dark:hover:bg-blue-950
                        "
                        title="Зөрчил засах"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => deleteFinding(f.id)}
                        className="
                          flex h-8 w-4 shrink-0 items-center justify-center
                          rounded-lg
                          
                          text-red-600
                          transition
                          hover:bg-red-50
                          dark:text-red-400
                          dark:hover:bg-red-950
                        "
                        title="Зөрчил устгах"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    {editingFindingId === f.id && (
                      <div className="mt-4 rounded-xl border border-blue-400 bg-slate-50 p-4 dark:bg-slate-900">

                        <div className="space-y-3">

                          <input
                            value={editingFinding.title}
                            onChange={(e)=>
                              setEditingFinding({
                                ...editingFinding,
                                title:e.target.value,
                              })
                            }
                            placeholder="Зөрчлийн нэр"
                            className="w-full rounded-lg border px-3 py-2"
                          />

                          <textarea
                            rows={3}
                            value={editingFinding.description}
                            onChange={(e)=>
                              setEditingFinding({
                                ...editingFinding,
                                description:e.target.value,
                              })
                            }
                            placeholder="Тайлбар"
                            className="w-full rounded-lg border px-3 py-2"
                          />

                          <div className="grid grid-cols-3 gap-3">

                            <select
                              value={editingFinding.severity}
                              onChange={(e)=>
                                setEditingFinding({
                                  ...editingFinding,
                                  severity:e.target.value,
                                })
                              }
                              className="rounded-lg border px-3 py-2"
                            >
                              <option value="low">Low</option>
                              <option value="medium">Medium</option>
                              <option value="high">High</option>
                              <option value="critical">Critical</option>
                            </select>

                            <select
                              value={editingFinding.status}
                              onChange={(e)=>
                                setEditingFinding({
                                  ...editingFinding,
                                  status:e.target.value,
                                })
                              }
                              className="rounded-lg border px-3 py-2"
                            >
                              <option value="open">Нээлттэй</option>
                              <option value="planned">Төлөвлөсөн</option>
                              <option value="in_progress">Хийгдэж байна</option>
                              <option value="verification">Баталгаажуулалт</option>
                              <option value="resolved">Арилсан</option>
                              <option value="closed">Хаагдсан</option>
                            </select>

                            <input
                              value={editingFinding.owner}
                              onChange={(e)=>
                                setEditingFinding({
                                  ...editingFinding,
                                  owner:e.target.value,
                                })
                              }
                              placeholder="Хариуцагч"
                              className="rounded-lg border px-3 py-2"
                            />

                          </div>

                          <div className="flex justify-end gap-2">

                            <button
                              onClick={()=>setEditingFindingId(null)}
                              className="rounded-lg border px-4 py-2"
                            >
                              Болих
                            </button>

                            <button
                              onClick={()=>saveFindingEdit(f.id)}
                              className="rounded-lg bg-blue-600 px-4 py-2 text-white"
                            >
                              Хадгалах
                            </button>

                          </div>

                        </div>

                      </div>
                    )}

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