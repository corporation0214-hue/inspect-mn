import { NextResponse } from "next/server";
import { adminSupabase } from "@/lib/supabase/admin";
import { sendTelegramMessage } from "@/lib/telegram/sendMessage";
import { getSystemSettings } from "@/lib/reports/settings";
import { getTelegramReportRecipients } from "@/lib/reports/recipients";
import { getWeeklyRange } from "@/lib/reports/dateRange";

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

    if (!settings.enabled("weekly_report_enabled", "true")) {
      return NextResponse.json({
        ok: true,
        skipped: "weekly report disabled",
      });
    }

    if (!settings.enabled("report_telegram_enabled", "true")) {
      return NextResponse.json({
        ok: true,
        skipped: "telegram report disabled",
      });
    }

    const range = getWeeklyRange();

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

    const { data: allFindings } = await adminSupabase
      .from("findings")
      .select("*");

    const { data: allVoices } = await adminSupabase
      .from("employee_voice")
      .select("*");

    const weeklyHighFindings =
      findings?.filter((x: any) =>
        isHighRisk(x.severity || x.risk_level || x.priority)
      ).length ?? 0;

    const weeklyHighVoices =
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

    const topFindingCategories = topByCategory(findings ?? [], "category", 5);
    const topVoiceCategories = topByCategory(voices ?? [], "category", 5);

    const lines = [
      `📊 <b>INSPECT.MN Weekly Report</b>`,
      ``,
      `📅 Хугацаа: ${range.label}`,
      ``,
      `━━━━━━━━━━━━`,
      ``,
      `📌 <b>7 хоногийн тойм</b>`,
      ``,
    ];

    if (settings.enabled("weekly_include_inspection_trend", "true")) {
      lines.push(`Хяналт шалгалт: <b>${inspections?.length ?? 0}</b>`);
    }

    if (settings.enabled("weekly_include_findings_progress", "true")) {
      lines.push(`Илэрсэн зөрчил: <b>${findings?.length ?? 0}</b>`);
      lines.push(`Шийдвэрлэсэн зөрчил: <b>${resolvedFindings}</b>`);
    }

    if (settings.enabled("weekly_include_voice_breakdown", "true")) {
      lines.push(`Ажилчдын дуу хоолой: <b>${voices?.length ?? 0}</b>`);
    }

    if (settings.enabled("weekly_include_risk_trend", "true")) {
      lines.push(``);
      lines.push(`7 хоногийн High/Critical зөрчил: <b>${weeklyHighFindings}</b>`);
      lines.push(`7 хоногийн High/Critical Voice: <b>${weeklyHighVoices}</b>`);
    }

    if (settings.enabled("weekly_include_compliance_score", "true")) {
      lines.push(`Журмын хэрэгжилт: <b>${complianceScore}%</b>`);
    }

    lines.push(``);
    lines.push(`━━━━━━━━━━━━`);
    lines.push(``);
    lines.push(`📍 <b>Одоогийн нээлттэй төлөв</b>`);
    lines.push(``);
    lines.push(`Нээлттэй зөрчил: <b>${openFindings}</b>`);
    lines.push(`Нээлттэй өндөр/ноцтой зөрчил: <b>${openHighFindings}</b>`);
    lines.push(`Нээлттэй Ажилчдын дуу хоолой: <b>${openVoices}</b>`);
    lines.push(`Нээлттэй дуу хоолойн эрдсэл: <b>${openRiskVoices}</b>`);

    if (settings.enabled("weekly_include_top_issues", "true")) {
      lines.push(``);
      lines.push(`━━━━━━━━━━━━`);
      lines.push(``);
      lines.push(`🏷 <b>Top issues</b>`);
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
        lines.push(`Дуу хоолойн топ ангилал:`);
        topVoiceCategories.forEach(([name, count], index) => {
          lines.push(`${index + 1}. ${name}: <b>${count}</b>`);
        });
      } else {
        lines.push(`Дуу хоолойн топ ангилал: бүртгэлгүй`);
      }
    }

    if (settings.enabled("weekly_include_ai_summary", "true")) {
      const totalUrgent = openHighFindings + openRiskVoices;
      const weeklyUrgent = weeklyHighFindings + weeklyHighVoices;

      lines.push(``);
      lines.push(`━━━━━━━━━━━━`);
      lines.push(``);
      lines.push(`🤖 <b>AI 7 хоногийн гүйцэтгэлийн хураангуй</b>`);
      lines.push(``);

      lines.push(
        `• Энэ 7 хоногт ${findings?.length ?? 0} зөрчил, ${
          voices?.length ?? 0
        } ажилтны дуу хоолой бүртгэгдсэн.`
      );

      if (weeklyUrgent > 0) {
        lines.push(
          `• 7 хоногийн хугацаанд өндөр/ноцтой түвшний <b>${weeklyUrgent}</b> шинэ эрсдэл бүртгэгдсэн.`
        );
      } else {
        lines.push(`• Энэ 7 хоногт шинэ өндөр/ноцтой эрсдэл бүртгэгдээгүй.`);
      }

      if (totalUrgent > 0) {
        lines.push(
          `• Одоогоор удирдлагын анхаарал шаардсан <b>${totalUrgent}</b> нээлттэй эрсдэл байна.`
        );
      } else {
        lines.push(`• Одоогоор өндөр/ноцтой нээлттэй эрсдэл бүртгэгдээгүй байна.`);
      }

      if (complianceScore > 0) {
        lines.push(`• Журмын хэрэгжилтийн одоогийн түвшин <b>${complianceScore}%</b> байна.`);
      }
    }

    lines.push(``);
    lines.push(`Тайлан автоматаар илгээгдэв.`);

    const message = lines.join("\n");

    const recipients = await getTelegramReportRecipients("weekly");

    if (!recipients || recipients.length === 0) {
      return NextResponse.json({
        ok: true,
        skipped: "No weekly report recipients",
      });
    }

    for (const user of recipients) {
      if (!user.telegram_id) continue;
      await sendTelegramMessage(String(user.telegram_id), message);
    }

    return NextResponse.json({
      ok: true,
      sent: true,
      type: "weekly",
      recipients: recipients.length,
      range: range.label,

      weekly: {
        inspections: inspections?.length ?? 0,
        findings: findings?.length ?? 0,
        voices: voices?.length ?? 0,
        highFindings: weeklyHighFindings,
        highVoices: weeklyHighVoices,
        resolvedFindings,
        complianceScore,
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
        error: error.message || "Weekly report failed",
      },
      { status: 500 }
    );
  }
}