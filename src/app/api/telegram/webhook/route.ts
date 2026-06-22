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

function getCommand(text: string) {
  if (!text) return "";
  return text.trim().split(" ")[0].toLowerCase();
}

function removeCommand(text: string) {
  return text.trim().split(" ").slice(1).join(" ").trim();
}

export async function POST(req: Request) {

  const body = await req.json();

    console.log(
      "TELEGRAM UPDATE:",
      JSON.stringify(body, null, 2)
    );


  try {
    const secret = req.headers.get("x-telegram-bot-api-secret-token");

    if (secret !== process.env.TELEGRAM_WEBHOOK_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const update = await req.json();

    const message = update.message;
    if (!message) {
      return NextResponse.json({ ok: true });
    }

    const chatId = String(message.chat.id);
    const telegramId = String(message.from.id);
    const username = message.from.username || "";
    const fullName = [message.from.first_name, message.from.last_name]
      .filter(Boolean)
      .join(" ");

    const text = message.text || "";
    const command = getCommand(text);
    const content = removeCommand(text);

    const { data: tgUser } = await supabase
      .from("telegram_users")
      .select("*")
      .eq("telegram_id", telegramId)
      .maybeSingle();

    if (!tgUser) {
      await supabase.from("telegram_users").insert({
        telegram_id: telegramId,
        username,
        full_name: fullName,
        role: "employee",
        status: "active",
      });
    }

    const userRole = tgUser?.role || "employee";

    await supabase.from("telegram_messages").insert({
      telegram_id: telegramId,
      username,
      role: userRole,
      message: text,
      command,
      module: "telegram",
      payload: update,
    });

    if (command === "/start") {
      await sendTelegramMessage(
        chatId,
        `Сайн байна уу, <b>${fullName || username || "хэрэглэгч"}</b>.\n\nINSPECT.MN Telegram Bot ажиллаж байна.\n\nКомандууд:\n/help\n/voice санал\n/ask асуулт\n/report`
      );

      return NextResponse.json({ ok: true });
    }

    if (command === "/help") {
      await sendTelegramMessage(
        chatId,
        `<b>INSPECT.MN Bot командууд</b>\n\n/voice [текст] - Employee Voice санал илгээх\n/ask [асуулт] - AI Assistant-аас асуух\n/report - Товч dashboard мэдээлэл авах\n/profile - Telegram profile харах`
      );

      return NextResponse.json({ ok: true });
    }

    if (command === "/profile") {
      await sendTelegramMessage(
        chatId,
        `<b>Таны Telegram profile</b>\n\nНэр: ${fullName || "-"}\nUsername: ${username || "-"}\nRole: ${userRole}\nTelegram ID: ${telegramId}`
      );

      return NextResponse.json({ ok: true });
    }

    if (command === "/voice") {
      if (!content) {
        await sendTelegramMessage(
          chatId,
          "Саналын текстээ бичнэ үү.\n\nЖишээ:\n/voice Ажлын байрны гэрэлтүүлэг сайжруулах шаардлагатай байна."
        );

        return NextResponse.json({ ok: true });
      }

      await supabase.from("employee_voice").insert({
        title: content.slice(0, 80),
        description: content,
        category: "suggestion",
        type: "suggestion",
        status: "new",
        priority: "medium",
        submitted_by: fullName || username || telegramId,
        department: tgUser?.department || null,
        is_anonymous: false,
        voice_date: new Date().toISOString().slice(0, 10),
      });

      await sendTelegramMessage(
        chatId,
        "✅ Таны санал Employee Voice бүртгэлд амжилттай хадгалагдлаа."
      );

      return NextResponse.json({ ok: true });
    }

    if (command === "/ask") {
      if (!content) {
        await sendTelegramMessage(
          chatId,
          "AI-аас асуух асуултаа бичнэ үү.\n\nЖишээ:\n/ask Энэ сарын хамгийн өндөр эрсдэл юу байна?"
        );

        return NextResponse.json({ ok: true });
      }

      const [findings, compliance, research, voice] = await Promise.all([
        supabase.from("findings").select("*").limit(50),
        supabase.from("compliance_items").select("*").limit(50),
        supabase.from("research_projects").select("*").limit(50),
        supabase.from("employee_voice").select("*").limit(50),
      ]);

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "Та INSPECT.MN дотоод хяналтын AI туслах. Зөвхөн өгөгдөлд тулгуурлан Монгол хэлээр товч, хэрэгжүүлэх боломжтой зөвлөмжтэй хариул.",
          },
          {
            role: "user",
            content: `
Supabase data:
Findings: ${JSON.stringify(findings.data)}
Compliance: ${JSON.stringify(compliance.data)}
Research: ${JSON.stringify(research.data)}
Employee Voice: ${JSON.stringify(voice.data)}

Question:
${content}
`,
          },
        ],
      });

      const answer =
        completion.choices[0].message.content || "AI хариу үүсгэж чадсангүй.";

      await sendTelegramMessage(chatId, answer);

      return NextResponse.json({ ok: true });
    }

    if (command === "/report") {
      if (!["ceo", "admin", "manager", "inspector"].includes(userRole)) {
        await sendTelegramMessage(
          chatId,
          "⛔ Энэ командыг ашиглах эрх хүрэлцэхгүй байна."
        );

        return NextResponse.json({ ok: true });
      }

      const [findings, compliance, research, voice] = await Promise.all([
        supabase.from("findings").select("*"),
        supabase.from("compliance_items").select("*"),
        supabase.from("research_projects").select("*"),
        supabase.from("employee_voice").select("*"),
      ]);

      const openFindings =
        findings.data?.filter((x: any) => x.status !== "closed").length || 0;

      const report = `
<b>INSPECT.MN товч тайлан</b>

Зөрчил: ${findings.data?.length || 0}
Нээлттэй зөрчил: ${openFindings}
Compliance бүртгэл: ${compliance.data?.length || 0}
R&D ажил: ${research.data?.length || 0}
Employee Voice: ${voice.data?.length || 0}
`;

      await sendTelegramMessage(chatId, report);

      return NextResponse.json({ ok: true });
    }

    await sendTelegramMessage(
      chatId,
      "Команд танигдсангүй. /help гэж бичиж боломжит командуудыг харна уу."
    );

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Telegram webhook error" },
      { status: 500 }
    );
  }
}