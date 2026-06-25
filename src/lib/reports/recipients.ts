import { adminSupabase } from "@/lib/supabase/admin";

export async function getTelegramReportRecipients(
  reportType: "daily" | "weekly" | "monthly"
) {
  const column =
    reportType === "daily"
      ? "receive_daily_report"
      : reportType === "weekly"
      ? "receive_weekly_report"
      : "receive_monthly_report";

  const { data, error } = await adminSupabase
    .from("telegram_users")
    .select("id, telegram_id, full_name, role, status")
    .eq(column, true)
    .eq("status", "active");

  if (error) throw new Error(error.message);

  return data ?? [];
}