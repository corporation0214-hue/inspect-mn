import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceKey) {
      return NextResponse.json(
        { error: "Supabase env variables missing" },
        { status: 500 }
      );
    }

    const admin = createClient(supabaseUrl, serviceKey);

    const {
      id,
      full_name,
      role,
      department,
      position,
      status,
      receive_daily_report,
      receive_weekly_report,
      receive_monthly_report,
    } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "Telegram user id required" },
        { status: 400 }
      );
    }

    const { error } = await admin
      .from("telegram_users")
      .update({
        full_name,
        role,
        department,
        position,
        status,
        receive_daily_report,
        receive_weekly_report,
        receive_monthly_report,

        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Telegram user update failed" },
      { status: 500 }
    );
  }
}