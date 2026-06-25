import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const admin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { settings } = await req.json();

    if (!settings || typeof settings !== "object") {
      return NextResponse.json(
        { error: "settings object required" },
        { status: 400 }
      );
    }

    const rows = Object.entries(settings).map(([key, value]) => ({
      key,
      value: String(value),
    }));

    const { error } = await admin
      .from("system_settings")
      .upsert(rows, { onConflict: "key" });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "System settings update failed" },
      { status: 500 }
    );
  }
}