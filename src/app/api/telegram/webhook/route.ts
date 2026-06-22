import { NextResponse } from "next/server";
import { sendTelegramMessage } from "@/lib/telegram/sendMessage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    console.log("TELEGRAM UPDATE:", JSON.stringify(body, null, 2));

    const message = body.message;
    const chatId = String(message?.chat?.id || "");
    const text = message?.text || "";

    console.log("TELEGRAM CHAT ID:", chatId);
    console.log("TELEGRAM TEXT:", text);

    // unknown command or normal text → AI
  if (text && !text.startsWith("/")) {
    await sendTelegramMessage(chatId, "AI боловсруулж байна...");

    const aiRes = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/ai/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: text,
      }),
    });

    const aiData = await aiRes.json();

    await sendTelegramMessage(
      chatId,
      aiData.answer || aiData.summary || "AI хариу үүсгэж чадсангүй."
    );

    return NextResponse.json({ ok: true });
  }

    return NextResponse.json({ ok: true });
    } catch (error: any) {
      console.error("WEBHOOK ERROR:", error?.message || error);

      return NextResponse.json({
        ok: true,
        handled: false,
        error: error?.message || "Webhook error",
      });
    }
    
}