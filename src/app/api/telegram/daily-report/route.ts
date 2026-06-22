import { NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";
import { sendTelegramMessage } from "@/lib/telegram/sendMessage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: Request) {
  try {
    const auth = req.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && auth !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: ceos } = await supabase
      .from("telegram_users")
      .select("*")
      .in("role", ["ceo", "admin"])
      .eq("status", "active");

    if (!ceos?.length) {
      return NextResponse.json({ ok: true, message: "No CEO/admin users" });
    }

    const [findings, compliance, research, voice] = await Promise.all([
      supabase.from("findings").select("*").limit(100),
      supabase.from("compliance_items").select("*").limit(100),
      supabase.from("research_projects").select("*").limit(100),
      supabase.from("employee_voice").select("*").limit(100),
    ]);

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Та INSPECT.MN CEO daily report AI. Монгол хэлээр маш товч, удирдлагын түвшинд хариул.",
        },
        {
          role: "user",
          content: `
Өнөөдрийн INSPECT.MN daily report гарга.

Findings:
${JSON.stringify(findings.data || [])}

Compliance:
${JSON.stringify(compliance.data || [])}

Research:
${JSON.stringify(research.data || [])}

Employee Voice:
${JSON.stringify(voice.data || [])}

Формат:
📊 INSPECT DAILY REPORT
1. Товч дүгнэлт
2. Өндөр эрсдэл
3. Анхаарах асуудал
4. Өнөөдрийн зөвлөмж
`,
        },
      ],
    });

    const report =
      completion.choices[0].message.content || "Daily report үүссэнгүй.";

    for (const ceo of ceos) {
      await sendTelegramMessage(String(ceo.telegram_id), report);
    }

    return NextResponse.json({ ok: true, sent: ceos.length });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Daily report failed" },
      { status: 500 }
    );
  }
}