"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Props = {
  organizationId: string;
  inspectionType: string;
  label: string;
  currentPlannedCount: number;
  onClose: () => void;
};

export default function PlanEditModal({
  organizationId,
  inspectionType,
  label,
  currentPlannedCount,
  onClose,
}: Props) {
  const router = useRouter();
  const supabase = createClient();

  const [plannedCount, setPlannedCount] = useState(String(currentPlannedCount));
  const [period, setPeriod] = useState("2026");

  async function handleSave() {
    const value = Number(plannedCount);

    if (Number.isNaN(value) || value < 0) {
      alert("Төлөвлөсөн тоог зөв оруулна уу");
      return;
    }

    const { error } = await supabase
      .from("inspection_plans")
      .upsert(
        {
          organization_id: organizationId,
          inspection_type: inspectionType,
          planned_count: value,
          period,
        },
        {
          onConflict: "organization_id,inspection_type,period",
        }
      );

    if (error) {
      alert(error.message);
      return;
    }

    onClose();
    router.refresh();
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Төлөвлөгөө тохируулах</h2>
            <p className="text-sm text-slate-500">{label}</p>
          </div>

          <button onClick={onClose} className="rounded-lg border px-3 py-1">
            ×
          </button>
        </div>

        <div className="space-y-3">
          <input
            className="w-full rounded-xl border px-4 py-3"
            placeholder="Он / хугацаа"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
          />

          <input
            type="number"
            className="w-full rounded-xl border px-4 py-3"
            placeholder="Төлөвлөсөн ХШ тоо"
            value={plannedCount}
            onChange={(e) => setPlannedCount(e.target.value)}
          />
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-xl border px-4 py-2">
            Болих
          </button>

          <button
            onClick={handleSave}
            className="rounded-xl bg-blue-600 px-4 py-2 text-white"
          >
            Хадгалах
          </button>
        </div>
      </div>
    </div>
  );
}