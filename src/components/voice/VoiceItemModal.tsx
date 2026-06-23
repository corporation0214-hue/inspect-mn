"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function VoiceItemModal({
  item,
  organizationId,
  createMode,
  onClose,
}: {
  item?: any;
  organizationId: string;
  createMode?: boolean;
  onClose: () => void;
}) {
  const supabase = createClient();

  const [title, setTitle] = useState(item?.title || "");
  const [description, setDescription] = useState(item?.description || "");
  const [category, setCategory] = useState(item?.category || "suggestion");
  const [status, setStatus] = useState(item?.status || "new");
  const [priority, setPriority] = useState(item?.priority || "medium");
  const [department, setDepartment] = useState(item?.department || "");
  const [submittedBy, setSubmittedBy] = useState(item?.submitted_by || "");
  const [assignedTo, setAssignedTo] = useState(item?.assigned_to || "");
  const [voiceDate, setVoiceDate] = useState(item?.voice_date || "");
  const [dueDate, setDueDate] = useState(item?.due_date || "");
  const [actionTaken, setActionTaken] = useState(item?.action_taken || "");
  const [isAnonymous, setIsAnonymous] = useState(item?.is_anonymous || false);

  const STATUS_OPTIONS: Record<string, { value: string; label: string }[]> = {
    suggestion: [
      { value: "new", label: "Шинэ" },
      { value: "in_progress", label: "Хянагдаж байна" },
      { value: "approved", label: "Дэмжигдсэн" },
      { value: "rejected", label: "Няцаагдсан" },
      { value: "closed", label: "Хаагдсан" },
    ],
    complaint: [
      { value: "new", label: "Шинэ" },
      { value: "in_progress", label: "Хянагдаж байна" },
      { value: "resolved", label: "Шийдвэрлэсэн" },
      { value: "rejected", label: "Няцаагдсан" },
      { value: "closed", label: "Хаагдсан" },
    ],
    risk: [
      { value: "new", label: "Шинэ" },
      { value: "in_progress", label: "Хянагдаж байна" },
      { value: "mitigated", label: "Арилсан" },
      { value: "accepted", label: "Хүлээн зөвшөөрсөн" },
      { value: "closed", label: "Хаагдсан" },
    ],
    violation: [
      { value: "new", label: "Шинэ" },
      { value: "in_progress", label: "Хянагдаж байна" },
      { value: "fixed", label: "Арилгасан" },
      { value: "repeated", label: "Давтагдсан" },
      { value: "closed", label: "Хаагдсан" },
    ],
    confidential: [
      { value: "new", label: "Шинэ" },
      { value: "in_progress", label: "Хянагдаж байна" },
      { value: "reviewed", label: "Хянагдсан" },
      { value: "escalated", label: "Удирдлагад шилжүүлсэн" },
      { value: "closed", label: "Хаагдсан" },
    ],
  };

  const statusOptions = STATUS_OPTIONS[category] || STATUS_OPTIONS.suggestion;

  async function saveItem() {
    const categoryLabels: Record<string, string> = {
      suggestion: "Санал",
      complaint: "Гомдол",
      risk: "Эрсдэл",
      violation: "Зөрчил",
      confidential: "Нууц",
    };

    const payload = {
      title,
      type: category,
      category: categoryLabels[category] || category,
      description,
      priority,
      department,
      status,
      action_taken: actionTaken,
      resolution_note: actionTaken,
      resolved_at: [
        "approved",
        "resolved",
        "mitigated",
        "fixed",
        "reviewed",
        "closed",
      ].includes(status)
        ? new Date().toISOString()
        : null,
      submitted_by: submittedBy,
      assigned_to: assignedTo,
      voice_date: voiceDate || null,
      due_date: dueDate || null,
      is_anonymous: isAnonymous,
    };

    const result = createMode
      ? await supabase.from("employee_voice").insert(payload)
      : await supabase.from("employee_voice").update(payload).eq("id", item.id);

    if (result.error) {
      alert(result.error.message);
      return;
    }

    onClose();
  }

  async function deleteItem() {
    if (!item?.id) return;

    const ok = confirm("Энэ бүртгэлийг устгах уу?");
    if (!ok) return;

    const { error } = await supabase
      .from("employee_voice")
      .delete()
      .eq("id", item.id);

    if (error) {
      alert(error.message);
      return;
    }

    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">
            {createMode ? "Шинэ Employee Voice бүртгэл" : "Employee Voice дэлгэрэнгүй"}
          </h2>

          <button onClick={onClose} className="rounded-lg border px-3 py-1">
            ×
          </button>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <input
            className="rounded-xl border p-3 md:col-span-2"
            placeholder="Гарчиг"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <select
            value={category}
            onChange={(e) => {
              const nextCategory = e.target.value;
              setCategory(nextCategory);
              setStatus("new");
            }}
            className="rounded-xl border p-3"
          >
            <option value="suggestion">Санал</option>
            <option value="complaint">Гомдол</option>
            <option value="risk">Эрсдэл</option>
            <option value="violation">Зөрчил</option>
            <option value="confidential">Нууц</option>
          </select>

          <select
            className="rounded-xl border p-3"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="new">Шинэ</option>
            <option value="in_progress">Шийдвэрлэж байна</option>
            <option value="waiting">Хүлээгдэж байна</option>
            <option value="closed">Хаагдсан</option>
          </select>

          <select
            className="rounded-xl border p-3"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="low">Бага</option>
            <option value="medium">Дунд</option>
            <option value="high">Өндөр</option>
            <option value="critical">Critical</option>
          </select>

          <input
            className="rounded-xl border p-3"
            placeholder="Алба / хэлтэс"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          />

          <input
            className="rounded-xl border p-3"
            placeholder="Илгээсэн ажилтан"
            value={submittedBy}
            disabled={isAnonymous}
            onChange={(e) => setSubmittedBy(e.target.value)}
          />

          <input
            className="rounded-xl border p-3"
            placeholder="Хариуцсан ажилтан"
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
          />

          <input
            type="date"
            className="rounded-xl border p-3"
            value={voiceDate}
            onChange={(e) => setVoiceDate(e.target.value)}
          />

          <input
            type="date"
            className="rounded-xl border p-3"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />

          <label className="flex items-center gap-2 rounded-xl border p-3">
            <input
              type="checkbox"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
            />
            Аноним санал
          </label>

          <textarea
            className="rounded-xl border p-3 md:col-span-2"
            rows={4}
            placeholder="Дэлгэрэнгүй тайлбар"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <textarea
            className="rounded-xl border p-3 md:col-span-2"
            rows={4}
            placeholder="Авсан арга хэмжээ / шийдвэрлэлтийн тэмдэглэл"
            value={actionTaken}
            onChange={(e) => setActionTaken(e.target.value)}
          />

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-xl border p-3"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-6 flex justify-between">
          <div>
            {!createMode && (
              <button
                onClick={deleteItem}
                className="rounded-xl bg-red-600 px-4 py-2 text-white"
              >
                Устгах
              </button>
            )}
          </div>

          <div className="flex gap-2">
            <button onClick={onClose} className="rounded-xl border px-4 py-2">
              Болих
            </button>

            <button
              onClick={saveItem}
              className="rounded-xl bg-blue-600 px-4 py-2 text-white"
            >
              Хадгалах
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}