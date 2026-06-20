"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function CreateInspectionModal({
  organizationId,
  onClose,
}: {
  organizationId: string;
  onClose: () => void;
}) {
  const supabase = createClient();

  const [title, setTitle] = useState("");
  const [type, setType] = useState("government");
  const [status, setStatus] = useState("planned");

  async function handleSave() {
    const { error } = await supabase
      .from("inspections")
      .insert({
        organization_id: organizationId,
        title,
        type,
        category: "unplanned",
        status,
      });

    if (error) {
      alert(error.message);
      return;
    }

    window.location.reload();
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-[500px]">
        <h2 className="text-xl font-bold mb-4">
          Шинэ хяналт шалгалт
        </h2>

        <input
          className="w-full border p-2 mb-3"
          placeholder="Гарчиг"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <select
          className="w-full border p-2 mb-3"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="government">
            Төрийн ХШ
          </option>

          <option value="night">
            Шөнийн ХШ
          </option>

          <option value="joint">
            Хамтарсан ХШ
          </option>

          <option value="document">
            Баримт бичгийн ХШ
          </option>
        </select>

        <select
          className="w-full border p-2 mb-4"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="planned">
            Төлөвлөгдсөн
          </option>

          <option value="in_progress">
            Хийгдэж байна
          </option>

          <option value="completed">
            Дууссан
          </option>
        </select>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded"
          >
            Болих
          </button>

          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Хадгалах
          </button>
        </div>
      </div>
    </div>
  );
}