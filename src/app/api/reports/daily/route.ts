import { NextResponse } from "next/server";
import { adminSupabase } from "@/lib/supabase/admin";
import { sendTelegramMessage } from "@/lib/telegram/sendMessage";

function todayOnly() {
  return new Date().toISOString().slice(0, 10);
}

export async function GET() {
  const today = todayOnly();

  const { data: settings } = await adminSupabase
    .from("system_settings")
    .select("*");

  const getSetting = (key: string, fallback = "") =>
    settings?.find((x) => x.key === key)?.value ?? fallback;

  if (getSetting("daily_report_enabled", "true") !== "true") {
    return NextResponse.json({ ok: true, skipped: "daily report disabled" });
  }

  const { data: inspections } = await adminSupabase
    .from("inspections")
    .select("*")
    .gte("created_at", `${today}T00:00:00`)
    .lte("created_at", `${today}T23:59:59`);

  const { data: findings } = await adminSupabase
    .from("findings")
    .select("*")
    .gte("created_at", `${today}T00:00:00`)
    .lte("created_at", `${today}T23:59:59`);

  const { data: voices } = await adminSupabase
    .from("employee_voice")
    .select("*")
    .gte("created_at", `${today}T00:00:00`)
    .lte("created_at", `${today}T23:59:59`);

  const highRisk =
    findings?.filter((x) =>
      ["high", "critical"].includes(String(x.severity || "").toLowerCase())
    ).length ?? 0;

  const voiceRisk =
    voices?.filter((x) =>
      ["high", "critical"].includes(String(x.priority || "").toLowerCase())
    ).length ?? 0;

  const message = `
📊 <b>INSPECT.MN Daily Report</b>

Огноо: ${today}

Хяналт шалгалт: <b>${inspections?.length ?? 0}</b>
Илэрсэн зөрчил: <b>${findings?.length ?? 0}</b>
Ажилчдын дуу, хоолой: <b>${voices?.length ?? 0}</b>

Өндөр/Ноцтой зөрчил: <b>${highRisk}</b>
Өндөр/Ноцтой дуу хоолой: <b>${voiceRisk}</b>

Тайлан автоматаар илгээгдэв.
`;

  const { data: recipients, error: recipientsError } = await adminSupabase
    .from("telegram_users")
    .select("telegram_id, full_name, role, receive_daily_report, status")
    .eq("receive_daily_report", true)
    .eq("status", "active");

  if (recipientsError) {
    return NextResponse.json(
      { ok: false, error: recipientsError.message },
      { status: 400 }
    );
  }

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
    recipients: recipients.length,
    date: today,
    inspections: inspections?.length ?? 0,
    findings: findings?.length ?? 0,
    voices: voices?.length ?? 0,
  });
}