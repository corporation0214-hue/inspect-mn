"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Props = {
  inspectionId: string;
  organizationId?: string;
  onClose: () => void;
  onSaved: () => void;
};

export default function CreateFindingModal({
  inspectionId,
  organizationId,
  onClose,
  onSaved,
}: Props) {
  const supabase = createClient();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState("medium");
  const [owner, setOwner] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [createdBy, setCreatedBy] = useState("");

  async function handleSave() {
    if (!title.trim()) {
      alert("Зөрчлийн нэр оруулна уу");
      return;
    }

    if (!organizationId) {
      alert("organization_id олдсонгүй");
      return;
    }

    const { error } = await supabase.from("findings").insert({
      inspection_id: inspectionId,
      organization_id: organizationId,
      title,
      description,
      severity,
      owner,
      due_date: dueDate || null,
      status: "open",
      created_by: createdBy,
    });

    if (error) {
      alert(error.message);
      return;
    }

    onSaved();
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-bold">Шинэ зөрчил бүртгэх</h2>

          <button onClick={onClose} className="rounded-lg border px-3 py-1">
            ×
          </button>
        </div>

        <div className="space-y-3">
          <input
            className="w-full rounded-xl border px-4 py-3"
            placeholder="Зөрчлийн нэр"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            className="min-h-24 w-full rounded-xl border px-4 py-3"
            placeholder="Зөрчлийн тайлбар"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <select
            className="w-full rounded-xl border px-4 py-3"
            value={severity}
            onChange={(e) => setSeverity(e.target.value)}
          >
            <option value="low">Бага</option>
            <option value="medium">Дунд</option>
            <option value="high">Өндөр</option>
            <option value="critical">Ноцтой</option>
          </select>

          <input
            className="w-full rounded-xl border px-4 py-3"
            placeholder="Хариуцагч"
            value={owner}
            onChange={(e) => setOwner(e.target.value)}
          />

          <input
            type="date"
            className="w-full rounded-xl border px-4 py-3"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />

          <input
            className="w-full rounded-xl border px-4 py-3"
            placeholder="Бүртгэсэн хүн"
            value={createdBy}
            onChange={(e) => setCreatedBy(e.target.value)}
          />
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-xl border px-4 py-2">
            Болих
          </button>

          <button
            onClick={handleSave}
            className="rounded-xl bg-red-600 px-4 py-2 text-white"
          >
            Хадгалах
          </button>
        </div>
      </div>
    </div>
  );
}