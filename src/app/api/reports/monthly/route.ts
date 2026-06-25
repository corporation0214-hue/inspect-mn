import { NextResponse } from "next/server";
import { adminSupabase } from "@/lib/supabase/admin";
import { sendTelegramMessage } from "@/lib/telegram/sendMessage";
import { getSystemSettings } from "@/lib/reports/settings";
import { getTelegramReportRecipients } from "@/lib/reports/recipients";
import { getMonthlyRange } from "@/lib/reports/dateRange";

const CLOSED_STATUSES = ["closed", "resolved", "fixed", "mitigated", "reviewed"];
const HIGH_RISK_LEVELS = ["high", "critical"];

function isClosed(status: any) {
  return CLOSED_STATUSES.includes(String(status || "").toLowerCase());
}

function isHighRisk(value: any) {
  return HIGH_RISK_LEVELS.includes(String(value || "").toLowerCase());
}

function topByCategory(items: any[], key: string, limit = 5) {
  const counts: Record<string, number> = {};

  for (const item of items) {
    const value = String(item?.[key] || "-");
    counts[value] = (counts[value] || 0) + 1;
  }

  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit);
}

export async function GET() {
  try {
    const settings = await getSystemSettings();

    if (!settings.enabled("monthly_report_enabled", "false")) {
      return NextResponse.json({
        ok: true,
        skipped: "monthly report disabled",
      });
    }

    if (!settings.enabled("report_telegram_enabled", "true")) {
      return NextResponse.json({
        ok: true,
        skipped: "telegram report disabled",
      });
    }

    const range = getMonthlyRange();

    const { data: inspections } = await adminSupabase
      .from("inspections")
      .select("*")
      .gte("created_at", range.from)
      .lte("created_at", range.to);

    const { data: findings } = await adminSupabase
      .from("findings")
      .select("*")
      .gte("created_at", range.from)
      .lte("created_at", range.to);

    const { data: voices } = await adminSupabase
      .from("employee_voice")
      .select("*")
      .gte("created_at", range.from)
      .lte("created_at", range.to);

    const { data: compliance } = await adminSupabase
      .from("compliance_items")
      .select("*");

    const { data: riskPlans } = await adminSupabase
      .from("risk_action_plans")
      .select("*");

    const { data: allFindings } = await adminSupabase
      .from("findings")
      .select("*");

    const { data: allVoices } = await adminSupabase
      .from("employee_voice")
      .select("*");

    const monthlyHighFindings =
      findings?.filter((x: any) =>
        isHighRisk(x.severity || x.risk_level || x.priority)
      ).length ?? 0;

    const monthlyHighVoices =
      voices?.filter((x: any) =>
        isHighRisk(x.priority || x.severity || x.risk_level)
      ).length ?? 0;

    const resolvedFindings =
      findings?.filter((x: any) => isClosed(x.status)).length ?? 0;

    const openFindings =
      allFindings?.filter((x: any) => !isClosed(x.status)).length ?? 0;

    const openHighFindings =
      allFindings?.filter(
        (x: any) =>
          !isClosed(x.status) &&
          isHighRisk(x.severity || x.risk_level || x.priority)
      ).length ?? 0;

    const openVoices =
      allVoices?.filter((x: any) => !isClosed(x.status)).length ?? 0;

    const openRiskVoices =
      allVoices?.filter(
        (x: any) =>
          !isClosed(x.status) &&
          (String(x.type || "").toLowerCase() === "risk" ||
            String(x.category || "") === "Эрсдэл")
      ).length ?? 0;

    const validComplianceScores =
        compliance
            ?.map((x: any) => Number(x.compliance_score))
            .filter((x: number) => Number.isFinite(x)) ?? [];

    const complianceScore =
        validComplianceScores.length > 0
            ? Math.round(
                validComplianceScores.reduce((sum, x) => sum + x, 0) /
                validComplianceScores.length
            )
            : 0;

    const riskPlansDone =
      riskPlans?.filter((x: any) => isClosed(x.status)).length ?? 0;

    const riskPlanScore =
      riskPlans && riskPlans.length > 0
        ? Math.round((riskPlansDone / riskPlans.length) * 100)
        : 0;

    const topFindingCategories = topByCategory(findings ?? [], "category", 5);
    const topVoiceCategories = topByCategory(voices ?? [], "category", 5);
    const topFindingDepartments = topByCategory(findings ?? [], "department", 5);
    const topVoiceDepartments = topByCategory(voices ?? [], "department", 5);

    const lines = [
      `📊 <b>INSPECT.MN Monthly Report</b>`,
      ``,
      `📅 Хугацаа: ${range.label}`,
      ``,
      `━━━━━━━━━━━━`,
      ``,
      `📌 <b>Сарын нэгдсэн KPI</b>`,
      ``,
    ];

    if (settings.enabled("monthly_include_kpi_summary", "true")) {
      lines.push(`Хяналт шалгалт: <b>${inspections?.length ?? 0}</b>`);
      lines.push(`Илэрсэн зөрчил: <b>${findings?.length ?? 0}</b>`);
      lines.push(`Шийдвэрлэсэн зөрчил: <b>${resolvedFindings}</b>`);
      lines.push(`Ажилчдын дуу хоолой: <b>${voices?.length ?? 0}</b>`);
      lines.push(`Өндөр/ноцтой зөрчил: <b>${monthlyHighFindings}</b>`);
      lines.push(`Өндөр/ноцтой дуу хоолой: <b>${monthlyHighVoices}</b>`);
    }

    if (settings.enabled("monthly_include_department_performance", "true")) {
      lines.push(``);
      lines.push(`━━━━━━━━━━━━`);
      lines.push(``);
      lines.push(`🏢 <b>Хэлтэс / алба нэгжийн үзүүлэлт</b>`);
      lines.push(``);

      if (topFindingDepartments.length > 0) {
        lines.push(`Зөрчил их бүртгэгдсэн алба:`);
        topFindingDepartments.forEach(([name, count], index) => {
          lines.push(`${index + 1}. ${name}: <b>${count}</b>`);
        });
      } else {
        lines.push(`Зөрчил их бүртгэгдсэн алба: бүртгэлгүй`);
      }

      lines.push(``);

      if (topVoiceDepartments.length > 0) {
        lines.push(`Дуу хоолой их бүртгэгдсэн алба:`);
        topVoiceDepartments.forEach(([name, count], index) => {
          lines.push(`${index + 1}. ${name}: <b>${count}</b>`);
        });
      } else {
        lines.push(`Voice их бүртгэгдсэн алба: бүртгэлгүй`);
      }
    }

    if (settings.enabled("monthly_include_compliance_trend", "true")) {
      lines.push(``);
      lines.push(`━━━━━━━━━━━━`);
      lines.push(``);
      lines.push(`📘 <b>Журмын хэрэгжилт</b>`);
      lines.push(`Журмын хэрэгжилт: <b>${complianceScore}%</b>`);
      lines.push(`Нийт журам / шаардлага: <b>${compliance?.length ?? 0}</b>`);
    }

    if (settings.enabled("monthly_include_repeated_findings", "true")) {
      lines.push(``);
      lines.push(`━━━━━━━━━━━━`);
      lines.push(``);
      lines.push(`🔁 <b>Давтагдсан / топ асуудлууд</b>`);
      lines.push(``);

      if (topFindingCategories.length > 0) {
        lines.push(`Зөрчлийн топ ангилал:`);
        topFindingCategories.forEach(([name, count], index) => {
          lines.push(`${index + 1}. ${name}: <b>${count}</b>`);
        });
      } else {
        lines.push(`Зөрчлийн топ ангилал: бүртгэлгүй`);
      }

      lines.push(``);

      if (topVoiceCategories.length > 0) {
        lines.push(`Дуу хоолой топ ангилал:`);
        topVoiceCategories.forEach(([name, count], index) => {
          lines.push(`${index + 1}. ${name}: <b>${count}</b>`);
        });
      } else {
        lines.push(`Дуу хоолой топ ангилал: бүртгэлгүй`);
      }
    }

    if (settings.enabled("monthly_include_risk_plan_status", "true")) {
      lines.push(``);
      lines.push(`━━━━━━━━━━━━`);
      lines.push(``);
      lines.push(`🎯 <b>Эрсдэлийг арилгах төлөвлөгөө</b>`);
      lines.push(`Төлөвлөгөөний биелэлт: <b>${riskPlanScore}%</b>`);
      lines.push(`Нийт төлөвлөгөө: <b>${riskPlans?.length ?? 0}</b>`);
      lines.push(`Хаагдсан төлөвлөгөө: <b>${riskPlansDone}</b>`);
    }

    if (settings.enabled("monthly_include_voice_trend", "true")) {
      lines.push(``);
      lines.push(`━━━━━━━━━━━━`);
      lines.push(``);
      lines.push(`🗣 <b>Ажилчдын дуу хоолой</b>`);
      lines.push(`Сарын нийт бүртгэл: <b>${voices?.length ?? 0}</b>`);
      lines.push(`Одоогийн нээлттэй Voice: <b>${openVoices}</b>`);
      lines.push(`Одоогийн дуу хоолойн эрсдэл Risk: <b>${openRiskVoices}</b>`);
    }

    lines.push(``);
    lines.push(`━━━━━━━━━━━━`);
    lines.push(``);
    lines.push(`📍 <b>Одоогийн нээлттэй эрсдэл</b>`);
    lines.push(``);
    lines.push(`Нээлттэй зөрчил: <b>${openFindings}</b>`);
    lines.push(`Нээлттэй өндөр/ноцтой зөрчил: <b>${openHighFindings}</b>`);
    lines.push(`Нээлттэй дуу хоолойн эрсдэл: <b>${openRiskVoices}</b>`);

    if (settings.enabled("monthly_include_ai_summary", "true")) {
      const totalUrgent = openHighFindings + openRiskVoices;
      const monthlyUrgent = monthlyHighFindings + monthlyHighVoices;

      lines.push(``);
      lines.push(`━━━━━━━━━━━━`);
      lines.push(``);
      lines.push(`🤖 <b>AI Сарын гүйцэтгэлийн хураангуй</b>`);
      lines.push(``);

      lines.push(
        `• Энэ сард ${findings?.length ?? 0} зөрчил, ${
          voices?.length ?? 0
        } ажилтны дуу хоолой бүртгэгдсэн.`
      );

      if (monthlyUrgent > 0) {
        lines.push(
          `• Сарын хугацаанд өндөр/ноцтой түвшний <b>${monthlyUrgent}</b> шинэ эрсдэл бүртгэгдсэн.`
        );
      } else {
        lines.push(`• Энэ сард шинэ өндөр/ноцтой эрсдэл бүртгэгдээгүй.`);
      }

      if (totalUrgent > 0) {
        lines.push(
          `• Одоогоор удирдлагын анхаарал шаардсан <b>${totalUrgent}</b> нээлттэй эрсдэл байна.`
        );
      } else {
        lines.push(`• Одоогоор өндөр/ноцтой нээлттэй эрсдэл бүртгэгдээгүй байна.`);
      }

      lines.push(`• Журмын хэрэгжилтийн түвшин <b>${complianceScore}%</b> байна.`);
      lines.push(`• Эрсдэлийн арга хэмжээний төлөвлөгөөний биелэлт <b>${riskPlanScore}%</b> байна.`);
    }

    if (settings.enabled("monthly_include_pdf_attachment", "true")) {
      lines.push(``);
      lines.push(`PDF хавсралт: дараагийн хувилбарт автоматаар үүсгэнэ.`);
    }

    lines.push(``);
    lines.push(`Тайлан автоматаар илгээгдэв.`);

    const message = lines.join("\n");

    const recipients = await getTelegramReportRecipients("monthly");

    if (!recipients || recipients.length === 0) {
      return NextResponse.json({
        ok: true,
        skipped: "No monthly report recipients",
      });
    }

    for (const user of recipients) {
      if (!user.telegram_id) continue;
      await sendTelegramMessage(String(user.telegram_id), message);
    }

    return NextResponse.json({
      ok: true,
      sent: true,
      type: "monthly",
      recipients: recipients.length,
      range: range.label,

      monthly: {
        inspections: inspections?.length ?? 0,
        findings: findings?.length ?? 0,
        voices: voices?.length ?? 0,
        highFindings: monthlyHighFindings,
        highVoices: monthlyHighVoices,
        resolvedFindings,
        complianceScore,
        riskPlanScore,
      },

      current: {
        openFindings,
        openHighFindings,
        openVoices,
        openRiskVoices,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        ok: false,
        error: error.message || "Monthly report failed",
      },
      { status: 500 }
    );
  }
}