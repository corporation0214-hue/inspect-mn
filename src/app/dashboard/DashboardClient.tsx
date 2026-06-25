"use client";

import { useMemo, useState } from "react";
import AIExecutiveSummary from "@/components/dashboard/AIExecutiveSummary";
import InspectionAnalytics from "@/components/dashboard/InspectionAnalytics";
import ComplianceChart from "@/components/dashboard/ComplianceChart";
import EmployeeVoiceChart from "@/components/dashboard/EmployeeVoiceChart";
import RiskMatrix from "@/components/dashboard/RiskMatrix";

function dateOnly(d: Date) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function inRange(item: any, fromDate: string, toDate: string) {
  const raw = item.created_at || item.voice_date || item.date || item.inspection_date;
  if (!raw) return true;

  const d = String(raw).slice(0, 10);
  return d >= fromDate && d <= toDate;
}

export default function DashboardClient({
  org,
  inspections,
  findings,
  complianceItems,
  employeeVoices,
  researchProjects,
  plans = [],
}: any) {
  const today = new Date();

  const [quickFilter, setQuickFilter] = useState("month");
  const [fromDate, setFromDate] = useState(
    dateOnly(new Date(today.getFullYear(), today.getMonth(), 1))
  );
  const [toDate, setToDate] = useState(dateOnly(today));

  function applyQuickFilter(type: string) {
    setQuickFilter(type);

    const now = new Date();
    let from = new Date();

    if (type === "today") {
      from = now;
    }

    if (type === "week") {
      from = new Date(now);
      from.setDate(now.getDate() - 7);
    }

    if (type === "month") {
      from = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    if (type === "quarter") {
      const quarterStartMonth = Math.floor(now.getMonth() / 3) * 3;
      from = new Date(now.getFullYear(), quarterStartMonth, 1);
    }

    if (type === "year") {
      from = new Date(now.getFullYear(), 0, 1);
    }

    if (type !== "custom") {
      setFromDate(dateOnly(from));
      setToDate(dateOnly(now));
    }
  }

  const filtered = useMemo(() => {
    return {
      inspections: inspections.filter((x: any) => inRange(x, fromDate, toDate)),
      findings: findings.filter((x: any) => inRange(x, fromDate, toDate)),
      complianceItems: complianceItems.filter((x: any) =>
        inRange(x, fromDate, toDate)
      ),
      employeeVoices: employeeVoices.filter((x: any) =>
        inRange(x, fromDate, toDate)
      ),
      researchProjects: researchProjects.filter((x: any) =>
        inRange(x, fromDate, toDate)
      ),
    };
  }, [
    inspections,
    findings,
    complianceItems,
    employeeVoices,
    researchProjects,
    fromDate,
    toDate,
  ]);

  const totalInspections = filtered.inspections.length;
  const plannedInspections = filtered.inspections.filter(
    (x: any) =>
      String(x.category || "").toLowerCase() === "planned" ||
      String(x.inspection_type || "").toLowerCase() === "planned"
  ).length;

  const unplannedInspections = filtered.inspections.filter(
    (x: any) =>
      String(x.category || "").toLowerCase() === "unplanned" ||
      String(x.inspection_type || "").toLowerCase() === "unplanned"
  ).length;
  const totalFindings = filtered.findings.length;

  const CLOSED_STATUSES = ["resolved", "closed", "fixed", "mitigated", "reviewed"];

  const activeFindings = filtered.findings.filter(
    (x: any) => !CLOSED_STATUSES.includes(String(x.status || "").toLowerCase())
  );

  const activeVoiceRisks = filtered.employeeVoices.filter(
    (x: any) =>
      (String(x.type || "").toLowerCase() === "risk" ||
        String(x.category || "") === "Эрсдэл") &&
      !CLOSED_STATUSES.includes(String(x.status || "").toLowerCase())
  );

  const highRiskFindings = activeFindings.filter((x: any) =>
    ["high", "critical"].includes(
      String(x.severity || x.risk_level || x.priority || "").toLowerCase()
    )
  );

  const highRiskVoices = activeVoiceRisks.filter((x: any) =>
    ["high", "critical"].includes(
      String(x.priority || x.severity || x.risk_level || "").toLowerCase()
    )
  );

  const highRisk = highRiskFindings.length + highRiskVoices.length;

  const avgCompliance =
    filtered.complianceItems.length > 0
      ? Math.round(
          filtered.complianceItems.reduce(
            (sum: number, x: any) => sum + Number(x.compliance_score || 0),
            0
          ) / filtered.complianceItems.length
        )
      : 0;

  const closedActions = filtered.findings.filter((x: any) =>
    ["resolved", "closed"].includes(String(x.status || "").toLowerCase())
  ).length;

  const actionRate =
    totalFindings > 0 ? Math.round((closedActions / totalFindings) * 100) : 0;


  const openFindings = activeFindings.length;

  
  const plannedHighRisk =
    plans.filter(
      (x:any)=>
        ["high","critical"].includes(
          String(x.risk_level || "").toLowerCase()
        )
    ).length;
  
  return (
    <div className="space-y-6 text-slate-900 dark:text-slate-100">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Ерөнхий самбар
          </h1>
          <p className="text-slate-500">
            {org?.name || "Байгууллага"} — Мэдээллийн хянах самбар
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center">
          {[
            ["today", "Өнөөдөр"],
            ["week", "7 хоног"],
            ["month", "Энэ сар"],
            ["quarter", "Улирал"],
            ["year", "Энэ жил"],
            ["custom", "Custom"],
          ].map(([key, label]) => (
            <button
              key={key}
              onClick={() => applyQuickFilter(key)}
              className={`rounded-xl border border-slate-300 px-3 py-2 text-sm shadow-sm dark:border-slate-700 ${
                quickFilter === key
                  ? "bg-blue-600 text-white"
                  : "bg-white text-slate-800 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              {label}
            </button>
          ))}

          <input
            type="date"
            value={fromDate}
            onChange={(e) => {
              setQuickFilter("custom");
              setFromDate(e.target.value);
            }}
            className="min-w-0 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          />

          <span className="text-slate-500">→</span>

          <input
            type="date"
            value={toDate}
            onChange={(e) => {
              setQuickFilter("custom");
              setToDate(e.target.value);
            }}
            className="min-w-0 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 text-center">
        <KpiCard
          title="Хяналт шалгалт"
          value={totalInspections}
          note={`Төлөвлөгөөт: ${plannedInspections} · Төлөвлөгөөт бус: ${unplannedInspections}`}          
        />

        <KpiCard
          title="Илэрсэн зөрчил"
          value={totalFindings}
          note={`Нээлттэй: ${openFindings}`}
          color="text-red-600"
        />

        <KpiCard
          title="Арга хэмжээний биелэлт"
          value={`${actionRate}%`}
          note={`Хаагдсан: ${closedActions}/${totalFindings}`}
          color="text-green-600"
        />

        <KpiCard
          title="Журмын хэрэгжилт"
          value={`${avgCompliance}%`}
          note={`Нийт журам: ${filtered.complianceItems.length}`}
          color="text-blue-600"
        />

        <KpiCard
          title="Ажилчдын дуу хоолой"
          value={filtered.employeeVoices.length}
          note={`Нээлттэй: ${
            filtered.employeeVoices.filter(
              (x: any) => !["closed", "resolved", "approved"].includes(String(x.status).toLowerCase())
            ).length
          }`}
          color="text-purple-600"
        />

        <KpiCard
          title="Өндөр эрсдэл"
          value={highRisk}
          note={`Зөрчил: ${highRiskFindings.length} · Дуу, хоолой: ${highRiskVoices.length} · Төлөвлөгөөтэй: ${plannedHighRisk}`}
          color="text-orange-600"
        />
    
      </div>

      <ModuleCard
        title="AI удирдлагын товч дүгнэлт"
        description="Өнөөдрийн удирдлагын товч дүгнэлт"
      >
        <AIExecutiveSummary />
      </ModuleCard>

      <div className="grid gap-4 xl:grid-cols-2">
        <ModuleCard
          title="Хяналт шалгалтын аналитик"
            description="Төрөл, төлөвлөгөө"
        >
          <InspectionAnalytics
            inspections={filtered.inspections}
            findings={filtered.findings}
          />
        </ModuleCard>

        <ModuleCard
          title=""
          description=""
        >
          <ComplianceChart items={filtered.complianceItems} />
        </ModuleCard>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <ModuleCard
          title=""
          description=""
        >
          <EmployeeVoiceChart voices={filtered.employeeVoices} />
        </ModuleCard>

        <ModuleCard
          title=""
          description=""
        >
          <RiskMatrix
            findings={filtered.findings}
            voices={filtered.employeeVoices}
          />
        </ModuleCard>
      </div>
    </div>
  );
}

function KpiCard({ title, value, note, color = "text-slate-900 dark:text-slate-100" }: any) {
  return (
    <div className="min-h-[120px] rounded-2xl border border-slate-300 bg-white p-4 text-slate-900 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
      <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
      <p className={`mt-3 text-3xl font-bold leading-tight ${color}`}>{value}</p>
      <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{note}</p>
    </div>
  );
}

function ModuleCard({ title, description, children }: any) {
  return (
    <section className="rounded-2xl border border-slate-300 bg-white p-5 text-slate-900 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
      {(title || description) && (
        <div className="mb-4">
          {title && <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">{title}</h2>}
          {description && <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>}
        </div>
      )}
      {children}
    </section>
  );
}