"use client";

import { useMemo, useState } from "react";
import ReportSummaryCard from "@/components/reports/ReportSummaryCard";
import ReportTable from "@/components/reports/ReportTable";

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
}: {
  inspections: any[];
  findings: any[];
  compliance: any[];
  research: any[];
}) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [moduleFilter, setModuleFilter] = useState("all");
  const [showReport, setShowReport] = useState(false);

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
    ];

    return allRows.filter((row) => {
      const matchModule = moduleFilter === "all" || row.module === moduleFilter;
      const matchDate =
        !startDate && !endDate ? true : inDateRange(row.date, startDate, endDate);

      return matchModule && matchDate;
    });
  }, [inspections, findings, compliance, research, startDate, endDate, moduleFilter]);

  const inspectionCount = reportRows.filter((x) => x.module === "Inspection").length;
  const findingCount = reportRows.filter((x) => x.module === "Finding").length;
  const complianceCount = reportRows.filter((x) => x.module === "Compliance").length;
  const researchCount = reportRows.filter((x) => x.module === "R&D").length;

  const openFindings = reportRows.filter(
    (x) => x.module === "Finding" && x.status === "open"
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
            }

            .header {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              border-bottom: 2px solid #0f172a;
              padding-bottom: 12px;
              margin-bottom: 16px;
            }

            .brand {
              font-size: 28px;
              font-weight: 900;
              letter-spacing: -0.5px;
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
              padding: 12px;
            }

            .card-label {
              font-size: 12px;
              color: #64748b;
            }

            .card-value {
              font-size: 24px;
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

            table {
              width: 100%;
              border-collapse: collapse;
              font-size: 10.5px;
            }

            th, td {
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
          <div class="header">
            <div>
              <div class="brand">INSPECT.MN — Нэгдсэн тайлан</div>
              <div class="subtitle">Internal Control Platform</div>
            </div>

            <div class="meta">
              <div>Тайлангийн хугацаа: ${startDate || "-"} — ${endDate || "-"}</div>
              <div>Модуль: ${moduleFilter === "all" ? "Бүх модуль" : moduleFilter}</div>
              <div>Үүсгэсэн огноо: ${new Date().toISOString().slice(0, 10)}</div>
            </div>
          </div>

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

          <div class="footer">
            <div>Generated by INSPECT.MN</div>
            <div>Smart Control System</div>
          </div>
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
          </select>

          <button
            onClick={handleGenerateReport}
            className="rounded-xl bg-blue-600 px-5 py-3 text-white"
          >
            Тайлан гаргах
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border bg-white p-5">
          <p className="text-sm text-slate-500">Хяналт шалгалт</p>
          <p className="text-3xl font-bold">{inspectionCount}</p>
        </div>

        <div className="rounded-2xl border bg-white p-5">
          <p className="text-sm text-slate-500">Зөрчил</p>
          <p className="text-3xl font-bold text-red-600">{findingCount}</p>
        </div>

        <div className="rounded-2xl border bg-white p-5">
          <p className="text-sm text-slate-500">Compliance</p>
          <p className="text-3xl font-bold text-green-600">{complianceCount}</p>
        </div>

        <div className="rounded-2xl border bg-white p-5">
          <p className="text-sm text-slate-500">R&D</p>
          <p className="text-3xl font-bold text-blue-600">{researchCount}</p>
        </div>
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
                  <p className="text-sm text-slate-500">
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
              <div className="space-y-5">

                <div className="report-summary-grid grid gap-3 md:grid-cols-5">
                  <ReportSummaryCard label="Нийт ажил" value={reportRows.length} />
                  <ReportSummaryCard label="ХШ" value={inspectionCount} />
                  <ReportSummaryCard label="Зөрчил" value={findingCount} color="text-red-600" />
                  <ReportSummaryCard label="Нээлттэй зөрчил" value={openFindings} color="text-orange-600" />
                  <ReportSummaryCard label="R&D" value={researchCount} color="text-blue-600" />
                </div>

                <div className="report-table-wrapper max-h-[460px] overflow-auto rounded-xl border">
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