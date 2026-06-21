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

  async function saveItem() {
    const payload = {
        organization_id: organizationId,
        title,
        type: category,
        category,
        description,
        status,
        priority,
        department,
        submitted_by: isAnonymous ? null : submittedBy,
        assigned_to: assignedTo,
        voice_date: voiceDate || null,
        due_date: dueDate || null,
        action_taken: actionTaken,
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
            className="rounded-xl border p-3"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="suggestion">Санал</option>
            <option value="complaint">Гомдол</option>
            <option value="risk">Эрсдэл</option>
            <option value="violation">Зөрчил</option>
            <option value="confidential">Нууц мэдээлэл</option>
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