"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function CreateInspectionModal({
  organizationId,
  onClose,
}: {
  organizationId: string;
  onClose: () => void;
}) {
  const router = useRouter();
  const supabase = createClient();

  const [title, setTitle] = useState("");
  const [type, setType] = useState("government");
  const [category, setCategory] = useState("planned");
  const [status, setStatus] = useState("planned");
  const [notes, setNotes] = useState("");
  const [inspectionDate, setInspectionDate] = useState("");
  const [registeredBy, setRegisteredBy] = useState("");
  const [performedBy, setPerformedBy] = useState(""); 

  async function handleSave() {
    if (!title.trim()) {
      alert("Гарчиг оруулна уу");
      return;
    }

    const { error } = await supabase.from("inspections").insert({
      organization_id: organizationId,
      title,
      type,
      category,
      status,
      notes,
      inspection_date: inspectionDate || null,
      registered_by: registeredBy,
      performed_by: performedBy,
    });

    if (error) {
      alert(error.message);
      return;
    }

    onClose();
    router.refresh();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-xl font-bold">Шинэ хяналт шалгалт</h2>

        <div className="space-y-3">
          <input
            className="w-full rounded-xl border px-4 py-3"
            placeholder="Хяналт шалгалтын нэр"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            className="w-full rounded-xl border px-4 py-3"
            type="date"
            value={inspectionDate}
            onChange={(e) => setInspectionDate(e.target.value)}
          />

          <input
            className="w-full rounded-xl border px-4 py-3"
            placeholder="Бүртгэл оруулсан хүн"
            value={registeredBy}
            onChange={(e) => setRegisteredBy(e.target.value)}
          />

          <input
            className="w-full rounded-xl border px-4 py-3"
            placeholder="Шалгалт гүйцэтгэсэн хүн"
            value={performedBy}
            onChange={(e) => setPerformedBy(e.target.value)}
          />

          <textarea
            className="min-h-24 w-full rounded-xl border px-4 py-3"
            placeholder="Тэмдэглэл"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          <select
            className="w-full rounded-xl border px-4 py-3"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="government">Төрийн ХШ</option>
            <option value="night">Шөнийн ХШ</option>
            <option value="joint">Хамтарсан ХШ</option>
            <option value="document">Баримт бичгийн ХШ</option>
          </select>

          <select
            className="w-full rounded-xl border px-4 py-3"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="planned">Төлөвлөгөөт</option>
            <option value="unplanned">Төлөвлөгөөт бус</option>
          </select>

          <select
            className="w-full rounded-xl border px-4 py-3"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="planned">Төлөвлөгдсөн</option>
            <option value="in_progress">Хийгдэж байна</option>
            <option value="completed">Дууссан</option>
            <option value="open">Нээлттэй</option>
          </select>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-xl border px-4 py-2">
            Болих
          </button>

          <button onClick={handleSave} className="rounded-xl bg-blue-600 px-4 py-2 text-white">
            Хадгалах
          </button>
        </div>
      </div>
    </div>
  );
}