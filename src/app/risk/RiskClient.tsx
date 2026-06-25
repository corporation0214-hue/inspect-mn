"use client";

import { useMemo, useState } from "react";
import RiskActionModal from "@/components/risk/RiskActionModal";

const CLOSED_STATUSES = ["resolved", "closed", "fixed", "mitigated", "reviewed"];

function normalizeRisk(value: any) {
  return String(value || "medium").toLowerCase();
}

function riskLabel(value: string) {
  if (value === "critical") return "Ноцтой";
  if (value === "high") return "Өндөр";
  if (value === "medium") return "Дунд";
  if (value === "low") return "Бага";
  return value || "-";
}

function statusLabel(value: string) {
  if (value === "planned") return "Төлөвлөсөн";
  if (value === "in_progress") return "Хийгдэж байна";
  if (value === "verification") return "Баталгаажуулалтад";
  if (value === "completed") return "Дууссан";
  if (value === "overdue") return "Хугацаа хэтэрсэн";
  if (value === "cancelled") return "Цуцлагдсан";
  return value || "-";
}

export default function RiskClient({
  organizationId,
  findings,
  inspections = [],
  employeeVoices,
  plans,
}: any) {
  const [selectedRisk, setSelectedRisk] = useState<any | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<any | null>(null);
  const [filter, setFilter] = useState("all");

  const riskItems = useMemo(() => {
    const findingRisks = findings
      .filter(
        (x: any) =>
          !CLOSED_STATUSES.includes(String(x.status || "").toLowerCase())
      )
      .map((x: any) => {
        const inspection = inspections.find(
          (i: any) => i.id === x.inspection_id
        );

        return {
          id: x.id,
          source: "finding",
          sourceLabel: "Хяналт шалгалт",
          title: x.title,
          description: x.description,
          risk_level: normalizeRisk(x.severity || x.risk_level || x.priority),
          status: x.status || "open",
          owner: x.owner || "-",
          created_at: x.created_at,

          inspection_title: inspection?.title || "-",
          inspection_type: inspection?.type || "-",
        };
      });

    const voiceRisks = employeeVoices
      .filter(
        (x: any) =>
          (String(x.type || "").toLowerCase() === "risk" ||
            String(x.category || "") === "Эрсдэл") &&
          !CLOSED_STATUSES.includes(String(x.status || "").toLowerCase())
      )
      .map((x: any) => ({
        id: x.id,
        source: "employee_voice",
        sourceLabel: "Ажилтны дуу хоолой",
        title: x.title,
        description: x.description,
        risk_level: normalizeRisk(x.priority || x.severity || x.risk_level),
        status: x.status || "open",
        owner: x.assigned_to || x.submitted_by || "-",
        created_at: x.created_at,

        inspection_title: "-",
        inspection_type: "-",
      }));

    return [...findingRisks, ...voiceRisks];
  }, [findings, inspections, employeeVoices]);

  const filteredRisks =
    filter === "all"
      ? riskItems
      : riskItems.filter((x: any) => x.risk_level === filter);

  const highCritical = riskItems.filter((x: any) =>
    ["high", "critical"].includes(x.risk_level)
  ).length;

  const openPlans = plans.filter((x: any) =>
    ["planned", "in_progress", "verification", "overdue"].includes(
      String(x.status || "").toLowerCase()
    )
  );

  const completedPlans = plans.filter((x: any) =>
    ["completed"].includes(String(x.status || "").toLowerCase())
  );

  const overduePlans = plans.filter((x: any) => {
    const status = String(x.status || "").toLowerCase();
    if (status === "completed" || !x.due_date) return false;
    return String(x.due_date).slice(0, 10) < new Date().toISOString().slice(0, 10);
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Эрсдэлийн удирдлага</h1>
          <p className="text-slate-500">
            Нээлттэй эрсдэл, арга хэмжээний төлөвлөгөө, явцын хяналт
          </p>
        </div>

        <button
          onClick={() => setSelectedRisk({ source: "manual" })}
          className="rounded-xl bg-blue-600 px-5 py-3 text-white"
        >
          + Төлөвлөгөө нэмэх
        </button>
      </div>
      
        <div className="gap-3 grid grid-cols-2 lg:grid-cols-4 2xl:grid-cols-4 text-center">
        <KpiCard title="Нээлттэй эрсдэл" value={riskItems.length} note="Findings + Voice" />
        <KpiCard
          title="High / Critical"
          value={highCritical}
          note="Яаралтай анхаарах"
          color="text-red-600"
        />
        <KpiCard
          title="Нээлттэй төлөвлөгөө"
          value={openPlans.length}
          note="Хийгдэж буй ажил"
          color="text-blue-600"
        />
        <KpiCard
          title="Хугацаа хэтэрсэн"
          value={overduePlans.length}
          note="Due date өнгөрсөн"
          color="text-orange-600"
        />
      </div>

      <div className="rounded-2xl border bg-white p-5 text-slate-900 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold">Нээлттэй эрсдэлийн бүртгэл</h2>
            <p className="text-sm text-slate-500">
              Арга хэмжээний төлөвлөгөө үүсгэх эх үүсвэрүүд
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              ["all", "Бүгд"],
              ["critical", "Ноцтой"],
              ["high", "Өндөр"],
              ["medium", "Дунд"],
              ["low", "Бага"],
            ].map(([key, label]) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`rounded-xl border px-4 py-2 ${
                  filter === key ? "bg-blue-600 text-white" : "bg-white text-slate-700 hover:bg-slate-100"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="max-h-[420px] overflow-auto rounded-xl border">
          <table className="w-full min-w-[1000px] text-sm">
            <thead className="sticky top-0 bg-slate-100 text-slate-900">
              <tr>
                {[
                    "Эрсдэл",
                    "Илрүүлсэн ХШ",
                    "ХШ төрөл",
                    "Эх үүсвэр",
                    "Түвшин",
                    "Төлөв",
                    "Хариуцагч",
                    "Үйлдэл",
                  ].map(
                  (col) => (
                    <th key={col} className="border px-4 py-3 text-left">
                      {col}
                    </th>
                  )
                )}
              </tr>
            </thead>

            <tbody>
              {filteredRisks.map((risk: any) => (
                <tr key={`${risk.source}-${risk.id}`} className="hover:bg-slate-50">
                  <td className="border px-4 py-3">
                    <p className="font-semibold">{risk.title}</p>
                    <p className="line-clamp-1 text-xs text-slate-500">
                      {risk.description || "-"}
                    </p>
                  </td>
                  <td className="border px-4 py-3">
                    {risk.source === "finding" ? risk.inspection_title : "-"}
                  </td>

                  <td className="border px-4 py-3">
                    {risk.source === "finding" ? risk.inspection_type : "-"}
                  </td>

                  <td className="border px-4 py-3">{risk.sourceLabel}</td>

                  <td className="border px-4 py-3 font-semibold">
                    {riskLabel(risk.risk_level)}
                  </td>
                  <td className="border px-4 py-3">{risk.status}</td>
                  <td className="border px-4 py-3">{risk.owner}</td>
                  <td className="border px-4 py-3">
                    <button
                      onClick={() => setSelectedRisk(risk)}
                      className="rounded-lg bg-blue-600 px-3 py-2 text-white"
                    >
                      Төлөвлөгөө үүсгэх
                    </button>
                  </td>
                </tr>
              ))}

              {filteredRisks.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-slate-500">
                    Нээлттэй эрсдэл олдсонгүй.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-2xl border bg-white p-5 text-slate-900 shadow-sm">
        <div className="mb-4">
          <h2 className="text-xl font-bold">Арга хэмжээний төлөвлөгөө</h2>
          <p className="text-sm text-slate-500">
            Эрсдэлийг бууруулах ажлын явц, хариуцагч, хугацаа
          </p>
        </div>

        <div className="max-h-[480px] overflow-auto rounded-xl border">
          <table className="w-full min-w-[1200px] text-sm">
            <thead className="sticky top-0 bg-slate-100 text-slate-900">
              <tr>
                {[
                  "Эрсдэл",
                  "Арга хэмжээ",
                  "Түвшин",
                  "Төлөв",
                  "Явц",
                  "Хариуцагч",
                  "Дуусах огноо",
                  "Үйлдэл",
                ].map((col) => (
                  <th key={col} className="border px-4 py-3 text-left">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {plans.map((plan: any) => (
                <tr key={plan.id} className="hover:bg-slate-50">
                  <td className="border px-4 py-3">{plan.risk_title}</td>
                  <td className="border px-4 py-3">{plan.action_title}</td>
                  <td className="border px-4 py-3">{riskLabel(plan.risk_level)}</td>
                  <td className="border px-4 py-3">{statusLabel(plan.status)}</td>
                  <td className="border px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-28 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-blue-600"
                          style={{ width: `${Number(plan.progress || 0)}%` }}
                        />
                      </div>
                      <span>{plan.progress || 0}%</span>
                    </div>
                  </td>
                  <td className="border px-4 py-3">
                    {plan.owner_department || "-"} / {plan.owner_name || "-"}
                  </td>
                  <td className="border px-4 py-3">{plan.due_date || "-"}</td>
                  <td className="border px-4 py-3">
                    <button
                      onClick={() => setSelectedPlan(plan)}
                      className="rounded-lg border bg-white px-3 py-2 text-slate-700 hover:bg-slate-100"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}

              {plans.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-slate-500">
                    Төлөвлөгөө бүртгэгдээгүй байна.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 text-sm text-slate-500">
          Дууссан төлөвлөгөө: {completedPlans.length}
        </div>
      </div>

      {(selectedRisk || selectedPlan) && (
        <RiskActionModal
          organizationId={organizationId}
          risk={selectedRisk}
          plan={selectedPlan}
          onClose={() => {
            setSelectedRisk(null);
            setSelectedPlan(null);
            window.location.reload();
          }}
        />
      )}
    </div>
  );
}

function KpiCard({ title, value, note, color = "text-slate-900" }: any) {
  return (
    <div className="rounded-2xl border bg-white p-5 text-slate-900 shadow-sm">
      <p className="text-sm text-slate-500">{title}</p>
      <p className={`mt-3 text-3xl font-bold ${color}`}>{value}</p>
      <p className="mt-2 text-xs text-slate-500">{note}</p>
    </div>
  );
}