"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function RiskActionModal({
  organizationId,
  risk,
  plan,
  onClose,
}: any) {
  const supabase = createClient();

  const editMode = !!plan;

  const [riskTitle, setRiskTitle] = useState(
    plan?.risk_title || risk?.title || ""
  );
  const [riskLevel, setRiskLevel] = useState(
    plan?.risk_level || risk?.risk_level || "medium"
  );
  const [actionTitle, setActionTitle] = useState(plan?.action_title || "");
  const [actionDescription, setActionDescription] = useState(
    plan?.action_description || risk?.description || ""
  );
  const [ownerDepartment, setOwnerDepartment] = useState(
    plan?.owner_department || ""
  );
  const [ownerName, setOwnerName] = useState(plan?.owner_name || "");
  const [status, setStatus] = useState(plan?.status || "planned");
  const [startDate, setStartDate] = useState(plan?.start_date || "");
  const [dueDate, setDueDate] = useState(plan?.due_date || "");
  const [progress, setProgress] = useState(plan?.progress || 0);
  const [resultNote, setResultNote] = useState(plan?.result_note || "");
  const [verifiedBy, setVerifiedBy] = useState(plan?.verified_by || "");
  const [loading, setLoading] = useState(false);

  async function savePlan() {
    if (!riskTitle.trim() || !actionTitle.trim()) {
      alert("Эрсдэл болон арга хэмжээний нэр оруулна уу.");
      return;
    }

    setLoading(true);

    const now = new Date().toISOString();

    const payload: any = {
      organization_id: organizationId,
      source: plan?.source || risk?.source || "manual",
      source_id: plan?.source_id || risk?.id || null,

      risk_title: riskTitle,
      risk_level: riskLevel,

      action_title: actionTitle,
      action_description: actionDescription,

      owner_department: ownerDepartment,
      owner_name: ownerName,

      status,
      start_date: startDate || null,
      due_date: dueDate || null,
      progress: Number(progress || 0),

      result_note: resultNote,
      verified_by: verifiedBy,

      completed_at: status === "completed" ? plan?.completed_at || now : null,
      verified_at: status === "verification" || status === "completed"
        ? plan?.verified_at || now
        : null,

      updated_at: now,
    };

    const result = editMode
      ? await supabase.from("risk_action_plans").update(payload).eq("id", plan.id)
      : await supabase.from("risk_action_plans").insert(payload);

    setLoading(false);

    if (result.error) {
      alert(result.error.message);
      return;
    }

    onClose();
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-auto rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">
              {editMode ? "Төлөвлөгөө засах" : "Арга хэмжээний төлөвлөгөө"}
            </h2>
            <p className="text-sm text-slate-500">
              Эрсдэлийг бууруулах ажил, явц, хариуцагч
            </p>
          </div>

          <button onClick={onClose} className="rounded-lg border px-3 py-1">
            ×
          </button>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <input
            className="rounded-xl border px-4 py-3 md:col-span-2"
            placeholder="Эрсдэлийн нэр"
            value={riskTitle}
            onChange={(e) => setRiskTitle(e.target.value)}
          />

          <select
            className="rounded-xl border px-4 py-3"
            value={riskLevel}
            onChange={(e) => setRiskLevel(e.target.value)}
          >
            <option value="low">Бага</option>
            <option value="medium">Дунд</option>
            <option value="high">Өндөр</option>
            <option value="critical">Ноцтой</option>
          </select>

          <select
            className="rounded-xl border px-4 py-3"
            value={status}
            onChange={(e) => {
              const next = e.target.value;
              setStatus(next);
              if (next === "completed") setProgress(100);
            }}
          >
            <option value="planned">Төлөвлөсөн</option>
            <option value="in_progress">Хийгдэж байна</option>
            <option value="verification">Баталгаажуулалтад</option>
            <option value="completed">Дууссан</option>
            <option value="overdue">Хугацаа хэтэрсэн</option>
            <option value="cancelled">Цуцлагдсан</option>
          </select>

          <input
            className="rounded-xl border px-4 py-3 md:col-span-2"
            placeholder="Арга хэмжээний нэр"
            value={actionTitle}
            onChange={(e) => setActionTitle(e.target.value)}
          />

          <textarea
            className="min-h-24 rounded-xl border px-4 py-3 md:col-span-2"
            placeholder="Арга хэмжээний тайлбар"
            value={actionDescription}
            onChange={(e) => setActionDescription(e.target.value)}
          />

          <input
            className="rounded-xl border px-4 py-3"
            placeholder="Хариуцсан алба"
            value={ownerDepartment}
            onChange={(e) => setOwnerDepartment(e.target.value)}
          />

          <input
            className="rounded-xl border px-4 py-3"
            placeholder="Хариуцагч"
            value={ownerName}
            onChange={(e) => setOwnerName(e.target.value)}
          />

          <input
            type="date"
            className="rounded-xl border px-4 py-3"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />

          <input
            type="date"
            className="rounded-xl border px-4 py-3"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />

          <div className="md:col-span-2">
            <div className="mb-1 flex items-center justify-between text-sm">
              <span>Явц</span>
              <b>{progress}%</b>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              className="w-full"
              value={progress}
              onChange={(e) => setProgress(Number(e.target.value))}
            />
          </div>

          <input
            className="rounded-xl border px-4 py-3 md:col-span-2"
            placeholder="Баталгаажуулсан хүн"
            value={verifiedBy}
            onChange={(e) => setVerifiedBy(e.target.value)}
          />

          <textarea
            className="min-h-24 rounded-xl border px-4 py-3 md:col-span-2"
            placeholder="Үр дүн / тайлбар"
            value={resultNote}
            onChange={(e) => setResultNote(e.target.value)}
          />
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-xl border px-4 py-2">
            Болих
          </button>

          <button
            onClick={savePlan}
            disabled={loading}
            className="rounded-xl bg-blue-600 px-4 py-2 text-white"
          >
            {loading ? "Хадгалж байна..." : "Хадгалах"}
          </button>
        </div>
      </div>
    </div>
  );
}