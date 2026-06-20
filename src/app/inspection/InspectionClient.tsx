"use client";

import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import ModuleCard from "@/components/dashboard/ModuleCard";
import SimpleTable from "@/components/dashboard/SimpleTable";
import CreateInspectionModal from "@/components/inspection/CreateInspectionModal";
import InspectionDetailModal from "@/components/inspection/InspectionDetailModal";

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
};

export default function InspectionClient({
  organizationId,
  inspections,
}: {
  organizationId: string;
  inspections: Inspection[];
}) {
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState("all");
  const [selectedInspection, setSelectedInspection] = useState<Inspection | null>(null);
  const filteredInspections =
  filter === "all"
    ? inspections
    : inspections.filter((x) => x.type === filter || x.category === filter);  

  const governmentCount = inspections.filter((x) => x.type === "government").length;
  const nightCount = inspections.filter((x) => x.type === "night").length;
  const jointCount = inspections.filter((x) => x.type === "joint").length;
  const unplannedCount = inspections.filter((x) => x.category === "unplanned").length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Inspection Center</h1>
            <p className="text-slate-500">
              Төлөвлөгөөт, төлөвлөгөөт бус, хамтарсан хяналт шалгалт
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="rounded-xl bg-blue-600 px-5 py-3 text-white"
          >
            + Шинэ ХШ
          </button>
        </div>

        {showModal && (
          <CreateInspectionModal
            organizationId={organizationId}
            onClose={() => setShowModal(false)}
          />
          
        )}

        {selectedInspection && (
          <InspectionDetailModal
            inspection={selectedInspection}
            onClose={() => setSelectedInspection(null)}
          />
        )}

        <div className="grid gap-4 md:grid-cols-4">
          {[
            { title: "Төрийн ХШ", value: governmentCount },
            { title: "Шөнийн ХШ", value: nightCount },
            { title: "Хамтарсан ХШ", value: jointCount },
            { title: "Төлөвлөгөөт бус", value: unplannedCount },
          ].map((x) => (
            <ModuleCard key={x.title} title={x.title} description="Хяналтын төрөл">
              <div className="text-3xl font-bold text-slate-900">{x.value}</div>
              <div className="mt-2 h-2 rounded bg-slate-100">
                <div className="h-2 w-2/3 rounded bg-blue-600" />
              </div>
            </ModuleCard>
          ))}
        </div>

        <ModuleCard title="Хяналт шалгалтын жагсаалт" description="Supabase-аас уншиж байна">
          
          <div className="mb-4 flex flex-wrap gap-2">
            {[
              { label: "Бүгд", value: "all" },
              { label: "Төрийн", value: "government" },
              { label: "Шөнийн", value: "night" },
              { label: "Хамтарсан", value: "joint" },
              { label: "Баримт бичиг", value: "document" },
              { label: "Төлөвлөгөөт", value: "planned" },
              { label: "Төлөвлөгөөт бус", value: "unplanned" },
            ].map((item) => (
              <button
                key={item.value}
                onClick={() => setFilter(item.value)}
                className={`rounded-xl border px-4 py-2 text-sm ${
                  filter === item.value
                    ? "bg-blue-600 text-white"
                    : "bg-white text-slate-700"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          
          <div className="max-h-[420px] overflow-y-auto rounded-xl border">
          <div className="max-h-[420px] overflow-y-auto rounded-xl border">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-slate-100">
                <tr>
                  {["Нэр", "Төрөл", "Төлөв", "Ангилал", "Огноо", "Бүртгэсэн", "Гүйцэтгэсэн"].map((col) => (
                    <th key={col} className="border px-4 py-3 text-left font-medium">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {filteredInspections.map((x) => (
                  <tr
                    key={x.id}
                    onClick={() => setSelectedInspection(x)}
                    className="cursor-pointer hover:bg-blue-50"
                  >
                    <td className="border px-4 py-3">{x.title}</td>
                    <td className="border px-4 py-3">{x.type}</td>
                    <td className="border px-4 py-3">{x.status}</td>
                    <td className="border px-4 py-3">{x.category}</td>
                    <td className="border px-4 py-3">{x.inspection_date || "-"}</td>
                    <td className="border px-4 py-3">{x.registered_by || "-"}</td>
                    <td className="border px-4 py-3">{x.performed_by || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        </ModuleCard>

        <div className="grid gap-4 xl:grid-cols-2">
          <ModuleCard title="Checklist Builder" description="Хяналтын хуудас үүсгэх">
            <div className="space-y-3">
              {["Yes/No", "Score", "Text", "Photo Required", "GPS", "File Upload"].map((x) => (
                <div key={x} className="rounded-xl border p-3">{x}</div>
              ))}
            </div>
          </ModuleCard>

          <ModuleCard title="CAPA" description="Зөрчил, арга хэмжээ, follow-up">
            <div className="space-y-3 text-sm">
              <div className="rounded-xl border p-4">Зөрчил бүртгэх</div>
              <div className="rounded-xl border p-4">Арга хэмжээ оноох</div>
              <div className="rounded-xl border p-4">Дахин шалгах</div>
            </div>
          </ModuleCard>
        </div>
      </div>
    </DashboardLayout>
  );
}