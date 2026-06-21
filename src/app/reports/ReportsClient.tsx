"use client";

import { useMemo, useState } from "react";
import ReportSummaryCard from "@/components/reports/ReportSummaryCard";
import ReportTable from "@/components/reports/ReportTable";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function getDateOnly(value?: string | null) {
  if (!value) return "";
  return value.slice(0, 10);
}

function inDateRange(dateValue: string, start: string, end: string) {
  if (!dateValue) return false;
  if (start && dateValue < start) return false;
  if (end && dateValue > end) return false;
  return true;
}

export default function ReportsClient({
  inspections,
  findings,
  compliance,
  research,
  voice,
}: {
  inspections: any[];
  findings: any[];
  compliance: any[];
  research: any[];
  voice: any[];
}) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [moduleFilter, setModuleFilter] = useState("all");
  const [showReport, setShowReport] = useState(false);
  const employeeVoices = voice || [];

  const reportNumber = useMemo(
    () =>
      "INS-RPT-" +
      new Date().getFullYear() +
      "-" +
      String(Date.now()).slice(-6),
    []
  );

  const reportRows = useMemo(() => {
    const allRows = [
      ...inspections.map((x) => ({
        module: "Inspection",
        title: x.title,
        status: x.status,
        category: x.type || x.category,
        owner: x.performed_by || x.registered_by,
        date: getDateOnly(x.inspection_date || x.created_at),
      })),
      ...findings.map((x) => ({
        module: "Finding",
        title: x.title,
        status: x.status,
        category: x.category || x.severity,
        owner: x.owner,
        date: getDateOnly(x.created_at),
      })),
      ...compliance.map((x) => ({
        module: "Compliance",
        title: x.title,
        status: x.status,
        category: x.item_type || x.framework,
        owner: x.responsible_person || x.owner_department,
        date: getDateOnly(x.next_review_date || x.created_at),
      })),
      ...research.map((x) => ({
        module: "R&D",
        title: x.title,
        status: x.status,
        category: x.category || x.priority,
        owner: x.owner,
        date: getDateOnly(x.start_date || x.end_date || x.created_at),
      })),

      ...employeeVoices.map((x) => ({
        module: "Employee Voice",
        title: x.title,
        status: x.status,
        category: x.category,
        owner: x.department,
        date: getDateOnly(x.voice_date || x.created_at),
      })),
    ];

    return allRows.filter((row) => {
      const matchModule = moduleFilter === "all" || row.module === moduleFilter;
      const matchDate =
        !startDate && !endDate ? true : inDateRange(row.date, startDate, endDate);

      return matchModule && matchDate;
    });
  }, [inspections, findings, compliance, research, employeeVoices, startDate, endDate, moduleFilter]);

  const inspectionCount = reportRows.filter((x) => x.module === "Inspection").length;
  const findingCount = reportRows.filter((x) => x.module === "Finding").length;
  const complianceCount = reportRows.filter((x) => x.module === "Compliance").length;
  const researchCount = reportRows.filter((x) => x.module === "R&D").length;
  
  const openFindings = reportRows.filter(
    (x) => x.module === "Finding" && x.status === "open"
  ).length;

  const voiceCount = employeeVoices.length;

  const suggestionCount =
    employeeVoices.filter(
      (x) => x.category === "suggestion"
    ).length;

  const complaintCount =
    employeeVoices.filter(
      (x) => x.category === "complaint"
    ).length;

  const riskVoiceCount =
    employeeVoices.filter(
      (x) => x.category === "risk"
    ).length;

  const violationCount =
    employeeVoices.filter(
      (x) => x.category === "violation"
    ).length;

  const confidentialCount =
    employeeVoices.filter(
      (x) => x.category === "confidential"
    ).length;

  const openVoiceCount =
    employeeVoices.filter(
      (x) => x.status !== "closed"
    ).length;

  const closedVoiceCount =
    employeeVoices.filter(
      (x) => x.status === "closed"
    ).length;

  const highVoiceCount =
    employeeVoices.filter(
      (x) =>
        x.priority === "high" ||
        x.priority === "critical"
    ).length;

  function printReport() {
    const rowsHtml = reportRows
      .map(
        (x) => `
        <tr>
          <td>${x.module || "-"}</td>
          <td>${x.title || "-"}</td>
          <td>${x.status || "-"}</td>
          <td>${x.category || "-"}</td>
          <td>${x.owner || "-"}</td>
          <td>${x.date || "-"}</td>
        </tr>
      `
      )
      .join("");

    const html = `
    <html>
      <head>
        <title>INSPECT.MN Тайлан</title>
        <style>
          @page {
            size: A4 landscape;
            margin: 10mm;
          }

          body{
            font-family:Arial,sans-serif;
            padding:20px;
            color:#0f172a;
          }

          h1{
            font-size:28px;
            margin-bottom:4px;
          }

          .period{
            color:#64748b;
            margin-bottom:20px;
          }

          .summary{
            display:grid;
            grid-template-columns:repeat(5,1fr);
            gap:12px;
            margin-bottom:20px;
          }

          .card{
            border:1px solid #cbd5e1;
            border-radius:10px;
            padding:12px;
          }

          .value{
            font-size:24px;
            font-weight:bold;
          }

          table{
            width:100%;
            border-collapse:collapse;
            font-size:11px;
          }

          th,td{
            border:1px solid #cbd5e1;
            padding:6px;
          }

          th{
            background:#f1f5f9;
          }
        </style>
      </head>

      <body>

        <h1>INSPECT.MN — Нэгдсэн тайлан</h1>

        <div class="period">
          Тайлангийн хугацаа:
          ${startDate || "-"} —
          ${endDate || "-"}
          ·
          ${moduleFilter === "all" ? "Бүх модуль" : moduleFilter}
        </div>

        <div class="summary">

          <div class="card">
            <div>Нийт ажил</div>
            <div class="value">${reportRows.length}</div>
          </div>

          <div class="card">
            <div>ХШ</div>
            <div class="value">${inspectionCount}</div>
          </div>

          <div class="card">
            <div>Зөрчил</div>
            <div class="value">${findingCount}</div>
          </div>

          <div class="card">
            <div>Нээлттэй зөрчил</div>
            <div class="value">${openFindings}</div>
          </div>

          <div class="card">
            <div>R&D</div>
            <div class="value">${researchCount}</div>
          </div>

        </div>

        <table>

          <thead>
            <tr>
              <th>Модуль</th>
              <th>Нэр</th>
              <th>Төлөв</th>
              <th>Ангилал</th>
              <th>Хариуцагч</th>
              <th>Огноо</th>
            </tr>
          </thead>

          <tbody>
            ${rowsHtml}
          </tbody>

        </table>

      </body>
    </html>
    `;

    const printWindow = window.open("", "_blank");

    if (!printWindow) {
      alert("Popup blocked байна.");
      return;
    }

    printWindow.document.write(html);
    printWindow.document.close();

    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
    }, 500);
  }

  async function generatePdf() {
    
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });
    doc.text(`R&D: ${researchCount}`, 195, 35);
    doc.setFontSize(18);
    doc.text("INSPECT.MN - Integrated Report", 14, 15);

    doc.setFontSize(10);
    doc.text(
      `Period: ${startDate || "-"} - ${endDate || "-"}`,
      14,
      22
    );

    doc.setFontSize(12);

    doc.text(`Total Activities: ${reportRows.length}`, 14, 35);
    doc.text(`Inspections: ${inspectionCount}`, 60, 35);
    doc.text(`Findings: ${findingCount}`, 105, 35);
    doc.text(`Open Findings: ${openFindings}`, 145, 35);
    doc.text(
      `R&D: ${
        reportRows.filter((x:any) => x.module === "R&D").length
      }`,
      195,
      35
    );

    autoTable(doc, {
      startY: 45,

      head: [[
        "Module",
        "Name",
        "Status",
        "Category",
        "Responsible",
        "Date",
      ]],

      body: reportRows.map((x: any) => [
        x.module,
        x.title,
        x.status,
        x.category,
        x.owner,
        x.date,
      ]),

      styles: {
        fontSize: 8,
      },

      headStyles: {
        fillColor: [30, 64, 175],
      },
    });

    doc.save(
      `INSPECT_Report_${startDate}_${endDate}.pdf`
    );

    await fetch("/api/reports/history", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        report_no: reportNumber,
        report_name: "Integrated Management Report",
        start_date: startDate,
        end_date: endDate,
        module_filter: moduleFilter,
        total_records: reportRows.length,
        generated_by: "Admin",
      }),
    });

  }

  function buildReportHtml() {
    const rowsHtml = reportRows
      .map(
        (x) => `
          <tr>
            <td>${x.module || "-"}</td>
            <td>${x.title || "-"}</td>
            <td>${x.status || "-"}</td>
            <td>${x.category || "-"}</td>
            <td>${x.owner || "-"}</td>
            <td>${x.date || "-"}</td>
          </tr>
        `
      )
      .join("");

    const complianceRows = reportRows.filter((x) => x.module === "Compliance");
    const findingRows = reportRows.filter((x) => x.module === "Finding");

    const highRisk = findingRows.filter(
      (x) => x.category === "high" || x.category === "critical"
    ).length;

    const departmentGroups = reportRows.reduce((acc: Record<string, number>, x) => {
      const key = x.owner || "Тодорхойгүй";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const departmentRowsHtml = Object.entries(departmentGroups)
      .map(
        ([department, count]) => `
          <tr>
            <td>${department}</td>
            <td>${count}</td>
          </tr>
        `
      )
      .join("");

    const complianceSummaryHtml = `
      <div class="summary-box">
        <h3>Compliance Summary</h3>
        <p>Нийт compliance бүртгэл: <b>${complianceRows.length}</b></p>
        <p>Идэвхтэй журам, стандарт, зааварчилгаа: <b>${complianceRows.length}</b></p>
        <p>Тайлант хугацаанд хамаарах compliance item-уудыг нэгтгэн харууллаа.</p>
      </div>
    `;

    const findingsSummaryHtml = `
      <div class="summary-box">
        <h3>Findings Summary</h3>
        <p>Нийт илэрсэн зөрчил: <b>${findingCount}</b></p>
        <p>Нээлттэй зөрчил: <b>${openFindings}</b></p>
        <p>Өндөр / critical түвшний зөрчил: <b>${highRisk}</b></p>
      </div>
    `;
    
    const employeeVoiceSummaryHtml = `
      <div class="summary-box">
        <h3>Employee Voice Summary</h3>
        <p>Нийт бүртгэл: <b>${voiceCount}</b></p>
        <p>Санал: <b>${suggestionCount}</b></p>
        <p>Гомдол: <b>${complaintCount}</b></p>
        <p>Эрсдэл: <b>${riskVoiceCount}</b></p>
        <p>Өндөр ач холбогдол: <b>${highVoiceCount}</b></p>
      </div>
      `;

    const conclusionText =
      openFindings > 0
        ? "Тайлант хугацаанд нээлттэй зөрчил бүртгэгдсэн тул хариуцсан алба, нэгжүүд засах арга хэмжээг хугацаанд нь хэрэгжүүлэх шаардлагатай."
        : "Тайлант хугацаанд нээлттэй зөрчилгүй байгаа нь дотоод хяналтын хэрэгжилт тогтвортой байгааг харуулж байна.";

    return `
      <html>
        <head>
          <meta charset="utf-8" />
          <title>INSPECT.MN Тайлан</title>

          <style>
            @page {
              size: A4 landscape;
              margin: 10mm;
            }

            body {
              font-family: Arial, sans-serif;
              color: #0f172a;
              margin: 0;
              padding: 0;
              font-size: 12px;
            }

            .page {
              page-break-after: always;
            }

            .page:last-child {
              page-break-after: auto;
            }

            .header {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              border-bottom: 3px solid #0f172a;
              padding-bottom: 12px;
              margin-bottom: 18px;
            }

            .logo {
              font-size: 30px;
              font-weight: 900;
              letter-spacing: -1px;
            }

            .subtitle {
              color: #64748b;
              font-size: 13px;
              margin-top: 4px;
            }

            .meta {
              text-align: right;
              font-size: 12px;
              color: #475569;
              line-height: 1.6;
            }

            .section-title {
              font-size: 20px;
              font-weight: 800;
              margin: 18px 0 10px;
            }

            .summary {
              display: grid;
              grid-template-columns: repeat(5, 1fr);
              gap: 10px;
              margin-bottom: 18px;
            }

            .card {
              border: 1px solid #334155;
              border-radius: 10px;
              padding: 14px;
            }

            .card-label {
              font-size: 12px;
              color: #64748b;
            }

            .card-value {
              font-size: 26px;
              font-weight: 900;
              margin-top: 4px;
            }

            .red {
              color: #dc2626;
            }

            .orange {
              color: #ea580c;
            }

            .blue {
              color: #2563eb;
            }

            .grid-2 {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 14px;
            }

            .summary-box {
              border: 1px solid #334155;
              border-radius: 12px;
              padding: 14px;
              min-height: 120px;
            }

            .summary-box h3 {
              margin: 0 0 10px;
              font-size: 16px;
            }

            .summary-box p {
              margin: 6px 0;
              line-height: 1.45;
            }

            table {
              width: 100%;
              border-collapse: collapse;
              font-size: 10.5px;
            }

            th,
            td {
              border: 1px solid #334155;
              padding: 5px;
              text-align: left;
              vertical-align: top;
            }

            th {
              background: #f1f5f9;
              font-weight: 800;
            }

            tr {
              page-break-inside: avoid;
            }

            .analysis-card {
              border: 1px solid #334155;
              border-radius: 12px;
              padding: 14px;
              margin-bottom: 12px;
            }

            .recommendation {
              border-left: 5px solid #2563eb;
              background: #f8fafc;
              padding: 12px 14px;
              margin-bottom: 10px;
            }

            .footer {
              margin-top: 18px;
              border-top: 1px solid #cbd5e1;
              padding-top: 8px;
              font-size: 11px;
              color: #64748b;
              display: flex;
              justify-content: space-between;
            }
          </style>
        </head>

        <body>
          <!-- PAGE 1 -->
          <section class="page">
            <div class="header">
              <div>
                <div class="logo">INSPECT.MN — Нэгдсэн тайлан</div>
                <div class="subtitle">Internal Control Platform</div>
              </div>

              <div class="meta">
                <div>Тайлангийн хугацаа: ${startDate || "-"} — ${endDate || "-"}</div>
                <div>Модуль: ${moduleFilter === "all" ? "Бүх модуль" : moduleFilter}</div>
                <div>Үүсгэсэн огноо: ${new Date().toISOString().slice(0, 10)}</div>
                <div>Report No: ${reportNumber}</div>
              </div>
            </div>

            <div class="section-title">KPI Summary</div>

            <div class="summary">
              <div class="card">
                <div class="card-label">Нийт ажил</div>
                <div class="card-value">${reportRows.length}</div>
              </div>

              <div class="card">
                <div class="card-label">ХШ</div>
                <div class="card-value">${inspectionCount}</div>
              </div>

              <div class="card">
                <div class="card-label">Зөрчил</div>
                <div class="card-value red">${findingCount}</div>
              </div>

              <div class="card">
                <div class="card-label">Нээлттэй зөрчил</div>
                <div class="card-value orange">${openFindings}</div>
              </div>

              <div class="card">
                <div class="card-label">R&D</div>
                <div class="card-value blue">${researchCount}</div>
              </div>
            </div>

            <div
              style="
              display:grid;
              grid-template-columns:1fr 1fr 1fr;
              gap:14px;
              "
              >
              ${complianceSummaryHtml}
              ${findingsSummaryHtml}
              ${employeeVoiceSummaryHtml}
            </div>

            <div class="section-title">Executive Overview</div>

            <div class="summary-box">
              <p>
                Тайлант хугацаанд нийт <b>${reportRows.length}</b> ажил, бүртгэл,
                хяналт шалгалт болон хөгжүүлэлтийн мэдээлэл нэгтгэгдсэн байна.
              </p>
              <p>
                Илэрсэн нийт зөрчил <b>${findingCount}</b>, үүнээс нээлттэй зөрчил
                <b>${openFindings}</b> байна.
              </p>
              <p>
                Энэхүү тайлан нь ISO аудит, удирдлагын хурал болон ТУЗ-ийн түвшний
                мэдээлэлд ашиглах зориулалттай.
              </p>
            </div>

            <div class="footer">
              <div>Generated by INSPECT.MN</div>
              <div>Smart Control System</div>
            </div>
          </section>

          <!-- PAGE 2 -->
          <section class="page">
            <div class="header">
              <div>
                <div class="logo">INSPECT.MN — Нэгдсэн хүснэгт</div>
                <div class="subtitle">Тайлант хугацааны бүх бүртгэлийн жагсаалт</div>
              </div>

              <div class="meta">
                <div>${startDate || "-"} — ${endDate || "-"}</div>
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Модуль</th>
                  <th>Нэр</th>
                  <th>Төлөв</th>
                  <th>Ангилал</th>
                  <th>Хариуцагч</th>
                  <th>Огноо</th>
                </tr>
              </thead>

              <tbody>
                ${rowsHtml}
              </tbody>
            </table>

            <div class="section-title">Алба, нэгжээр ангилсан дүн шинжилгээ</div>

            <table>
              <thead>
                <tr>
                  <th>Алба / Нэгж / Хариуцагч</th>
                  <th>Бүртгэлийн тоо</th>
                </tr>
              </thead>

              <tbody>
                ${departmentRowsHtml}
              </tbody>
            </table>

            <div class="footer">
              <div>Generated by INSPECT.MN</div>
              <div>Smart Control System</div>
            </div>
          </section>

          <!-- PAGE 3 -->
          <section class="page">
            <div class="header">
              <div>
                <div class="logo">INSPECT.MN — Дүн шинжилгээ ба зөвлөмж</div>
                <div class="subtitle">Risk, Compliance, Conclusion</div>
              </div>

              <div class="meta">
                <div>${startDate || "-"} — ${endDate || "-"}</div>
              </div>
            </div>

            <div class="grid-2">
              <div class="analysis-card">
                <h3>Эрсдэлийн дүн шинжилгээ</h3>
                <p>Нийт илэрсэн зөрчил: <b>${findingCount}</b></p>
                <p>Нээлттэй зөрчил: <b>${openFindings}</b></p>
                <p>Өндөр / critical түвшний зөрчил: <b>${highRisk}</b></p>
              </div>

              <div class="analysis-card">
                <h3>Compliance хэрэгжилтийн хувь</h3>
                <p>Тайлант хугацаанд бүртгэгдсэн compliance item: <b>${complianceRows.length}</b></p>
                <p>Compliance бүртгэлийн хэрэгжилтийг дараагийн хувилбарт оноо, эрсдэлийн түвшинтэй холбон тооцно.</p>
              </div>
            </div>

            <div class="analysis-card">
              <h3>Employee Voice Analytics</h3>
              <p>Нийт бүртгэл: <b>${voiceCount}</b></p>
              <p>Нээлттэй: <b>${openVoiceCount}</b></p>
              <p>Хаагдсан: <b>${closedVoiceCount}</b></p>
              <p>Өндөр ач холбогдолтой: <b>${highVoiceCount}</b></p>
            </div>

            <div class="section-title">Дүгнэлт</div>

            <div class="analysis-card">
              <p>${conclusionText}</p>
            </div>

            <div class="section-title">Санал зөвлөмж</div>

            <div class="recommendation">
              1. Нээлттэй зөрчилтэй холбоотой corrective action төлөвлөгөөг хугацаатайгаар баталгаажуулах.
            </div>

            <div class="recommendation">
              2. Compliance item бүрийн хэрэгжилтийн хувийг сар бүр шинэчилж, эрсдэлийн түвшинтэй холбон тайлагнах.
            </div>

            <div class="recommendation">
              3. R&D төслүүдийн явц, гүйцэтгэл, саатлын шалтгааныг удирдлагын тайланд тусгай хэсгээр оруулах.
            </div>

            <div class="recommendation">
              4. Дотоод хяналт, compliance, inspection, CAPA мэдээллийг нэгтгэсэн сар бүрийн dashboard report гаргах.
            </div>

            <div class="footer">
              <div>Generated by INSPECT.MN</div>
              <div>Smart Control System</div>
            </div>
          </section>
        </body>
      </html>
    `;
  }

  async function downloadPdf() {
    try {
      const fileName = `inspect_report_${startDate || "all"}_${endDate || "all"}.pdf`;

      const response = await fetch("/api/reports/pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          html: buildReportHtml(),
          fileName,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.error || "PDF үүсгэхэд алдаа гарлаа");
        return;
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      a.click();

      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      alert(error.message || "PDF татахад алдаа гарлаа");
    }
  }

  function handleGenerateReport() {
    setShowReport(true);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Reports / Тайлан</h1>
        <p className="text-slate-500">
          Хугацаа, төрөл, алба нэгж, ажилтнаар нэгтгэсэн тайлан
        </p>
      </div>

      <div className="rounded-2xl border bg-white p-5">
        <h2 className="mb-4 text-xl font-bold">Тайлангийн нөхцөл сонгох</h2>

        <div className="grid gap-3 md:grid-cols-4">
          <input
            type="date"
            className="rounded-xl border px-4 py-3"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />

          <input
            type="date"
            className="rounded-xl border px-4 py-3"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />

          <select
            className="rounded-xl border px-4 py-3"
            value={moduleFilter}
            onChange={(e) => setModuleFilter(e.target.value)}
          >
            <option value="all">Бүх модуль</option>
            <option value="Inspection">Inspection</option>
            <option value="Finding">Findings</option>
            <option value="Compliance">Compliance</option>
            <option value="R&D">Research & Development</option>
            <option value="Employee Voice">Employee Voice</option>

          </select>

          <button
            onClick={handleGenerateReport}
            className="rounded-xl bg-blue-600 px-5 py-3 text-white"
          >
            Тайлан гаргах
          </button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
        
          <ReportSummaryCard label="Нийт ажил" value={reportRows.length} />
          <ReportSummaryCard label="ХШ" value={inspectionCount} color="text-blue-600" />
          <ReportSummaryCard label="Зөрчил" value={findingCount} color="text-red-600" />
          <ReportSummaryCard label="Compliance" value={complianceCount} color="text-green-600" />
          <ReportSummaryCard label="R&D" value={researchCount} color="text-indigo-600" />
          <ReportSummaryCard label="Voice" value={voiceCount} color="text-purple-600" />
       
      </div>

      <div className="rounded-2xl border bg-white p-5">
        <h2 className="mb-4 text-xl font-bold">Шүүгдсэн ажлын жагсаалт</h2>

        <div className="max-h-[520px] overflow-y-auto rounded-xl border">
          <table className="w-full min-w-[1000px] text-sm">
            <thead className="sticky top-0 bg-slate-100">
              <tr>
                <th className="border px-4 py-3 text-left">Модуль</th>
                <th className="border px-4 py-3 text-left">Нэр</th>
                <th className="border px-4 py-3 text-left">Төлөв</th>
                <th className="border px-4 py-3 text-left">Төрөл / Ангилал</th>
                <th className="border px-4 py-3 text-left">Хариуцагч</th>
                <th className="border px-4 py-3 text-left">Огноо</th>
              </tr>
            </thead>

            <tbody>
              {reportRows.map((x, index) => (
                <tr key={`${x.module}-${index}`} className="hover:bg-slate-50">
                  <td className="border px-4 py-3">{x.module}</td>
                  <td className="border px-4 py-3">{x.title || "-"}</td>
                  <td className="border px-4 py-3">{x.status || "-"}</td>
                  <td className="border px-4 py-3">{x.category || "-"}</td>
                  <td className="border px-4 py-3">{x.owner || "-"}</td>
                  <td className="border px-4 py-3">{x.date || "-"}</td>
                </tr>
              ))}

              {reportRows.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                    Сонгосон нөхцөлөөр мэдээлэл олдсонгүй.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showReport && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4">
          <div className="flex max-h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border bg-white shadow-2xl">
            <div className="print-hidden flex items-start justify-between border-b bg-white p-5">
                <div>
                  <h1 className="text-2xl font-bold">INSPECT.MN — Нэгдсэн тайлан</h1>
                  <p className="text-xs text-slate-500">
                    Тайлангийн хугацаа: {startDate || "Эхлэл"} — {endDate || "Дуусах"} ·{" "}
                    {moduleFilter === "all" ? "Бүх модуль" : moduleFilter}
                  </p>
                </div>
                 <button
                    onClick={() => setShowReport(false)}
                    className="rounded-lg border px-3 py-1"                      
                  >
                    ×
                 </button>         
            </div>
            
            <div id="report-content" className="flex-1 overflow-y-auto p-5 bg-white">
              <div className="space-y-3">

                <div className="report-summary-grid grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
                  <ReportSummaryCard
                    label="Нийт ажил"
                    value={reportRows.length}
                    color="text-slate-900"
                  />

                  <ReportSummaryCard
                    label="ХШ"
                    value={inspectionCount}
                    color="text-blue-600"
                  />

                  <ReportSummaryCard
                    label="Зөрчил"
                    value={findingCount}
                    color="text-red-600"
                  />

                  <ReportSummaryCard
                    label="Нээлттэй"
                    value={openFindings}
                    color="text-orange-600"
                  />

                  <ReportSummaryCard
                    label="R&D"
                    value={researchCount}
                    color="text-indigo-600"
                  />

                  <ReportSummaryCard
                    label="Voice"
                    value={voiceCount}
                    color="text-purple-600"
                  />
                </div>

                <div className="report-table-wrapper mt-3 max-h-[460px] overflow-auto rounded-xl border">
                  <ReportTable rows={reportRows} />
                </div>
              </div>
            </div>

            <div className="print-hidden flex flex-wrap justify-end gap-2 border-t bg-white p-4">
              <button onClick={printReport} className="rounded-xl border px-4 py-2">
                Хэвлэх
              </button>

              <button onClick={downloadPdf} className="rounded-xl border px-4 py-2">
                PDF болгох
              </button>

              <button
                onClick={() => alert("Email илгээх API-г дараагийн алхамд холбоно.")}
                className="rounded-xl border px-4 py-2"
              >
                Email илгээх
              </button>

              <button
                onClick={() => alert("Telegram Bot API-г дараагийн алхамд холбоно.")}
                className="rounded-xl border px-4 py-2"
              >
                Telegram илгээх
              </button>

              <button
                onClick={() => setShowReport(false)}
                className="rounded-xl bg-blue-600 px-4 py-2 text-white"
              >
                Хаах
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}