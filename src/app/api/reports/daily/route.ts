import { NextResponse } from "next/server";
import { adminSupabase } from "@/lib/supabase/admin";
import { sendTelegramMessage } from "@/lib/telegram/sendMessage";
import { getSystemSettings } from "@/lib/reports/settings";
import { getTelegramReportRecipients } from "@/lib/reports/recipients";
import { getDailyRange } from "@/lib/reports/dateRange";

const CLOSED_STATUSES = ["closed", "resolved", "fixed", "mitigated", "reviewed"];
const HIGH_RISK_LEVELS = ["high", "critical"];

function isClosed(status: any) {
  return CLOSED_STATUSES.includes(String(status || "").toLowerCase());
}

function isHighRisk(value: any) {
  return HIGH_RISK_LEVELS.includes(String(value || "").toLowerCase());
}

export async function GET() {
  try {
    const settings = await getSystemSettings();

    if (!settings.enabled("daily_report_enabled", "true")) {
      return NextResponse.json({
        ok: true,
        skipped: "daily report disabled",
      });
    }

    if (!settings.enabled("report_telegram_enabled", "true")) {
      return NextResponse.json({
        ok: true,
        skipped: "telegram report disabled",
      });
    }

    const range = getDailyRange();

    // Өнөөдөр үүссэн бүртгэлүүд
    const { data: todayInspections } = await adminSupabase
      .from("inspections")
      .select("*")
      .gte("created_at", range.from)
      .lte("created_at", range.to);

    const { data: todayFindings } = await adminSupabase
      .from("findings")
      .select("*")
      .gte("created_at", range.from)
      .lte("created_at", range.to);

    const { data: todayVoices } = await adminSupabase
      .from("employee_voice")
      .select("*")
      .gte("created_at", range.from)
      .lte("created_at", range.to);

    // Нийт одоогийн төлөв
    const { data: allFindings } = await adminSupabase
      .from("findings")
      .select("*");

    const { data: allVoices } = await adminSupabase
      .from("employee_voice")
      .select("*");

    const todayHighFindings =
      todayFindings?.filter((x: any) => isHighRisk(x.severity || x.risk_level || x.priority))
        .length ?? 0;

    const todayHighVoices =
      todayVoices?.filter((x: any) => isHighRisk(x.priority || x.severity || x.risk_level))
        .length ?? 0;

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

    const resolvedToday =
      todayFindings?.filter((x: any) => isClosed(x.status)).length ?? 0;

    const lines = [
      `📊 <b>INSPECT.MN Daily Report</b>`,
      ``,
      `📅 Огноо: ${range.label}`,
      ``,
      `━━━━━━━━━━━━`,
      ``,
      `🆕 <b>Өнөөдөр</b>`,
      ``,
    ];

    if (settings.enabled("daily_include_inspection", "true")) {
      lines.push(`Хяналт шалгалт: <b>${todayInspections?.length ?? 0}</b>`);
    }

    if (settings.enabled("daily_include_findings", "true")) {
      lines.push(`Илэрсэн зөрчил: <b>${todayFindings?.length ?? 0}</b>`);
    }

    if (settings.enabled("daily_include_voice", "true")) {
      lines.push(`Ажилтны дуу хоолой: <b>${todayVoices?.length ?? 0}</b>`);
    }

    if (settings.enabled("daily_include_high_risk", "true")) {
      lines.push(`Өнөөдрийн өндөр/ноцтой зөрчил: <b>${todayHighFindings}</b>`);
      lines.push(`Өнөөдрийн өндөр/ноцтой дуу хоолой: <b>${todayHighVoices}</b>`);
    }

    lines.push(``);
    lines.push(`━━━━━━━━━━━━`);
    lines.push(``);
    lines.push(`📌 <b>Одоогийн нөхцөл</b>`);
    lines.push(``);

    if (settings.enabled("daily_include_findings", "true")) {
      lines.push(`Нээлттэй зөрчил: <b>${openFindings}</b>`);
    }

    if (settings.enabled("daily_include_high_risk", "true")) {
      lines.push(`Нээлттэй High/Critical зөрчил: <b>${openHighFindings}</b>`);
    }

    if (settings.enabled("daily_include_voice", "true")) {
      lines.push(`Нээлттэй Employee Voice: <b>${openVoices}</b>`);
      lines.push(`Нээлттэй Voice Risk: <b>${openRiskVoices}</b>`);
    }

    if (settings.enabled("daily_include_actions", "true")) {
      lines.push(`Өнөөдөр шийдэгдсэн зөрчил: <b>${resolvedToday}</b>`);
    }

    if (settings.enabled("daily_include_ai_summary", "true")) {
      const totalUrgent = openHighFindings + openRiskVoices;

      lines.push(``);
      lines.push(`━━━━━━━━━━━━`);
      lines.push(``);
      lines.push(`🤖 <b>AI Executive Summary</b>`);
      lines.push(``);

      if (totalUrgent > 0) {
        lines.push(
          `• Нээлттэй өндөр/ноцтой эрсдэлийн нийт <b>${totalUrgent}</b> бүртгэл байна.`
        );
        lines.push(
          `• Удирдлагын анхаарал шаардлагатай асуудлуудыг түрүүлж хаах хэрэгтэй.`
        );
      } else {
        lines.push(`• Одоогоор өндөр/ноцтой нээлттэй эрсдэл бүртгэгдээгүй байна.`);
      }

      if ((todayFindings?.length ?? 0) > 0 || (todayVoices?.length ?? 0) > 0) {
        lines.push(
          `• Өнөөдөр ${todayFindings?.length ?? 0} зөрчил, ${
            todayVoices?.length ?? 0
          } ажилтны дуу хоолой бүртгэгдсэн.`
        );
      } else {
        lines.push(`• Өнөөдөр шинэ зөрчил болон ажилтны дуу хоолой бүртгэгдээгүй байна.`);
      }
    }

    lines.push(``);
    lines.push(`Тайлан автоматаар илгээгдэв.`);

    const message = lines.join("\n");

    const recipients = await getTelegramReportRecipients("daily");

    if (!recipients || recipients.length === 0) {
      return NextResponse.json({
        ok: true,
        skipped: "No daily report recipients",
      });
    }

    for (const user of recipients) {
      if (!user.telegram_id) continue;
      await sendTelegramMessage(String(user.telegram_id), message);
    }

    return NextResponse.json({
      ok: true,
      sent: true,
      type: "daily",
      recipients: recipients.length,
      date: range.label,

      today: {
        inspections: todayInspections?.length ?? 0,
        findings: todayFindings?.length ?? 0,
        voices: todayVoices?.length ?? 0,
        highFindings: todayHighFindings,
        highVoices: todayHighVoices,
      },

      current: {
        openFindings,
        openHighFindings,
        openVoices,
        openRiskVoices,
        resolvedToday,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        ok: false,
        error: error.message || "Daily report failed",
      },
      { status: 500 }
    );
  }
}