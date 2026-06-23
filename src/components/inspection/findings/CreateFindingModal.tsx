"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function CreateFindingModal({
  inspectionId,
  organizationId,
  onClose,
  onSaved,
}: {
  inspectionId: string;
  organizationId?: string;
  onClose: () => void;
  onSaved: () => void;
}) {
  const supabase = createClient();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState("medium");
  const [status, setStatus] = useState("open");
  const [category, setCategory] = useState("Бусад");
  const [rootCause, setRootCause] = useState("");
  const [owner, setOwner] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [createdBy, setCreatedBy] = useState("");
  const [loading, setLoading] = useState(false);

  async function saveFinding() {
    if (!title.trim()) {
      alert("Зөрчлийн гарчиг оруулна уу");
      return;
    }

    setLoading(true);

    const { error } = await supabase.from("findings").insert({
      inspection_id: inspectionId,
      organization_id: organizationId || null,
      title,
      description,
      severity,
      status,
      category,
      root_cause: rootCause,
      owner,
      due_date: dueDate || null,
      created_by: createdBy,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    onSaved();
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-bold">Зөрчил нэмэх</h2>
          <button onClick={onClose} className="rounded-lg border px-3 py-1">
            ×
          </button>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <input
            className="rounded-xl border px-4 py-3 md:col-span-2"
            placeholder="Зөрчлийн гарчиг"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <select
            className="rounded-xl border px-4 py-3"
            value={severity}
            onChange={(e) => setSeverity(e.target.value)}
          >
            <option value="low">Бага</option>
            <option value="medium">Дунд</option>
            <option value="high">Өндөр</option>
            <option value="critical">Ноцтой</option>
          </select>

          <select
            className="rounded-xl border px-4 py-3"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="open">Нээлттэй</option>
            <option value="planned">Арга хэмжээ төлөвлөсөн</option>
            <option value="in_progress">Засвар хийгдэж байна</option>
            <option value="verification">Баталгаажуулалтад</option>
            <option value="resolved">Арилсан</option>
            <option value="closed">Хаагдсан</option>
          </select>

          <input
            className="rounded-xl border px-4 py-3"
            placeholder="Ангилал"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />

          <input
            className="rounded-xl border px-4 py-3"
            placeholder="Хариуцагч"
            value={owner}
            onChange={(e) => setOwner(e.target.value)}
          />

          <input
            type="date"
            className="rounded-xl border px-4 py-3"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />

          <input
            className="rounded-xl border px-4 py-3"
            placeholder="Бүртгэсэн хүн"
            value={createdBy}
            onChange={(e) => setCreatedBy(e.target.value)}
          />

          <textarea
            className="min-h-24 rounded-xl border px-4 py-3 md:col-span-2"
            placeholder="Зөрчлийн тайлбар"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <textarea
            className="min-h-20 rounded-xl border px-4 py-3 md:col-span-2"
            placeholder="Үндсэн шалтгаан"
            value={rootCause}
            onChange={(e) => setRootCause(e.target.value)}
          />
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-xl border px-4 py-2">
            Болих
          </button>

          <button
            onClick={saveFinding}
            disabled={loading}
            className="rounded-xl bg-red-600 px-4 py-2 text-white"
          >
            {loading ? "Хадгалж байна..." : "Хадгалах"}
          </button>
        </div>
      </div>
    </div>
  );
}